# @oazmi/esbuild-types

this library simply re-exports esbuild's typescript declarations file, so that your client won't have to install esbuild just for its types only.

### rationale

in deno, there is no such thing as `devDependencies`, so if you write an esbuild-plugin utilizing esbuild's types,
deno will download the entirety of the esbuild package from npm, even if you only import your plugin library from [jsr](https://jsr.io).

thus, this library provides a lightweight type-definitions only alternative to `npm:esbuild`, using the same minor versioning that esbuild uses.

### example

your old horizontally-challenged phat code:

```ts
import type * as esbuild from "npm:esbuild@^0.24"

export const my_plugin: esbuild.Plugin = {
	name: "my-plugin",
	setup(build: esbuild.PluginBuild) {
		// do plugin related stuff.
	},
}
```

your new low-phat code:

```ts
import type * as esbuild from "jsr:@oazmi/esbuild-types@^0.24"

export const my_plugin: esbuild.Plugin = {
	name: "my-plugin",
	setup(build: esbuild.PluginBuild) {
		// do plugin related stuff.
	},
}
```

### internals

this package updates semi-autonomously via the [`./update.ts`](./update.ts) script.
and it uses weekly scheduled github actions to check for an update in `npm:esbuild`'s minor or major version,
to update and re-publish accordingly.

to manually bump to the next esbuild minor-version, simply execute the following command in your shell:

> deno task update-proj
