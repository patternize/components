import React, { useMemo } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Matrix } from '../Matrix/Matrix';
import { Operator } from '../Operator/Operator';
import { TokenColumn } from '../TokenColumn/TokenColumn';
import { randomMatrix } from '../shared/random';

export interface QKVProjectionProps {
  /** Input tokens (one per row). */
  tokens?: string[];
  /** Embedding dimension (d_model). */
  dModel?: number;
  /** Per-head projection dimension; the output width is `3 * dProj`. */
  dProj?: number;
  /** Provide real data instead of synthesizing it. */
  data?: {
    embeddings?: number[][];
    wq?: number[][];
    wk?: number[][];
    wv?: number[][];
    bias?: number[];
    q?: number[][];
    k?: number[][];
    v?: number[][];
  };
  /** Logical shape labels override (e.g. show "(6, 768)" while drawing less). */
  shapeLabels?: {
    embeddings?: string;
    weights?: string;
    bias?: string;
    output?: string;
  };
  /** Pixel width of each weight block. */
  blockWidth?: number;
  /** Pixel height of the matrices. */
  height?: number;
  seed?: number;
  animate?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_TOKENS = ['Data', 'visualization', 'em', 'powers', 'users', 'to'];

const sectionLabel = (theme: ReturnType<typeof useTheme>, text: string) => (
  <div
    style={{
      fontSize: 14,
      fontWeight: 600,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8
    }}
  >
    {text}
  </div>
);

/**
 * The Q·K·V projection of self-attention, laid out as the familiar equation
 *
 *   Embeddings × W(qkv) + bias = Q·K·V
 *
 * Composed entirely from the atomic `Matrix`, `Operator` and `TokenColumn`
 * primitives, so every block is independently themeable and inspectable.
 */
export const QKVProjection = ({
  tokens = DEFAULT_TOKENS,
  dModel = 768,
  dProj = 768,
  data,
  shapeLabels,
  blockWidth = 110,
  height = 220,
  seed = 7,
  animate = true,
  style
}: QKVProjectionProps) => {
  const theme = useTheme();
  const n = tokens.length;

  const synth = useMemo(() => {
    const embeddings = data?.embeddings ?? randomMatrix(n, dModel, seed);
    const wq = data?.wq ?? randomMatrix(dModel, dProj, seed + 1);
    const wk = data?.wk ?? randomMatrix(dModel, dProj, seed + 2);
    const wv = data?.wv ?? randomMatrix(dModel, dProj, seed + 3);
    const q = data?.q ?? randomMatrix(n, dProj, seed + 4);
    const k = data?.k ?? randomMatrix(n, dProj, seed + 5);
    const v = data?.v ?? randomMatrix(n, dProj, seed + 6);
    const bias =
      data?.bias ?? randomMatrix(3 * dProj, 1, seed + 7).map((r) => r[0]);
    return { embeddings, wq, wk, wv, q, k, v, bias };
  }, [data, n, dModel, dProj, seed]);

  const ch = theme.channels;
  const biasMatrix = useMemo(() => synth.bias.map((b) => [b]), [synth.bias]);

  const weightBlock = (m: number[][], color: string) => (
    <Matrix
      data={m}
      scale="diverging"
      diverging={{ low: '#ffffff', high: color }}
      width={blockWidth}
      height={height}
      renderer="canvas"
      animate={animate}
    />
  );

  const outputBlock = (m: number[][], color: string) => (
    <Matrix
      data={m}
      scale="sequential"
      color={color}
      width={blockWidth}
      height={height}
      renderer="canvas"
      animate={animate}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        fontFamily: theme.fontFamily,
        color: theme.colors.text,
        overflowX: 'auto',
        padding: 8,
        ...style
      }}
    >
      {/* Embeddings */}
      <div>
        {sectionLabel(theme, 'Embeddings')}
        <div style={{ display: 'flex' }}>
          <TokenColumn tokens={tokens} height={height} active={0} />
          <div style={{ marginLeft: 8 }}>
            <Matrix
              data={synth.embeddings}
              scale="grayscale"
              width={blockWidth}
              height={height}
              renderer="canvas"
              animate={animate}
            />
          </div>
        </div>
        <div style={caption(theme)}>
          {shapeLabels?.embeddings ?? `(${n}, ${dModel})`}
        </div>
      </div>

      <Operator kind="multiply" style={{ marginTop: height / 2 }} />

      {/* Q·K·V Weights */}
      <div>
        {sectionLabel(theme, 'Q·K·V Weights')}
        <div style={{ display: 'flex', gap: 2 }}>
          {weightBlock(synth.wq, ch.query)}
          {weightBlock(synth.wk, ch.key)}
          {weightBlock(synth.wv, ch.value)}
        </div>
        <div style={caption(theme)}>
          {shapeLabels?.weights ?? `(${dModel}, ${3 * dProj})`}
        </div>
      </div>

      <Operator kind="add" style={{ marginTop: height / 2 }} />

      {/* Bias */}
      <div>
        {sectionLabel(theme, 'Q·K·V Bias')}
        <Matrix
          data={biasMatrix}
          scale="grayscale"
          width={18}
          height={height}
          renderer="canvas"
          animate={animate}
        />
        <div style={caption(theme)}>
          {shapeLabels?.bias ?? `(${3 * dProj})`}
        </div>
      </div>

      <Operator kind="equals" style={{ marginTop: height / 2 }} />

      {/* Output Q·K·V */}
      <div>
        {sectionLabel(theme, 'Q·K·V')}
        <div style={{ display: 'flex' }}>
          <TokenColumn tokens={tokens} height={height} active={0} />
          <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
            {outputBlock(synth.q, ch.query)}
            {outputBlock(synth.k, ch.key)}
            {outputBlock(synth.v, ch.value)}
          </div>
        </div>
        <div style={caption(theme)}>
          {shapeLabels?.output ?? `(${n}, ${3 * dProj})`}
        </div>
      </div>
    </div>
  );
};

const caption = (theme: ReturnType<typeof useTheme>): React.CSSProperties => ({
  fontFamily: theme.monoFamily,
  fontSize: 13,
  color: theme.colors.textMuted,
  textAlign: 'center',
  marginTop: 8
});
