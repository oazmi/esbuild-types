export declare type Target = "esnext" | "es6" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020";
export declare type Platform = "browser" | "node";
export declare type Format = "iife" | "cjs";
export declare type Loader = "js" | "jsx" | "ts" | "tsx" | "json" | "text" | "base64";
interface CommonOptions {
    sourcemap?: boolean;
    errorLimit?: number;
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
}
export interface BuildOptions extends CommonOptions {
    name?: string;
    bundle?: boolean;
    outfile?: string;
    outdir?: string;
    platform?: Platform;
    format?: Format;
    color?: boolean;
    external?: string[];
    loader?: {
        [ext: string]: Loader;
    };
    entryPoints: string[];
    stdio?: "pipe" | "ignore" | "inherit" | ("pipe" | "ignore" | "inherit" | number | null | undefined)[];
}
export interface Message {
    text: string;
    location: null | {
        file: string;
        line: string;
        column: string;
    };
}
export interface BuildResult {
    stderr: string;
    warnings: Message[];
}
export interface BuildFailure extends Error {
    stderr: string;
    errors: Message[];
    warnings: Message[];
}
export declare function build(options: BuildOptions): Promise<BuildResult>;
export declare function startService(): Promise<Service>;
interface Service {
    transform(file: string, options: TransformOptions): Promise<TransformResult>;
    stop(): void;
}
export interface TransformOptions extends CommonOptions {
    loader?: Loader;
}
export interface TransformResult {
    js?: string;
    jsSourceMap?: string;
    warnings: Message[];
}
export interface TransformFailure extends Error {
    errors: Message[];
    warnings: Message[];
}
export {};
//# sourceMappingURL=mod.d.ts.map