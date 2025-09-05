// Centralized layout specs for the Reading Card.
// Tweak these values to change design without touching rendering logic.

export const CANVAS = {
  w: 600,
  h: 220,
  pad: 16,
} as const;

export const FRAME = {
  rx: 16,        // outer background corner radius
  strokeWidth: 1 // card border width
} as const;

export const CARD = {
  rx: 12,        // inner card corner radius
} as const;

export const COVER = {
  x: 24,
  y: 24,
  w: 132,
  h: 180,
  r: 12,         // cover corner radius
} as const;

// Horizontal spacing between cover and text block + text baselines
export const TEXT = {
  xOffset: 20,   // text starts at COVER.x + COVER.w + xOffset
  labelY: 50,
  titleY: 92,
  authorY: 122,
} as const;

// Progress bar geometry (render only when progress > 0)
export const BAR = {
  w: 360,
  h: 8,
  y: 150,
} as const;

// Derived helpers
export function textStartX() {
  return COVER.x + COVER.w + TEXT.xOffset;
}

export function innerSize() {
  const innerW = CANVAS.w - CANVAS.pad * 2;
  const innerH = CANVAS.h - CANVAS.pad * 2;
  return { innerW, innerH };
}
