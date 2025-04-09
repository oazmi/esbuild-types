export type Platform = "browser" | "node" | "neutral";
export type Format = "iife" | "cjs" | "esm";
export type Loader = "js" | "jsx" | "ts" | "tsx" | "css" | "json" | "text" | "base64" | "file" | "dataurl" | "binary" | "default";
export type LogLevel = "info" | "warning" | "error" | "silent";
export type Charset = "ascii" | "utf8";
export type TreeShaking = true | "ignore-annotations";
interface CommonOptions {
    sourcemap?: boolean | "inline" | "external" | "both";
    sourcesContent?: boolean;
    format?: Format;
    globalName?: string;
    target?: string | string[];
    minify?: boolean;
    minifyWhitespace?: boolean;
    minifyIdentifiers?: boolean;
    minifySyntax?: boolean;
    charset?: Charset;
    treeShaking?: TreeShaking;
    jsxFactory?: string;
    jsxFragment?: string;
    define?: {
        [key: string]: string;
    };
    pure?: string[];
    keepNames?: boolean;
    color?: boolean;
    logLevel?: LogLevel;
    logLimit?: number;
}
export interface BuildOptions extends CommonOptions {
    bundle?: boolean;
    splitting?: boolean;
    preserveSymlinks?: boolean;
    outfile?: string;
    metafile?: boolean;
    outdir?: string;
    outbase?: string;
    platform?: Platform;
    external?: string[];
    loader?: {
        [ext: string]: Loader;
    };
    resolveExtensions?: string[];
    mainFields?: string[];
    conditions?: string[];
    write?: boolean;
    tsconfig?: string;
    outExtension?: {
        [ext: string]: string;
    };
    publicPath?: string;
    chunkNames?: string;
    assetNames?: string;
    inject?: string[];
    banner?: {
        [type: string]: string;
    };
    footer?: {
        [type: string]: string;
    };
    incremental?: boolean;
    entryPoints?: string[];
    stdin?: StdinOptions;
    plugins?: Plugin[];
    absWorkingDir?: string;
    nodePaths?: string[];
    watch?: boolean | WatchMode;
}
export interface WatchMode {
    onRebuild?: (error: BuildFailure | null, result: BuildResult | null) => void;
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
    notes: Note[];
    detail: any;
}
export interface Note {
    text: string;
    location: Location | null;
}
export interface Location {
    file: string;
    namespace: string;
    line: number;
    column: number;
    length: number;
    lineText: string;
}
export interface OutputFile {
    path: string;
    contents: Uint8Array;
    text: string;
}
export interface BuildInvalidate {
    (): Promise<BuildIncremental>;
    dispose(): void;
}
export interface BuildIncremental extends BuildResult {
    rebuild: BuildInvalidate;
}
export interface BuildResult {
    warnings: Message[];
    outputFiles?: OutputFile[];
    rebuild?: BuildInvalidate;
    stop?: () => void;
    metafile?: Metafile;
}
export interface BuildFailure extends Error {
    errors: Message[];
    warnings: Message[];
}
export interface ServeOptions {
    port?: number;
    host?: string;
    servedir?: string;
    onRequest?: (args: ServeOnRequestArgs) => void;
}
export interface ServeOnRequestArgs {
    remoteAddress: string;
    method: string;
    path: string;
    status: number;
    timeInMS: number;
}
export interface ServeResult {
    port: number;
    host: string;
    wait: Promise<void>;
    stop: () => void;
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
    banner?: string;
    footer?: string;
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
export interface Plugin {
    name: string;
    setup: (build: PluginBuild) => void;
}
export interface PluginBuild {
    onResolve(options: OnResolveOptions, callback: (args: OnResolveArgs) => OnResolveResult | null | undefined | Promise<OnResolveResult | null | undefined>): void;
    onLoad(options: OnLoadOptions, callback: (args: OnLoadArgs) => OnLoadResult | null | undefined | Promise<OnLoadResult | null | undefined>): void;
}
export interface OnResolveOptions {
    filter: RegExp;
    namespace?: string;
}
export interface OnResolveArgs {
    path: string;
    importer: string;
    namespace: string;
    resolveDir: string;
    kind: ImportKind;
    pluginData: any;
}
export type ImportKind = "entry-point" | "import-statement" | "require-call" | "dynamic-import" | "require-resolve" | "import-rule" | "url-token";
export interface OnResolveResult {
    pluginName?: string;
    errors?: PartialMessage[];
    warnings?: PartialMessage[];
    path?: string;
    external?: boolean;
    namespace?: string;
    pluginData?: any;
}
export interface OnLoadOptions {
    filter: RegExp;
    namespace?: string;
}
export interface OnLoadArgs {
    path: string;
    namespace: string;
    pluginData: any;
}
export interface OnLoadResult {
    pluginName?: string;
    errors?: PartialMessage[];
    warnings?: PartialMessage[];
    contents?: string | Uint8Array;
    resolveDir?: string;
    loader?: Loader;
    pluginData?: any;
}
export interface PartialMessage {
    text?: string;
    location?: Partial<Location> | null;
    notes?: PartialNote[];
    detail?: any;
}
export interface PartialNote {
    text?: string;
    location?: Partial<Location> | null;
}
export interface Metafile {
    inputs: {
        [path: string]: {
            bytes: number;
            imports: {
                path: string;
                kind: ImportKind;
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
                kind: ImportKind;
            }[];
            exports: string[];
            entryPoint?: string;
        };
    };
}
export declare function build(options: BuildOptions & {
    write: false;
}): Promise<BuildResult & {
    outputFiles: OutputFile[];
}>;
export declare function build(options: BuildOptions & {
    incremental: true;
}): Promise<BuildIncremental>;
export declare function build(options: BuildOptions): Promise<BuildResult>;
export declare function serve(serveOptions: ServeOptions, buildOptions: BuildOptions): Promise<ServeResult>;
export declare function transform(input: string, options?: TransformOptions): Promise<TransformResult>;
export declare function buildSync(options: BuildOptions & {
    write: false;
}): BuildResult & {
    outputFiles: OutputFile[];
};
export declare function buildSync(options: BuildOptions): BuildResult;
export declare function transformSync(input: string, options?: TransformOptions): TransformResult;
export declare function initialize(options: InitializeOptions): Promise<void>;
export interface InitializeOptions {
    wasmURL?: string;
    worker?: boolean;
}
export declare let version: string;
export {};
//# sourceMappingURL=mod.d.ts.map