import React, { useMemo } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useTheme } from '../../theme/ThemeProvider';
import { readableText } from '../../theme/color';

export interface PriorityQueueProps {
  /** Heap array in level order. Index i's children are 2i+1 and 2i+2. */
  values: number[];
  /** Labels the root semantics; purely cosmetic. */
  variant?: 'min' | 'max';
  /** Indices to highlight (e.g. the node being sifted). */
  highlight?: number[];
  width?: number;
  height?: number;
  /** Node circle radius in px. */
  nodeRadius?: number;
  /** Also render the underlying array beneath the tree. */
  showArray?: boolean;
  color?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

interface NodePos {
  index: number;
  value: number;
  x: number;
  y: number;
  depth: number;
}

const AnimatedNode = ({
  node,
  radius,
  fill,
  stroke,
  duration,
  animate
}: {
  node: NodePos;
  radius: number;
  fill: string;
  stroke: string | null;
  duration: number;
  animate: boolean;
}) => {
  const spring = useSpring({
    to: { x: node.x, y: node.y },
    config: { tension: 210, friction: 22 },
    immediate: !animate
  });
  return (
    <animated.g transform={spring.x.to((x) => `translate(${x}, ${spring.y.get()})`)}>
      <circle
        r={radius}
        fill={fill}
        stroke={stroke ?? undefined}
        strokeWidth={stroke ? 3 : 0}
        style={{ transition: `fill ${duration}ms ease` }}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={radius * 0.7}
        fontWeight={600}
        fill={readableText(fill)}
      >
        {node.value}
      </text>
    </animated.g>
  );
};

/**
 * A binary-heap priority queue, drawn as both a tree and (optionally) its
 * backing array. Presentational and data-driven: feed it successive `values`
 * snapshots to animate insert / extract-min operations.
 */
export const PriorityQueue = ({
  values,
  variant = 'min',
  highlight = [],
  width = 520,
  height = 320,
  nodeRadius = 20,
  showArray = true,
  color,
  animate = true,
  style
}: PriorityQueueProps) => {
  const theme = useTheme();
  const fill = color ?? theme.primary;
  const arrayH = showArray ? 56 : 0;
  const treeH = height - arrayH;

  const nodes = useMemo<NodePos[]>(() => {
    return values.map((value, index) => {
      const depth = Math.floor(Math.log2(index + 1));
      const levelStart = Math.pow(2, depth) - 1;
      const posInLevel = index - levelStart;
      const nodesInLevel = Math.pow(2, depth);
      const x = (width * (posInLevel + 0.5)) / nodesInLevel;
      const y = 30 + depth * ((treeH - 50) / Math.max(1, maxDepth(values.length)));
      return { index, value, x, y, depth };
    });
  }, [values, width, treeH]);

  const edges = useMemo(() => {
    const e: Array<{ from: NodePos; to: NodePos }> = [];
    nodes.forEach((node) => {
      const left = 2 * node.index + 1;
      const right = 2 * node.index + 2;
      if (left < nodes.length) e.push({ from: node, to: nodes[left] });
      if (right < nodes.length) e.push({ from: node, to: nodes[right] });
    });
    return e;
  }, [nodes]);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 8,
        fontFamily: theme.fontFamily,
        color: theme.colors.text,
        ...style
      }}
    >
      <svg width={width} height={treeH}>
        {edges.map((edge, i) => (
          <line
            key={i}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke={theme.colors.border}
            strokeWidth={2}
          />
        ))}
        {nodes.map((node) => (
          <AnimatedNode
            key={node.index}
            node={node}
            radius={nodeRadius}
            fill={highlight.includes(node.index) ? theme.colors.accent : fill}
            stroke={highlight.includes(node.index) ? theme.colors.text : null}
            duration={theme.animation.duration}
            animate={animate}
          />
        ))}
      </svg>
      {showArray && (
        <div style={{ display: 'flex', gap: 4 }}>
          {values.map((v, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius / 2,
                fontFamily: theme.monoFamily,
                fontSize: 14,
                background: highlight.includes(i) ? theme.colors.accent : fill,
                color: readableText(highlight.includes(i) ? theme.colors.accent : fill),
                transition: `background ${theme.animation.duration}ms ease`
              }}
            >
              {v}
            </div>
          ))}
          <div
            style={{
              alignSelf: 'center',
              marginLeft: 8,
              fontSize: 12,
              color: theme.colors.textMuted
            }}
          >
            {variant}-heap
          </div>
        </div>
      )}
    </div>
  );
};

const maxDepth = (n: number): number => (n <= 1 ? 1 : Math.floor(Math.log2(n)));
