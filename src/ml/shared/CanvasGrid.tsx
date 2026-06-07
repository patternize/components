import React, { useEffect, useRef } from 'react';

export interface CanvasGridProps {
  data: number[][];
  width: number;
  height: number;
  colorOf: (value: number) => string;
  /** Cells to outline (highlight), as [row, col] pairs. */
  highlightCells?: Array<[number, number]>;
  highlightColor?: string;
  /** Fade-in progress 0..1 (driven by the parent for "animate in"). */
  progress?: number;
  onHover?: (cell: { row: number; col: number; value: number } | null) => void;
}

/**
 * Renders a (potentially very large) numeric matrix to a single <canvas>.
 * This is what makes the 768×2304 "weights texture" look from the reference
 * screenshot cheap to draw — one fill per cell, no DOM nodes.
 */
export const CanvasGrid = ({
  data,
  width,
  height,
  colorOf,
  highlightCells,
  highlightColor = '#1f2933',
  progress = 1,
  onHover
}: CanvasGridProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const rows = data.length;
  const cols = data[0]?.length ?? 0;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || rows === 0 || cols === 0) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Never draw more cells than there are pixels: for very large matrices we
    // sample down to the available resolution, keeping the texture look while
    // capping work at ~width*height fills.
    const drawCols = Math.min(cols, Math.max(1, Math.ceil(width)));
    const drawRows = Math.min(rows, Math.max(1, Math.ceil(height)));
    const cw = width / drawCols;
    const ch = height / drawRows;
    ctx.globalAlpha = Math.max(0, Math.min(1, progress));
    for (let r = 0; r < drawRows; r++) {
      const srcRow = data[Math.floor((r / drawRows) * rows)];
      for (let c = 0; c < drawCols; c++) {
        const value = srcRow[Math.floor((c / drawCols) * cols)];
        ctx.fillStyle = colorOf(value);
        // +1 avoids hairline gaps between cells from sub-pixel rounding.
        ctx.fillRect(c * cw, r * ch, cw + 1, ch + 1);
      }
    }
    ctx.globalAlpha = 1;

    if (highlightCells && highlightCells.length) {
      const lcw = width / cols;
      const lch = height / rows;
      ctx.strokeStyle = highlightColor;
      ctx.lineWidth = Math.max(1, Math.min(lcw, lch) * 0.15);
      for (const [r, c] of highlightCells) {
        ctx.strokeRect(c * lcw, r * lch, lcw, lch);
      }
    }
  }, [data, width, height, colorOf, highlightCells, highlightColor, progress, rows, cols]);

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor((x / width) * cols);
    const row = Math.floor((y / height) * rows);
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onHover({ row, col, value: data[row][col] });
    } else {
      onHover(null);
    }
  };

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ width, height, display: 'block', borderRadius: 4 }}
      onMouseMove={handleMove}
      onMouseLeave={() => onHover?.(null)}
    />
  );
};
