// MIME helpers: simple checks and normalization

// Extract the MIME (without parameters) from a Content-Type header value.
// e.g. "image/png; charset=binary" -> "image/png"
export function normalizeMime(contentTypeHeader: string | null): string {
  if (!contentTypeHeader) return "";
  return contentTypeHeader.split(";")[0].trim().toLowerCase();
}

// Check if a MIME matches an allowed pattern (e.g., /^image\/(png|jpe?g|webp)$/i)
export function isAllowedMime(mime: string, allowed: RegExp): boolean {
  if (!mime) return false;
  return allowed.test(mime);
}
