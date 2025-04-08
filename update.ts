/** this script downloads the esbuild type-definitions from [npm](npmjs.org), and saves it to `./src/mod.ts`. */

import { ensureFile, identifyCurrentRuntime, writeTextFile } from "jsr:@oazmi/kitchensink@0.9.14/crossenv"
import { joinPaths } from "jsr:@oazmi/kitchensink@0.9.14/pathman"
import { isSatisfying as semverIsSatisfying, minSatisfying as semverMinSatisfying, parse as semverParse, stringify as semverStringify } from "jsr:@oazmi/kitchensink@0.9.14/semver"
import { UntarStream } from "jsr:@std/tar@0.1.6/untar-stream"
import { jsonFmt, newlineLfToCrlf, processExit, removeGlobalDeclarationFromTypescript, streamToBytes, tsFmt, txt_decoder } from "./funcdefs.ts"


// configurable variable
const
	deno_config_path = import.meta.resolve("./deno.json"),
	output_path = import.meta.resolve("./src/mod.ts"),
	runtime_id = identifyCurrentRuntime()

// computed variables
const
	deno_config = await (await fetch(deno_config_path)).json(),
	current_esbuild_types_version = semverParse(deno_config.version)!,
	current_esbuild_types_range = semverStringify({ major: current_esbuild_types_version.major, minor: current_esbuild_types_version.minor }),
	current_esbuild_npm_metainfo = await (await fetch("https://registry.npmjs.org/esbuild")).json(),
	current_esbuild_npm_versions = Object.keys(current_esbuild_npm_metainfo.versions),
	latest_esbuild_npm_version = current_esbuild_npm_metainfo["dist-tags"]["latest"] as string

// if the latest version of esbuild equals to the current major+minor version of this library,
// then there is nothing to update.
if (semverIsSatisfying(latest_esbuild_npm_version, current_esbuild_types_range)) {
	console.log("%c" + `this library's type-definitions is up to date with "npm:esbuild@${current_esbuild_types_range}"`, "color: green; font-weight: bold;")
	console.log("%c" + `now exiting the update script.`, "color: orange; font-weight: bold;")
	processExit(runtime_id)
}

const esbuild_satisfying_version = semverMinSatisfying(current_esbuild_npm_versions, ">" + current_esbuild_types_range)!
console.log("%c" + `this library's type-definitions have not caught up to "npm:esbuild@${latest_esbuild_npm_version}"`, "color: red; font-weight: bold;")
console.log("%c" + `bumping this library's type-definition version from "${deno_config.version}" to the next closest esbuild version "${esbuild_satisfying_version}"`, "color: orange; font-weight: bold;")

// downloading the npm-package's tarball
const
	esbuild_tarball_url = current_esbuild_npm_metainfo.versions[esbuild_satisfying_version].dist.tarball as string,
	esbuild_tarball_blob = await (await fetch(esbuild_tarball_url)).blob()

// create two streams of the untar'd contents.
// the first will scan for the "package.json" file to determine the locations of the ".d.ts" file from the "types" field.
// the second will scan for the referenced ".d.ts" types-declaration file to store into the filesystem under this project.
const
	esbuild_tarball_stream1 = esbuild_tarball_blob
		.stream()
		.pipeThrough(new DecompressionStream("gzip"))
		.pipeThrough(new UntarStream()),
	esbuild_tarball_stream2 = esbuild_tarball_blob
		.stream()
		.pipeThrough(new DecompressionStream("gzip"))
		.pipeThrough(new UntarStream())

// here, we look for the "package.json" file to find the type-definitions file. (it's always "./lib/main.d.ts" by the way)
let package_json: Record<string, any> | undefined = undefined
for await (const entry of esbuild_tarball_stream1) {
	// write the type-definitions file when found.
	if (entry.path === "package/package.json" && entry.readable) {
		package_json = JSON.parse(txt_decoder.decode(await streamToBytes(entry.readable)))
		break
	} else { entry.readable?.cancel() }
}
esbuild_tarball_stream1.cancel() // canceling the stream will save up memory, since we won't be utilizing it anymore.
if (package_json === undefined) { throw new Error("failed to find the \"package.json\" file of the esbuild package.") }

const types_file_path = joinPaths("package/", package_json.types)
for await (const entry of esbuild_tarball_stream2) {
	// write the type-definitions file when found.
	if (entry.path === types_file_path && entry.readable) {
		const ts_text = removeGlobalDeclarationFromTypescript(txt_decoder.decode(await streamToBytes(entry.readable)))
		await ensureFile(runtime_id, output_path)
		await writeTextFile(runtime_id, output_path, newlineLfToCrlf(tsFmt.formatText({
			filePath: "mod.ts",
			fileText: ts_text,
		})))
	} else {
		await entry.readable?.cancel()
	}
}
esbuild_tarball_stream2.cancel()

// now that the type-definitions have been save, it is time to update our "deno.json" file to reflect the version of the esbuild we just copied the types from.
const
	esbuild_satisfying_version_obj = semverParse(esbuild_satisfying_version)!,
	new_current_version = semverStringify({ major: esbuild_satisfying_version_obj.major, minor: esbuild_satisfying_version_obj.minor, patch: 0 })
deno_config.version = new_current_version
const deno_json_text = JSON.stringify(deno_config)
await writeTextFile(runtime_id, deno_config_path, newlineLfToCrlf(jsonFmt.formatText({
	filePath: "deno.json",
	fileText: deno_json_text,
})))
