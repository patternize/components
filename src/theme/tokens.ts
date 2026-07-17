/**
 * Design tokens derived from DESIGN.md (Airbnb-inspired design language).
 *
 * The base canvas is pure white with near-black ink (#222222); a single
 * accent — Rausch (#ff385c) — carries every primary moment. Shape language
 * is soft: 8px buttons, ~14px cards, pill-shaped controls. Elevation is a
 * single shadow tier; everything else is flat.
 */

export const colors = {
  primary: '#ff385c', // Rausch — the single brand voltage
  primaryActive: '#e00b41',
  primaryDisabled: '#ffd1da',
  luxe: '#460479',
  plus: '#92174d',
  ink: '#222222',
  body: '#3f3f3f',
  muted: '#6a6a6a',
  mutedSoft: '#929292',
  hairline: '#dddddd',
  hairlineSoft: '#ebebeb',
  borderStrong: '#c1c1c1',
  canvas: '#ffffff',
  surfaceSoft: '#f7f7f7',
  surfaceCard: '#ffffff',
  surfaceStrong: '#f2f2f2',
  onPrimary: '#ffffff',
  onDark: '#ffffff',
  legalLink: '#428bff',
  error: '#c13515',
  scrim: 'rgba(0, 0, 0, 0.5)'
} as const;

/** Airbnb Cereal with Circular + system fallbacks (Inter is the closest open substitute). */
export const fontFamily =
  "'Airbnb Cereal VF', Circular, Inter, -apple-system, system-ui, Roboto, 'Helvetica Neue', sans-serif";

export const typography = {
  displayXl: { fontFamily, fontSize: 28, fontWeight: 700, lineHeight: 1.43 },
  displayLg: {
    fontFamily,
    fontSize: 22,
    fontWeight: 500,
    lineHeight: 1.18,
    letterSpacing: '-0.44px'
  },
  displaySm: {
    fontFamily,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.18px'
  },
  ratingDisplay: {
    fontFamily,
    fontSize: 64,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-1px'
  },
  titleMd: { fontFamily, fontSize: 16, fontWeight: 600, lineHeight: 1.25 },
  titleSm: { fontFamily, fontSize: 16, fontWeight: 500, lineHeight: 1.25 },
  bodyMd: { fontFamily, fontSize: 16, fontWeight: 400, lineHeight: 1.5 },
  bodySm: { fontFamily, fontSize: 14, fontWeight: 400, lineHeight: 1.43 },
  caption: { fontFamily, fontSize: 14, fontWeight: 500, lineHeight: 1.29 },
  captionSm: { fontFamily, fontSize: 13, fontWeight: 400, lineHeight: 1.23 },
  badge: { fontFamily, fontSize: 11, fontWeight: 600, lineHeight: 1.18 },
  microLabel: { fontFamily, fontSize: 12, fontWeight: 700, lineHeight: 1.33 }
} as const;

export const rounded = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 32,
  full: 9999
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64
} as const;

/** The system's single elevation tier — hover-floated cards and dropdowns. */
export const cardShadow =
  'rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0';
