/**
 * Escape special characters for safe use inside SVG/HTML text nodes.
 */
export function esc(s = ""): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Truncate a string to a given length and add an ellipsis (…) if needed.
 */
export function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, Math.max(0, max - 1)) + "…" : s;
}
