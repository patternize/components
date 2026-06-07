import { Theme } from '../../theme/tokens';
import {
  divergingScale,
  sequentialScale,
  symmetricDomain,
  extentDomain,
  ScaleOptions
} from '../../theme/scales';

export type ScaleKind =
  | 'diverging'
  | 'sequential'
  | 'grayscale'
  | ((value: number) => string);

export interface ResolveScaleArgs {
  kind: ScaleKind;
  values: number[];
  theme: Theme;
  color?: string;
  diverging?: { low: string; high: string };
  domain?: ScaleOptions;
}

/** Resolve a `ScaleKind` + props + theme into a `(value) => color` function. */
export const resolveScale = ({
  kind,
  values,
  theme,
  color,
  diverging,
  domain
}: ResolveScaleArgs): ((value: number) => string) => {
  if (typeof kind === 'function') return kind;

  if (kind === 'diverging') {
    const d = domain ?? symmetricDomain(values);
    const low = diverging?.low ?? theme.diverging.low;
    const high = diverging?.high ?? theme.diverging.high;
    return divergingScale(low, high, d);
  }

  if (kind === 'grayscale') {
    const d = domain ?? extentDomain(values);
    return sequentialScale('#222222', d);
  }

  // sequential
  const d = domain ?? extentDomain(values);
  return sequentialScale(color ?? theme.primary, d);
};

export const flatten = (data: number[][]): number[] => {
  const out: number[] = [];
  for (const row of data) for (const v of row) out.push(v);
  return out;
};
