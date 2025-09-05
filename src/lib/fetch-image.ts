/**
 * Fetch an external image with safety guards and return a base64 data URI.
 * - HTTPS only
 * - Block private/loopback hosts (basic SSRF guard)
 * - Timeout
 * - MIME whitelist (png/jpeg/webp)
 * - Size limit (streamed; stop if exceeded)
 */

export type FetchImageError =
  | "invalid-url"
  | "non-https"
  | "blocked-host"
  | "timeout"
  | "http-error"
  | "unsupported-mime"
  | "too-large"
  | "fetch-failed";

export type FetchImageResult =
  | { ok: true; dataUri: string; mime: string; bytes: number }
  | { ok: false; error: FetchImageError; status?: number };

export type FetchImageOptions = {
  timeoutMs?: number;           // default 2000
  maxBytes?: number;            // default 3 MiB
  allowedMimes?: RegExp;        // default /^image\/(png|jpe?g|webp)$/i
  userAgent?: string;           // default "reading-card/1.0"
};

const DEFAULTS: Required<FetchImageOptions> = {
  timeoutMs: 2000,
  maxBytes: 3 * 1024 * 1024,
  allowedMimes: /^image\/(png|jpe?g|webp)$/i,
  userAgent: "reading-card/1.0",
};

// Basic SSRF guard: block loopback and private ranges (best-effort).
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();

  // Literal hosts
  if (["localhost", "0.0.0.0"].includes(h)) return true;

  // IPv6 loopback / unique local (very coarse)
  if (h === "::1") return true;
  if (h.startsWith("fc") || h.startsWith("fd")) return true; // fc00::/7 (rough)

  // IPv4 numeric patterns
  if (/^127\./.test(h)) return true; // loopback
  if (/^10\./.test(h)) return true;  // private
  if (/^192\.168\./.test(h)) return true; // private
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true; // private

  return false;
}

/**
 * Fetch image and return data URI or a typed error.
 */
export async function fetchImageDataUri(
  urlStr: string,
  opts: FetchImageOptions = {}
): Promise<FetchImageResult> {
  const { timeoutMs, maxBytes, allowedMimes, userAgent } = { ...DEFAULTS, ...opts };

  // URL & scheme checks
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return { ok: false, error: "invalid-url" };
  }
  if (url.protocol !== "https:") {
    return { ok: false, error: "non-https" };
  }
  if (isBlockedHost(url.hostname)) {
    return { ok: false, error: "blocked-host" };
  }

  // Fetch with timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": userAgent },
    });
  } catch {
    clearTimeout(id);
    return { ok: false, error: "fetch-failed" };
  }
  clearTimeout(id);

  if (!res.ok) {
    return { ok: false, error: "http-error", status: res.status };
  }

  // MIME check
  const mime = (res.headers.get("content-type") || "").split(";")[0].trim();
  if (!allowedMimes.test(mime)) {
    return { ok: false, error: "unsupported-mime" };
  }

  // Stream and enforce size limit without buffering the whole response first
  const reader = res.body?.getReader();
  if (!reader) {
    // Fallback (should be rare)
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > maxBytes) return { ok: false, error: "too-large" };
    const dataUri = `data:${mime};base64,${buf.toString("base64")}`;
    return { ok: true, dataUri, mime, bytes: buf.length };
  }

  let received = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > maxBytes) {
        try { reader.cancel(); } catch {}
        return { ok: false, error: "too-large" };
      }
      chunks.push(value);
    }
  }

  const buf = Buffer.concat(chunks.map((u) => Buffer.from(u)));
  const dataUri = `data:${mime};base64,${buf.toString("base64")}`;
  return { ok: true, dataUri, mime, bytes: buf.length };
}