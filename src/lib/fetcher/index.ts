import { DEFAULTS } from "./constants";
import { validateUrl } from "./guard";
import { fetchWithTimeout } from "./fetch";
import { normalizeMime, isAllowedMime } from "./mime";
import {
  precheckContentLength,
  readToBufferWithLimit,
  bufferToDataUri,
} from "./stream";
import type { FetchImageOptions, FetchImageResult } from "./types";

// Public API: fetch external image safely and return a data URI
export async function fetchImageDataUri(
  urlStr: string,
  opts: FetchImageOptions = {}
): Promise<FetchImageResult> {
  const o = { ...DEFAULTS, ...opts };

  // 1) Initial URL validation (scheme + host policy)
  const v = validateUrl(urlStr, o.allowedHosts);
  if (!v.ok) return { ok: false, error: v.error };

  // 2) Fetch with timeout
  const fr = await fetchWithTimeout(v.url, o.timeoutMs, {
    "User-Agent": o.userAgent,
  });
  if (!fr.ok) {
    return { ok: false, error: fr.error };
  }
  const res = fr.res;

  // 3) Final URL revalidation after redirects
  try {
    const finalUrl = new URL(res.url);
    const finalCheck = validateUrl(finalUrl.toString(), o.allowedHosts);
    if (!finalCheck.ok) return { ok: false, error: finalCheck.error };
  } catch {
    // If URL parsing fails, treat as invalid
    return { ok: false, error: "invalid-url" };
  }

  // 4) HTTP status check
  if (!res.ok) {
    return { ok: false, error: "http-error", status: res.status };
  }

  // 5) MIME validation
  const mime = normalizeMime(res.headers.get("content-type"));
  if (!isAllowedMime(mime, o.allowedMimes)) {
    return { ok: false, error: "unsupported-mime" };
  }

  // 6) Content-Length precheck (if available)
  const tooBig = precheckContentLength(res, o.maxBytes);
  if (tooBig) return tooBig;

  // 7) Stream with hard size limit
  const read = await readToBufferWithLimit(res, o.maxBytes);
  if (!read.ok) return read;

  // 8) Convert to data URI
  const dataUri = bufferToDataUri(read.buffer, mime);
  return { ok: true, dataUri, mime, bytes: read.buffer.length };
}

// Re-export types if you want consumers to import from "@/lib/fetcher"
export * from "./types";
