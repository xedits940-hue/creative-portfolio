export interface SafeUrlOptions {
  hosts?: string[];
}

export declare function safeExternalUrl(raw: string | null | undefined, options?: SafeUrlOptions): string | null;
export declare function openExternal(raw: string | null | undefined, options?: SafeUrlOptions): boolean;
export declare function cleanField(value: unknown, max?: number): string;
