import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { readableText } from '../../theme/color';
import { ScaleOptions } from '../../theme/scales';
import { resolveScale, flatten, ScaleKind } from '../shared/scale';
import { CanvasGrid } from '../shared/CanvasGrid';

export interface MatrixHighlight {
  rows?: number[];
  cols?: number[];
  cells?: Array<[number, number]>;
}

export interface MatrixCell {
  row: number;
  col: number;
  value: number;
}

export interface MatrixProps {
  /** Row-major numeric data: `data[row][col]`. */
  data: number[][];
  /** How to color each value. Default `diverging` (blue↔red signed weights). */
  scale?: ScaleKind;
  /** Base color for the `sequential` scale (defaults to the theme primary). */
  color?: string;
  /** Endpoints for the `diverging` scale. */
  diverging?: { low: string; high: string };
  /** Fixed value domain. Inferred from the data when omitted. */
  domain?: ScaleOptions;
  /** Total drawing width in px. Defaults to `cols * cellSize`. */
  width?: number;
  /** Total drawing height in px. Defaults to `rows * cellSize`. */
  height?: number;
  /** Preferred px per cell when width/height are not given. */
  cellSize?: number;
  /** Force a renderer. `auto` (default) picks canvas for large matrices. */
  renderer?: 'auto' | 'svg' | 'canvas';
  /** Print the numeric value inside each cell (SVG only, small matrices). */
  showValues?: boolean;
  /** Formatter for printed values and tooltips. */
  format?: (value: number) => string;
  /** Gap between cells in px (SVG only). */
  gap?: number;
  /** Cell corner radius in px (SVG only). */
  cellRadius?: number;
  /** Labels rendered to the left of each row. */
  rowLabels?: string[];
  /** Labels rendered above each column. */
  colLabels?: string[];
  /** Show a `(rows, cols)` caption, or a custom caption string. */
  shape?: boolean | string;
  /** Heading above the matrix. */
  title?: string;
  /** Cells / rows / cols to outline. */
  highlight?: MatrixHighlight;
  /** Fade + scale the matrix in on mount. */
  animate?: boolean;
  onCellHover?: (cell: MatrixCell | null) => void;
  onCellClick?: (cell: MatrixCell) => void;
  className?: string;
  style?: React.CSSProperties;
}

const defaultFormat = (v: number): string =>
  Number.isInteger(v) ? String(v) : v.toFixed(2);

const useMountProgress = (enabled: boolean, durationMs: number): number => {
  const [p, setP] = useState(enabled ? 0 : 1);
  const raf = useRef<number>();
  useEffect(() => {
    if (!enabled) {
      setP(1);
      return;
    }
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / durationMs);
      // easeOutCubic
      setP(1 - Math.pow(1 - k, 3));
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled, durationMs]);
  return p;
};

/**
 * Atomic colored matrix / grid. Powers weight matrices, embeddings, attention
 * maps and the building blocks of the transformer visualizations.
 */
export const Matrix = ({
  data,
  scale = 'diverging',
  color,
  diverging,
  domain,
  width,
  height,
  cellSize = 26,
  renderer = 'auto',
  showValues = false,
  format = defaultFormat,
  gap = 1,
  cellRadius = 2,
  rowLabels,
  colLabels,
  shape = false,
  title,
  highlight,
  animate = false,
  onCellHover,
  onCellClick,
  className,
  style
}: MatrixProps) => {
  const theme = useTheme();
  const rows = data.length;
  const cols = data[0]?.length ?? 0;

  const colorOf = useMemo(
    () =>
      resolveScale({
        kind: scale,
        values: flatten(data),
        theme,
        color,
        diverging,
        domain
      }),
    [scale, data, theme, color, diverging, domain]
  );

  const drawW = width ?? cols * cellSize;
  const drawH = height ?? rows * cellSize;
  const cw = cols > 0 ? drawW / cols : 0;
  const ch = rows > 0 ? drawH / rows : 0;

  const useCanvas =
    renderer === 'canvas' ||
    (renderer === 'auto' && (rows * cols > 1600 || cw < 8 || ch < 8));

  const progress = useMountProgress(animate, theme.animation.durationSlow);

  const highlightCells: Array<[number, number]> = useMemo(() => {
    if (!highlight) return [];
    const set: Array<[number, number]> = [...(highlight.cells ?? [])];
    highlight.rows?.forEach((r) => {
      for (let c = 0; c < cols; c++) set.push([r, c]);
    });
    highlight.cols?.forEach((c) => {
      for (let r = 0; r < rows; r++) set.push([r, c]);
    });
    return set;
  }, [highlight, rows, cols]);

  const isHighlighted = (r: number, c: number): boolean => {
    if (!highlight) return false;
    if (highlight.rows?.includes(r)) return true;
    if (highlight.cols?.includes(c)) return true;
    return !!highlight.cells?.some(([hr, hc]) => hr === r && hc === c);
  };
  const hasHighlight =
    !!highlight &&
    ((highlight.rows?.length ?? 0) +
      (highlight.cols?.length ?? 0) +
      (highlight.cells?.length ?? 0) >
      0);

  const colLabelHeight = colLabels ? 20 : 0;

  const plot = useCanvas ? (
    <CanvasGrid
      data={data}
      width={drawW}
      height={drawH}
      colorOf={colorOf}
      highlightCells={highlightCells}
      highlightColor={theme.colors.text}
      progress={progress}
      onHover={onCellHover}
    />
  ) : (
    <svg
      width={drawW}
      height={drawH}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {data.map((row, r) =>
        row.map((value, c) => {
          const hl = isHighlighted(r, c);
          const fill = colorOf(value);
          const cellW = Math.max(0, cw - gap);
          const cellH = Math.max(0, ch - gap);
          return (
            <g
              key={`${r}-${c}`}
              transform={`translate(${c * cw + gap / 2}, ${r * ch + gap / 2})`}
              style={{
                opacity: hasHighlight && !hl ? 0.25 : progress,
                transition: `opacity ${theme.animation.duration}ms ${theme.animation.easing}`,
                cursor: onCellClick ? 'pointer' : 'default'
              }}
              onMouseEnter={() => onCellHover?.({ row: r, col: c, value })}
              onMouseLeave={() => onCellHover?.(null)}
              onClick={() => onCellClick?.({ row: r, col: c, value })}
            >
              <rect
                width={cellW}
                height={cellH}
                rx={cellRadius}
                fill={fill}
                stroke={hl ? theme.colors.text : 'none'}
                strokeWidth={hl ? 1.5 : 0}
              />
              {showValues && cellW >= 18 && (
                <text
                  x={cellW / 2}
                  y={cellH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.min(cellH * 0.42, 13)}
                  fontFamily={theme.monoFamily}
                  fill={readableText(fill)}
                >
                  {format(value)}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );

  const shapeCaption =
    shape === true ? `(${rows}, ${cols})` : typeof shape === 'string' ? shape : null;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        fontFamily: theme.fontFamily,
        color: theme.colors.text,
        ...style
      }}
    >
      {title && (
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.textMuted }}>
          {title}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* left gutter: corner spacer + row labels */}
        {rowLabels && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: colLabelHeight }} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: drawH,
                marginRight: 8
              }}
            >
              {rowLabels.map((label, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: 13,
                    color: theme.colors.textMuted,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* plot stack: column labels + plot */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {colLabels && (
            <div style={{ display: 'flex', width: drawW, height: colLabelHeight }}>
              {colLabels.map((label, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 12,
                    color: theme.colors.textMuted,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
          {plot}
        </div>
      </div>
      {shapeCaption && (
        <div
          style={{
            fontFamily: theme.monoFamily,
            fontSize: 13,
            color: theme.colors.textMuted
          }}
        >
          {shapeCaption}
        </div>
      )}
    </div>
  );
};
