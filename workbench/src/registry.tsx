import React from 'react';
import {
  Matrix,
  Operator,
  Arrow,
  TokenColumn,
  QKVProjection,
  AttentionHeatmap,
  PriorityQueue,
  Array as PArray
} from '@patternize/components';
// Imported directly from source (not the '/three' subpath) so the dev preview
// build never depends on package-subpath alias resolution.
import { Tensor3D } from '../../src/ml/Tensor3D/Tensor3D';
import { Transformer3D } from '../../src/ml/Transformer3D/Transformer3D';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

const SAMPLE_MATRIX = [
  [0.8, -0.3, 0.1],
  [-0.6, 0.9, -0.2],
  [0.2, 0.4, -0.9]
];

/**
 * Renders a catalog component by id with a set of example props. Handles the
 * few components that need a wrapper (Arrow needs an <svg>, ThemeProvider
 * needs a child to recolor).
 */
export function renderComponent(id: string, props: AnyProps): React.ReactNode {
  switch (id) {
    case 'Matrix':
      return <Matrix {...props} />;
    case 'Operator':
      return <Operator {...props} />;
    case 'TokenColumn':
      return <TokenColumn {...props} />;
    case 'QKVProjection':
      return <QKVProjection {...props} />;
    case 'AttentionHeatmap':
      return <AttentionHeatmap {...props} />;
    case 'PriorityQueue':
      return <PriorityQueue {...props} />;
    case 'Array':
      return <PArray {...props} />;
    case 'Tensor3D':
      return <Tensor3D {...props} />;
    case 'Transformer3D':
      // Give the 3D scene a fixed stage so it has room to orbit.
      return (
        <div style={{ width: '100%', maxWidth: 760, height: 520 }}>
          <Transformer3D {...props} height={520} />
        </div>
      );
    case 'Arrow':
      return (
        <svg width={260} height={110} style={{ overflow: 'visible' }}>
          <Arrow {...(props as AnyProps)} />
        </svg>
      );
    case 'ThemeProvider':
      // The theme is already applied at the stage level; show a sample matrix.
      return (
        <Matrix
          data={SAMPLE_MATRIX}
          scale="diverging"
          showValues
          shape
          animate
        />
      );
    default:
      return (
        <div style={{ color: 'hsl(var(--muted-foreground))' }}>
          No live preview registered for “{id}”.
        </div>
      );
  }
}

export const RENDERABLE_IDS = new Set([
  'Matrix',
  'Operator',
  'TokenColumn',
  'QKVProjection',
  'AttentionHeatmap',
  'PriorityQueue',
  'Array',
  'Tensor3D',
  'Transformer3D',
  'Arrow',
  'ThemeProvider'
]);
