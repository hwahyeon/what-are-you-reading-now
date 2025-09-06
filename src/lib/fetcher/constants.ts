import type { FetchImageOptions } from "./types";

// Default options for image fetching
export const DEFAULTS: Required<Omit<FetchImageOptions, "allowedHosts">> & {
  allowedHosts?: string[] | RegExp;
} = {
  timeoutMs: 2000,
  maxBytes: 3 * 1024 * 1024, // 3 MiB
  allowedMimes: /^image\/(png|jpe?g|webp)$/i,
  userAgent: "reading-card/1.0",
  maxRedirects: 5,
  allowedHosts: undefined,
};