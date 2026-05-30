/**
 * Value -> color scales for matrices, heatmaps and tensors. These are the
 * primitives that turn raw numbers into the colored cells seen in the
 * transformer / attention visualizations.
 */
import { mix } from './color';

export interface ScaleOptions {
  /** Lower bound of the data domain. */
  min: number;
  /** Upper bound of the data domain. */
  max: number;
}

const norm = (value: number, { min, max }: ScaleOptions): number => {
  if (max === min) return 0.5;
  const t = (value - min) / (max - min);
  return Math.min(1, Math.max(0, t));
};

/**
 * Sequential scale (light -> saturated) around a single hue. Used for
 * non-negative magnitudes such as attention weights.
 */
export const sequentialScale =
  (color: string, opts: ScaleOptions) =>
  (value: number): string =>
    mix('#ffffff', color, 0.12 + 0.88 * norm(value, opts));

/**
 * Diverging scale: `low` for negatives, near-white at zero, `high` for
 * positives. This matches the blue/white/red look of weight matrices.
 */
export const divergingScale =
  (low: string, high: string, opts: ScaleOptions) =>
  (value: number): string => {
    const t = norm(value, opts);
    return t < 0.5
      ? mix(low, '#ffffff', t * 2)
      : mix('#ffffff', high, (t - 0.5) * 2);
  };

/** Convenience: infer a symmetric domain from data for diverging scales. */
export const symmetricDomain = (values: number[]): ScaleOptions => {
  const m = values.reduce((acc, v) => Math.max(acc, Math.abs(v)), 0) || 1;
  return { min: -m, max: m };
};

/** Convenience: infer [min, max] from data for sequential scales. */
export const extentDomain = (values: number[]): ScaleOptions => {
  if (values.length === 0) return { min: 0, max: 1 };
  return { min: Math.min(...values), max: Math.max(...values) };
};
