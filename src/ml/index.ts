// Atomic ML / tensor visualization primitives.
export { Matrix } from './Matrix/Matrix';
export type {
  MatrixProps,
  MatrixCell,
  MatrixHighlight
} from './Matrix/Matrix';

export { Operator } from './Operator/Operator';
export type { OperatorProps, OperatorKind } from './Operator/Operator';

export { Arrow } from './Arrow/Arrow';
export type { ArrowProps, Point } from './Arrow/Arrow';

export { TokenColumn } from './TokenColumn/TokenColumn';
export type { TokenColumnProps } from './TokenColumn/TokenColumn';

export { QKVProjection } from './QKVProjection/QKVProjection';
export type { QKVProjectionProps } from './QKVProjection/QKVProjection';

export { AttentionHeatmap } from './AttentionHeatmap/AttentionHeatmap';
export type { AttentionHeatmapProps } from './AttentionHeatmap/AttentionHeatmap';

// Shared helpers worth exposing for advanced/custom compositions.
export { makeRng, randomMatrix } from './shared/random';
export type { ScaleKind } from './shared/scale';
