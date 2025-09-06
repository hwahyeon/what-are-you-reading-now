// URL/host validation utilities for safe image fetching

export type UrlValidationResult =
  | { ok: true; url: URL }
  | { ok: false; error: "invalid-url" | "non-https" | "blocked-host" };

// Block loopback/private hosts (best-effort)
export function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();

  // Literal hosts
  if (h === "localhost" || h === "0.0.0.0" || h === "::1") return true;

  // IPv6 unique local (rough)
  if (h.startsWith("fc") || h.startsWith("fd")) return true; // fc00::/7

  // IPv4 ranges
  if (/^127\./.test(h)) return true; // loopback
  if (/^10\./.test(h)) return true; // private
  if (/^192\.168\./.test(h)) return true; // private
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true; // private

  return false;
}

// Optional host allowlist checker
export function isAllowedHost(
  hostname: string,
  rule?: string[] | RegExp
): boolean {
  if (!rule) return true;
  if (Array.isArray(rule)) return rule.includes(hostname);
  return rule.test(hostname);
}

// Validate URL string + scheme + host policy
export function validateUrl(
  urlStr: string,
  allowedHosts?: string[] | RegExp
): UrlValidationResult {
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return { ok: false, error: "invalid-url" };
  }

  if (url.protocol !== "https:") {
    return { ok: false, error: "non-https" };
  }

  if (
    isBlockedHost(url.hostname) ||
    !isAllowedHost(url.hostname, allowedHosts)
  ) {
    return { ok: false, error: "blocked-host" };
  }

  return { ok: true, url };
}
