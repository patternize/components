/**
 * Small, dependency-free color utilities used by the theme system and the
 * value -> color scales. Everything operates on `#rrggbb` hex strings.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export const clamp = (v: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, v));

export const hexToRgb = (hex: string): RGB => {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const int = parseInt(h, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
};

export const rgbToHex = ({ r, g, b }: RGB): string => {
  const toHex = (v: number) =>
    Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/** Linearly interpolate between two hex colors. `t` in [0, 1]. */
export const mix = (a: string, b: string, t: number): string => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const k = clamp(t);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * k,
    g: ca.g + (cb.g - ca.g) * k,
    b: ca.b + (cb.b - ca.b) * k
  });
};

export const lighten = (hex: string, amount: number): string =>
  mix(hex, '#ffffff', amount);

export const darken = (hex: string, amount: number): string =>
  mix(hex, '#000000', amount);

/** Add an alpha channel, returning an `rgba()` string. */
export const alpha = (hex: string, a: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(a)})`;
};

/**
 * Build a 10-step tint/shade ramp (50..900) from a single base color, the
 * base landing near step 500. Handy for theming from one configurable color.
 */
export const ramp = (base: string): Record<number, string> => ({
  50: lighten(base, 0.9),
  100: lighten(base, 0.8),
  200: lighten(base, 0.6),
  300: lighten(base, 0.4),
  400: lighten(base, 0.2),
  500: base,
  600: darken(base, 0.12),
  700: darken(base, 0.24),
  800: darken(base, 0.36),
  900: darken(base, 0.5)
});

/** Pick black or white text for best contrast on `bg`. */
export const readableText = (bg: string): string => {
  const { r, g, b } = hexToRgb(bg);
  // Perceived luminance (sRGB approximation).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff';
};
