import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a #rrggbb hex color to the "h s% l%" string used by CSS vars. */
export function hexToHslString(hex: string): string {
  let h = hex.replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let sat = 0;
  const lig = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = lig > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / d + 2;
        break;
      default:
        hue = (r - g) / d + 4;
    }
    hue /= 6;
  }
  return `${Math.round(hue * 360)} ${Math.round(sat * 100)}% ${Math.round(
    lig * 100
  )}%`;
}
