/**
 * Chart color system, anchored to the Airbnb design language.
 *
 * The categorical order was derived computationally: every ordering of the
 * eight brand-family hues was run through a colorblind-safety validator
 * (Machado–Oliveira–Fernandes 2009 CVD simulation, OKLab ΔE) and this order
 * maximizes the minimum adjacent-pair separation. It passes all checks in
 * both light and dark modes — worst adjacent CVD ΔE 16.7 (target ≥ 8),
 * worst normal-vision ΔE 17.4 (floor ≥ 15).
 *
 * Rules of use:
 * - Assign slots in fixed order, never cycled. A 9th series folds into
 *   "Other" — never invent a hue.
 * - Scatter plots cap at the first FOUR slots (all-pairs validated).
 * - `amber` sits below 3:1 contrast on white — legal only because every
 *   chart here ships tooltips + direct labels (the relief channel).
 * - Color follows the entity, never its rank: filtering series must not
 *   repaint the survivors.
 */

/** Fixed categorical order. Slot 1 is Rausch so single-series charts wear the brand color. */
export const categorical = [
  '#ff385c', // 1 rausch — brand red-pink
  '#428bff', // 2 blue — from the design system's link blue
  '#00a699', // 3 babu — classic Airbnb teal
  '#008300', // 4 green
  '#7c4dd6', // 5 luxe purple, stepped into the chart lightness band
  '#eda100', // 6 amber (sub-3:1 on white — needs direct labels/tooltip relief)
  '#c2417f', // 7 plum — Plus magenta, stepped lighter
  '#fc642d' // 8 arches — classic Airbnb orange
] as const;

/** All-pairs safe subset for scatter/bubble charts (any two marks can be neighbors). */
export const scatterSafe = categorical.slice(0, 4);

/**
 * Sequential ramp (magnitude — heatmaps, intensity). One hue, light→dark,
 * monotone lightness, built on Babu teal.
 */
export const sequentialTeal = [
  '#e0f5f2',
  '#b3e6e0',
  '#80d5cc',
  '#4dc3b8',
  '#1ab1a4',
  '#00a699',
  '#00887e',
  '#006a62',
  '#004d47'
] as const;

/** Sequential ramp on Rausch, for a second simultaneous magnitude context. */
export const sequentialRausch = [
  '#ffe3e9',
  '#ffbfcc',
  '#ff9bb0',
  '#ff7793',
  '#ff5377',
  '#ff385c',
  '#d92b4c',
  '#b21f3c',
  '#8c142d'
] as const;

/**
 * Diverging pair (polarity around a baseline): teal ↔ rausch with a neutral
 * gray midpoint. Equal steps per arm.
 */
export const diverging = [
  '#006a62',
  '#00a699',
  '#4dc3b8',
  '#b3e6e0',
  '#f2f2f2', // neutral midpoint — never a hue
  '#ffbfcc',
  '#ff7793',
  '#ff385c',
  '#b21f3c'
] as const;

/**
 * Status scale — reserved meaning (good→critical), never reused as "series
 * N", always paired with an icon or label.
 */
export const status = {
  good: '#008a05',
  warning: '#e8a501',
  serious: '#e07912',
  critical: '#c13515' // the design system's error red
} as const;

/** Chart chrome — recessive grid/axis ink so data stays in front. */
export const chrome = {
  surface: '#ffffff',
  ink: '#222222',
  secondaryInk: '#3f3f3f',
  mutedInk: '#6a6a6a',
  axisLabel: '#6a6a6a',
  gridline: '#ebebeb',
  baseline: '#dddddd',
  crosshair: '#c1c1c1'
} as const;

/** Assign slots to series in fixed order; folds anything past 8 into gray. */
export function seriesColor(index: number): string {
  return index < categorical.length ? categorical[index] : '#929292';
}
