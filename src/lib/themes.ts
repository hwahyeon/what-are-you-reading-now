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
  dark: { bg: "#0b1220", card: "#0f172a", fg: "#e5e7eb", sub: "#cbd5e1", accent: "#3b82f6", frame: "#1f2937" },
  light: { bg: "#ffffff", card: "#f8fafc", fg: "#0f172a", sub: "#475569", accent: "#2563eb", frame: "#e5e7eb" },
  amber: { bg: "#fff7ed", card: "#ffedd5", fg: "#78350f", sub: "#a16207", accent: "#f59e0b", frame: "#fde68a" },
  nord: { bg: "#2e3440", card: "#3b4252", fg: "#eceff4", sub: "#d8dee9", accent: "#88c0d0", frame: "#434c5e" },
  cyberpunk: { bg: "#0a0a0f", card: "#12121c", fg: "#e0e0e0", sub: "#9ca3af", accent: "#ff00ff", frame: "#00ffff" },
  korea: { bg: "#fdfcfb", card: "#ffffff", fg: "#0f172a", sub: "#475569", accent: "#c1121f", frame: "#1e3a8a" },
  greece: { bg: "#f4f9ff", card: "#ffffff", fg: "#0a2a66", sub: "#5b7083", accent: "#1e90ff", frame: "#cce0f5" },
  soviet: { bg: "#1a0f0f", card: "#2a1616", fg: "#f5e9d0", sub: "#d4b499", accent: "#d32f2f", frame: "#f9c806" },
  monochrome: { bg: "#ffffff", card: "#ffffff", fg: "#000000", sub: "#000000", accent: "#000000", frame: "#000000" }
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
