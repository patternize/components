import React, { useMemo, useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Matrix, MatrixCell } from '../Matrix/Matrix';
import { makeRng } from '../shared/random';

export interface AttentionHeatmapProps {
  /** Token strings used for both axes (query rows × key columns). */
  tokens: string[];
  /** `n × n` attention weights (rows sum to 1). Synthesized when omitted. */
  weights?: number[][];
  /** Mask future positions (decoder-style causal attention) when synthesizing. */
  causal?: boolean;
  /** Base color for the sequential scale (defaults to theme primary). */
  color?: string;
  /** Pixel size per cell. */
  cellSize?: number;
  /** Print the weight inside each cell. */
  showValues?: boolean;
  seed?: number;
  animate?: boolean;
  onCellHover?: (cell: MatrixCell | null) => void;
  style?: React.CSSProperties;
}

const softmaxRow = (row: number[]): number[] => {
  const max = Math.max(...row);
  const exps = row.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / sum);
};

/**
 * Token-by-token attention heatmap. Each row is a query, each column a key;
 * brighter cells mean more attention. Pass real `weights`, or let it
 * synthesize a (optionally causal) pattern for illustration.
 */
export const AttentionHeatmap = ({
  tokens,
  weights,
  causal = true,
  color,
  cellSize = 34,
  showValues = false,
  seed = 3,
  animate = true,
  onCellHover,
  style
}: AttentionHeatmapProps) => {
  const theme = useTheme();
  const n = tokens.length;
  const [hover, setHover] = useState<MatrixCell | null>(null);

  const matrix = useMemo(() => {
    if (weights) return weights;
    const rng = makeRng(seed);
    const rows: number[][] = [];
    for (let i = 0; i < n; i++) {
      const raw: number[] = [];
      for (let j = 0; j < n; j++) {
        raw.push(causal && j > i ? -1e9 : rng() * 3);
      }
      rows.push(softmaxRow(raw));
    }
    return rows;
  }, [weights, n, causal, seed]);

  const handleHover = (cell: MatrixCell | null) => {
    setHover(cell);
    onCellHover?.(cell);
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, ...style }}>
      <Matrix
        data={matrix}
        scale="sequential"
        color={color ?? theme.primary}
        domain={{ min: 0, max: 1 }}
        cellSize={cellSize}
        renderer="svg"
        gap={2}
        cellRadius={3}
        showValues={showValues}
        format={(v) => v.toFixed(2)}
        rowLabels={tokens}
        colLabels={tokens}
        animate={animate}
        onCellHover={handleHover}
      />
      <div
        style={{
          minHeight: 18,
          fontFamily: theme.monoFamily,
          fontSize: 13,
          color: theme.colors.textMuted
        }}
      >
        {hover
          ? `${tokens[hover.row]} → ${tokens[hover.col]} : ${hover.value.toFixed(3)}`
          : 'hover a cell to inspect the attention weight'}
      </div>
    </div>
  );
};
