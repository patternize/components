import { animated, useSpring } from '@react-spring/web';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LinePath } from '@visx/shape';
import { useEffect, useMemo, useState } from 'react';

const green = '#26deb0';
const lightpurple = '#374469';
const white = '#ffffff';
const black = '#000000';
export const background = white;

interface Edge {
  source: string;
  target: string;
  dashed?: boolean;
  weight?: number;
}

export interface GraphNode {
  id: string;
  visited?: string;
  visitingCursorColor?: string | string[];
  x: number;
  y: number;
}

interface GraphProps {
  nodes: GraphNode[];
  edges: Edge[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  maxHeight?: number;
  maxWidth?: number;
}

function Node({
  node,
  x,
  y,
  scale = 1
}: {
  node: GraphNode;
  x: number;
  y: number;
  scale?: number;
}) {
  const isVisiting = node.visitingCursorColor;
  const visitedColor = node.visited;

  const lightenColor = (color: string): string => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const lightR = Math.round(r * 0.2 + 255 * 0.8);
    const lightG = Math.round(g * 0.2 + 255 * 0.8);
    const lightB = Math.round(b * 0.2 + 255 * 0.8);

    return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  };

  return (
    <Group top={y} left={x}>
      <circle
        r={16 / scale}
        fill={background}
        stroke={black}
        strokeWidth={(isVisiting ? 2 : 1) / scale}
        style={{
          fill: visitedColor ? lightenColor(visitedColor) : background
        }}
      />
      <text
        dy=".33em"
        fontSize={11 / scale}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={black}
      >
        {node.id}
      </text>
    </Group>
  );
}

const defaultMargin = { top: 20, left: 10, right: 20, bottom: 20 };

interface AnimatedCircleProps {
  animations: Array<{
    cursorId: string;
    source: { x: number; y: number };
    target: { x: number; y: number };
  }>;
}

function AnimatedDot({
  animation
}: {
  animation: {
    cursorId: string;
    source: { x: number; y: number };
    target: { x: number; y: number };
  };
}) {
  const spring = useSpring({
    from: { x: animation.source.x, y: animation.source.y },
    to: { x: animation.target.x, y: animation.target.y },
    config: { duration: 200 },
    reset: true
  });

  return (
    <animated.circle
      //@ts-ignore
      r={8}
      fill={animation.cursorId}
      cx={spring.x}
      cy={spring.y}
      opacity={0.8}
    />
  );
}

function AnimatedCircle({ animations }: AnimatedCircleProps) {
  return (
    <>
      {animations.map((animation) => (
        <AnimatedDot
          key={`${animation.cursorId}-${animation.source.x}-${animation.source.y}-${animation.target.x}-${animation.target.y}`}
          animation={animation}
        />
      ))}
    </>
  );
}

export function GraphDiagram({
  nodes,
  edges,
  width = 500,
  height = 500,
  margin = defaultMargin
}: GraphProps) {
  const [prevNodes, setPrevNodes] = useState<GraphNode[] | null>(null);
  const [animationNodes, setAnimationNodes] = useState<
    Array<{
      cursorId: string;
      source: { x: number; y: number };
      target: { x: number; y: number };
    }>
  >([]);

  // Calculate scaling and positioning based on viewport
  const scale = useMemo(() => {
    // Find bounds of the graph
    const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x));
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y));

    const graphWidth = maxX - minX + 100; // Add padding
    const graphHeight = maxY - minY + 100;

    // Calculate scale to fit
    const xScale = (width - margin.left - margin.right) / graphWidth;
    const yScale = (height - margin.top - margin.bottom) / graphHeight;

    return Math.min(xScale, yScale, 1); // Don't scale up, only down
  }, [nodes, width, height, margin]);

  // Calculate center offset to keep graph centered
  const centerOffset = useMemo(() => {
    const graphCenterX =
      (Math.min(...nodes.map((n) => n.x)) +
        Math.max(...nodes.map((n) => n.x))) /
      2;
    const graphCenterY =
      (Math.min(...nodes.map((n) => n.y)) +
        Math.max(...nodes.map((n) => n.y))) /
      2;

    const viewportCenterX = width / 2;
    const viewportCenterY = height / 2;

    return {
      x: viewportCenterX - graphCenterX * scale,
      y: viewportCenterY - graphCenterY * scale
    };
  }, [nodes, width, height, scale]);

  useEffect(() => {
    if (prevNodes) {
      const findVisitingNodes = (
        currentNodes: GraphNode[],
        previousNodes: GraphNode[]
      ) => {
        const animations: Array<{
          cursorId: string;
          source: { x: number; y: number };
          target: { x: number; y: number };
        }> = [];

        currentNodes.forEach((node) => {
          const colors = Array.isArray(node.visitingCursorColor)
            ? node.visitingCursorColor
            : node.visitingCursorColor
              ? [node.visitingCursorColor]
              : [];

          colors.forEach((color) => {
            const prevNodeWithCursor = previousNodes.find((n) => {
              const prevColors = Array.isArray(n.visitingCursorColor)
                ? n.visitingCursorColor
                : n.visitingCursorColor
                  ? [n.visitingCursorColor]
                  : [];
              return prevColors.includes(color);
            });

            if (prevNodeWithCursor) {
              animations.push({
                cursorId: color,
                source: {
                  x: prevNodeWithCursor.x,
                  y: prevNodeWithCursor.y
                },
                target: { x: node.x, y: node.y }
              });
            } else {
              const sourceNode = currentNodes.find((n) => n.visited === color);
              if (sourceNode) {
                animations.push({
                  cursorId: color,
                  source: { x: sourceNode.x, y: sourceNode.y },
                  target: { x: node.x, y: node.y }
                });
              }
            }
          });
        });

        return animations;
      };

      const animations = findVisitingNodes(nodes, prevNodes);
      if (animations.length > 0) {
        setAnimationNodes(animations);
      } else {
        setAnimationNodes([]);
      }
    }
    setPrevNodes(nodes);
  }, [nodes]);

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <LinearGradient id="lg" from={green} to={green} />
        <rect width={width} height={height} rx={14} fill={background} />
        <Group
          transform={`translate(${centerOffset.x},${centerOffset.y}) scale(${scale})`}
        >
          {edges.map((edge, i) => {
            const source = nodes.find((n) => n.id === edge.source)!;
            const target = nodes.find((n) => n.id === edge.target)!;

            // Calculate midpoint
            const midPoint = {
              x: (source.x + target.x) / 2,
              y: (source.y + target.y) / 2
            };

            const isVertical = Math.abs(source.x - target.x) < 20;
            const labelOffset = isVertical ? 8 : 0;

            return (
              <Group key={`edge-${i}`}>
                <LinePath
                  stroke={lightpurple}
                  strokeWidth={1 / scale} // Adjust stroke width for scaling
                  strokeDasharray={edge.dashed ? '5,5' : undefined}
                  data={[
                    { x: source.x, y: source.y },
                    { x: target.x, y: target.y }
                  ]}
                  x={(d) => d.x}
                  y={(d) => d.y}
                />
                {edge.weight !== undefined && (
                  <text
                    x={midPoint.x + labelOffset}
                    y={midPoint.y}
                    dy="-5"
                    fontSize={11 / scale} // Adjust font size for scaling
                    textAnchor="middle"
                    fill={black}
                  >
                    {edge.weight}
                  </text>
                )}
              </Group>
            );
          })}
          {nodes.map((node, i) => (
            <Node
              key={`node-${i}`}
              node={node}
              x={node.x}
              y={node.y}
              scale={scale}
            />
          ))}
          {animationNodes.length > 0 && (
            <AnimatedCircle
              animations={animationNodes.map((n) => ({
                ...n,
                source: {
                  x: n.source.x,
                  y: n.source.y
                },
                target: {
                  x: n.target.x,
                  y: n.target.y
                }
              }))}
            />
          )}
        </Group>
      </svg>
    </div>
  );
}

export default function ResponsiveGraphDiagram({
  maxHeight = 400,
  maxWidth = 500,
  ...props
}: GraphProps) {
  return (
    <div style={{ height: maxHeight, width: '100%', minHeight: maxHeight }}>
      <ParentSize debounceTime={0}>
        {({ width = 500, height = 500 }) => {
          const h = Math.min(height, maxHeight);
          const w = Math.min(width, maxWidth);
          return (
            <GraphDiagram
              {...props}
              width={w || maxWidth}
              height={h || maxHeight}
            />
          );
        }}
      </ParentSize>
    </div>
  );
}
