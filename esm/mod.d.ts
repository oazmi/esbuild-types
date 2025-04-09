export type Platform = "browser" | "node";
export type Format = "iife" | "cjs" | "esm";
export type Loader = "js" | "jsx" | "ts" | "tsx" | "css" | "json" | "text" | "base64" | "file" | "dataurl" | "binary";
export type LogLevel = "info" | "warning" | "error" | "silent";
export type Charset = "ascii" | "utf8";
interface CommonOptions {
    sourcemap?: boolean | "inline" | "external";
    format?: Format;
    globalName?: string;
    target?: string | string[];
    minify?: boolean;
    minifyWhitespace?: boolean;
    minifyIdentifiers?: boolean;
    minifySyntax?: boolean;
    charset?: Charset;
    jsxFactory?: string;
    jsxFragment?: string;
    define?: {
        [key: string]: string;
    };
    pure?: string[];
    avoidTDZ?: boolean;
    color?: boolean;
    logLevel?: LogLevel;
    errorLimit?: number;
}
export interface BuildOptions extends CommonOptions {
    bundle?: boolean;
    splitting?: boolean;
    outfile?: string;
    metafile?: string;
    outdir?: string;
    platform?: Platform;
    color?: boolean;
    external?: string[];
    loader?: {
        [ext: string]: Loader;
    };
    resolveExtensions?: string[];
    mainFields?: string[];
    write?: boolean;
    tsconfig?: string;
    outExtension?: {
        [ext: string]: string;
    };
    publicPath?: string;
    inject?: string[];
    entryPoints?: string[];
    stdin?: StdinOptions;
}
export interface StdinOptions {
    contents: string;
    resolveDir?: string;
    sourcefile?: string;
    loader?: Loader;
}
export interface Message {
    text: string;
    location: Location | null;
}
export interface Location {
    file: string;
    line: number;
    column: number;
    length: number;
    lineText: string;
}
export interface OutputFile {
    path: string;
    contents: Uint8Array;
}
export interface BuildResult {
    warnings: Message[];
    outputFiles?: OutputFile[];
}
export interface BuildFailure extends Error {
    errors: Message[];
    warnings: Message[];
}
export interface TransformOptions extends CommonOptions {
    tsconfigRaw?: string | {
        compilerOptions?: {
            jsxFactory?: string;
            jsxFragmentFactory?: string;
            useDefineForClassFields?: boolean;
            importsNotUsedAsValues?: "remove" | "preserve" | "error";
        };
    };
    sourcefile?: string;
    loader?: Loader;
}
export interface TransformResult {
    code: string;
    map: string;
    warnings: Message[];
}
export interface TransformFailure extends Error {
    errors: Message[];
    warnings: Message[];
}
export interface Metadata {
    inputs: {
        [path: string]: {
            bytes: number;
            imports: {
                path: string;
            }[];
        };
    };
    outputs: {
        [path: string]: {
            bytes: number;
            inputs: {
                [path: string]: {
                    bytesInOutput: number;
                };
            };
            imports: {
                path: string;
            }[];
        };
    };
}
export interface Service {
    build(options: BuildOptions): Promise<BuildResult>;
    transform(input: string, options?: TransformOptions): Promise<TransformResult>;
    stop(): void;
}
export declare function build(options: BuildOptions): Promise<BuildResult>;
export declare function transform(input: string, options?: TransformOptions): Promise<TransformResult>;
export declare function buildSync(options: BuildOptions): BuildResult;
export declare function transformSync(input: string, options?: TransformOptions): TransformResult;
export declare function startService(options?: ServiceOptions): Promise<Service>;
export interface ServiceOptions {
    wasmURL?: string;
    worker?: boolean;
}
export declare let version: string;
export {};
//# sourceMappingURL=mod.d.ts.map