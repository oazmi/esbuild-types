export declare type Target = "esnext" | "es6" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020";
export declare type Platform = "browser" | "node";
export declare type Format = "iife" | "cjs" | "esm";
export declare type Loader = "js" | "jsx" | "ts" | "tsx" | "json" | "text" | "base64" | "file" | "dataurl";
export declare type LogLevel = "info" | "warning" | "error" | "silent";
export interface CommonOptions {
    sourcemap?: boolean | "inline" | "external";
    target?: Target;
    minify?: boolean;
    minifyWhitespace?: boolean;
    minifyIdentifiers?: boolean;
    minifySyntax?: boolean;
    jsxFactory?: string;
    jsxFragment?: string;
    define?: {
        [key: string]: string;
    };
    color?: boolean;
    logLevel?: LogLevel;
    errorLimit?: number;
}
export interface BuildOptions extends CommonOptions {
    globalName?: string;
    bundle?: boolean;
    outfile?: string;
    metafile?: string;
    outdir?: string;
    platform?: Platform;
    format?: Format;
    color?: boolean;
    external?: string[];
    loader?: {
        [ext: string]: Loader;
    };
    resolveExtensions?: string[];
    entryPoints: string[];
}
export interface Message {
    text: string;
    location: null | {
        file: string;
        line: number;
        column: number;
        length: number;
        lineText: string;
    };
}
export interface BuildResult {
    warnings: Message[];
}
export interface BuildFailure extends Error {
    errors: Message[];
    warnings: Message[];
}
export interface TransformOptions extends CommonOptions {
    sourcefile?: string;
    loader?: Loader;
}
export interface TransformResult {
    js: string;
    jsSourceMap: string;
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
        };
    };
}
export declare function build(options: BuildOptions): Promise<BuildResult>;
export declare function transform(input: string, options: TransformOptions): Promise<TransformResult>;
export declare function buildSync(options: BuildOptions): BuildResult;
export declare function transformSync(input: string, options: TransformOptions): TransformResult;
export declare function startService(): Promise<Service>;
export interface Service {
    build(options: BuildOptions): Promise<BuildResult>;
    transform(input: string, options: TransformOptions): Promise<TransformResult>;
    stop(): void;
}
//# sourceMappingURL=mod.d.ts.map