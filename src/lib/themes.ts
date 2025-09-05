export type ThemeKey = "dark" | "light" | "amber" | (string & {});

export type Theme = {
  bg: string;     // page background
  card: string;   // card background
  fg: string;     // main text color
  sub: string;    // secondary text color
  accent: string; // accent color (label, progress bar)
  frame: string;  // card border color
};

export const THEMES: Record<string, Theme> = {
  dark:  { bg: "#0b1220", card: "#0f172a", fg: "#e5e7eb", sub: "#cbd5e1", accent: "#3b82f6", frame: "#1f2937" },
  light: { bg: "#ffffff", card: "#f8fafc", fg: "#0f172a", sub: "#475569", accent: "#2563eb", frame: "#e5e7eb" },
  amber: { bg: "#0b0a07", card: "#14120b", fg: "#f1f5f9", sub: "#cbd5e1", accent: "#f59e0b", frame: "#2a2618" },
};

/**
 * Returns a theme object based on the given key.
 * - If key is missing, default = light
 * - If key is invalid, fallback = light
 */
export function getTheme(key: string | undefined): Theme {
  const k = (key ?? "light").toLowerCase();
  return THEMES[k] ?? THEMES.light;
}
