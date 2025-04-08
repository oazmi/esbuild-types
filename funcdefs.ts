import { createStreaming, type GlobalConfiguration as FmtGlobalConfiguration } from "jsr:@dprint/formatter@0.4.1"
import { RUNTIME, getRuntime } from "jsr:@oazmi/kitchensink@0.9.14/crossenv"
import * as ts from "npm:typescript@5"
import denoJson from "./deno.json" with { type: "json" }


const fmtGlobalConfig: FmtGlobalConfiguration = denoJson.fmt

export const tsFmt = await createStreaming(fetch("https://plugins.dprint.dev/typescript-0.94.0.wasm"))
tsFmt.setConfig(fmtGlobalConfig, {})

export const jsonFmt = await createStreaming(fetch("https://plugins.dprint.dev/json-0.20.0.wasm"))
jsonFmt.setConfig(fmtGlobalConfig, {})

export const streamToBytes = async (stream: ReadableStream<Uint8Array>): Promise<Uint8Array> => {
	return new Response(stream).bytes()
}

export const txt_decoder = new TextDecoder()

/** removes all `declare global { ... }` blocks from the provided typeScript source code.
 * 
 * @param code the typeScript source code as a string.
 * @returns the modified source code with `declare global` blocks removed.
*/
export const removeGlobalDeclarationFromTypescript = (code: string): string => {
	const sourceFile = ts.createSourceFile(
		"temp.ts",
		code,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
	// this variable will accumulate the modified code
	let transformed_code: string = ""
	// a function to process top-level nodes in the AST.
	const processNode = (node: ts.Node): void => {
		// check if the node is a `ModuleDeclaration` with the name "global" and has the `declare` modifier.
		const isDeclareGlobal = ts.isModuleDeclaration(node)
			&& node.name.kind === ts.SyntaxKind.Identifier
			&& node.name.text === "global"
			&& node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.DeclareKeyword)

		if (!isDeclareGlobal) {
			// if the node is not `declare global`, include its original text in the modified code.
			const code_str = code.slice(node.getFullStart(), node.getEnd())
			transformed_code += code_str
		}
	}
	// start processing top-level nodes
	sourceFile.forEachChild(processNode)
	return transformed_code
}

/** exits the current deno/node/bun process. */
export const processExit = (runtime_enum: RUNTIME) => {
	const runtime = getRuntime(runtime_enum)
	switch (runtime_enum) {
		case RUNTIME.DENO: {
			runtime.exit()
			break // this part is only here to appease typescript
		}
		case RUNTIME.BUN:
		case RUNTIME.NODE: {
			runtime.abort()
			break // this part is only here to appease typescript
		}
	}
}

export const newlineLfToCrlf = (text: string): string => {
	return text.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n")
}
