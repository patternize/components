import { animated, useSpring } from '@react-spring/web';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LinePath } from '@visx/shape';
import { hierarchy, tree } from 'd3-hierarchy';
import { useEffect, useMemo, useState } from 'react';

const green = '#26deb0';
const lightpurple = '#374469';
const white = '#ffffff';
const grey = '#8e8e8e';
const black = '#000000';
export const background = white;

interface ExtraEdge {
  from: string;
  to: string;
}

export interface TreeNode {
  name: string;
  children?: TreeNode[];
  visited?: string;
  visitingCursorColor?: string;
}

interface TreeProps {
  inputData: TreeNode;
  maxWidth?: number;
  maxHeight?: number;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  extraEdges?: ExtraEdge[];
}

function findNodeByName(
  root: HierarchyPointNode<TreeNode>,
  name: string
): HierarchyPointNode<TreeNode> | null {
  if (root.data.name === name) return root;
  if (!root.children) return null;

  for (const child of root.children) {
    const found = findNodeByName(child, name);
    if (found) return found;
  }
  return null;
}

/** Handles rendering Root, Parent, and other Nodes. */
function Node({ node }: { node: HierarchyPointNode<TreeNode> }) {
  const isRoot = node.depth === 0;
  const isNull = node.data.name === 'null';
  const isVisiting = node.data.visitingCursorColor;
  const visitedColor = node.data.visited;

  /** Function to lighten a hex color */
  const lightenColor = (color: string): string => {
    /** Convert hex to RGB, mix with white, convert back to hex */
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    /** Mix with 80% white (255, 255, 255) */
    const lightR = Math.round(r * 0.2 + 255 * 0.8);
    const lightG = Math.round(g * 0.2 + 255 * 0.8);
    const lightB = Math.round(b * 0.2 + 255 * 0.8);

    return `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;
  };

  if (isRoot) return <RootNode node={node} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle
          r={16}
          fill={background}
          stroke={isNull ? grey : black}
          strokeWidth={isVisiting ? 2 : 1}
          style={{
            fill: visitedColor ? lightenColor(visitedColor) : background
          }}
        />
      )}
      <text
        dy=".33em"
        fontSize={11}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={isNull ? grey : black}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }: { node: HierarchyPointNode<TreeNode> }) {
  const width = 50;
  const height = 25;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect
        width={width}
        height={height}
        y={centerY}
        x={centerX}
        fill={green}
      />
      <text
        dy=".33em"
        fontSize={11}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={white}
      >
        {node.data.name}
      </text>
    </Group>
  );
}
const defaultMargin = { top: 20, left: 10, right: 10, bottom: 20 };

interface AnimatedCircleProps {
  animations: Array<{
    cursorId: string;
    source: HierarchyPointNode<TreeNode>;
    target: HierarchyPointNode<TreeNode>;
  }>;
}

function AnimatedDot({
  animation
}: {
  animation: {
    cursorId: string;
    source: HierarchyPointNode<TreeNode>;
    target: HierarchyPointNode<TreeNode>;
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
      style={{
        // @ts-ignore
        r: 8,
        fill: animation.cursorId,
        cx: spring.x,
        cy: spring.y,
        opacity: 0.8
      }}
    />
  );
}

function AnimatedCircle({ animations }: AnimatedCircleProps) {
  return (
    <>
      {animations.map((animation) => (
        <AnimatedDot key={animation.cursorId} animation={animation} />
      ))}
    </>
  );
}
export function TreeDiagram({
  inputData,
  width = 500,
  height = 500,
  margin = defaultMargin,
  extraEdges = []
}: TreeProps) {
  const [prevTree, setPrevTree] = useState<TreeNode | null>(null);
  const [animationNodes, setAnimationNodes] = useState<
    Array<{
      cursorId: string;
      source: HierarchyPointNode<TreeNode>;
      target: HierarchyPointNode<TreeNode>;
    }>
  >([]);

  const data = useMemo(() => hierarchy(inputData), [inputData]);
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  useEffect(() => {
    if (prevTree) {
      const findVisitingNodes = (
        currentTree: HierarchyPointNode<TreeNode>,
        previousTree: TreeNode
      ): Array<{
        cursorId: string;
        source: HierarchyPointNode<TreeNode>;
        target: HierarchyPointNode<TreeNode>;
      }> => {
        const currentNodes = currentTree.descendants();
        const prevHierarchy = hierarchy(previousTree);
        const animations: Array<{
          cursorId: string;
          source: HierarchyPointNode<TreeNode>;
          target: HierarchyPointNode<TreeNode>;
        }> = [];

        // Find all current cursors
        currentNodes.forEach((node) => {
          if (node.data.visitingCursorColor) {
            // Find where this cursor was in the previous tree
            const prevNode = prevHierarchy
              .descendants()
              .find(
                (n) =>
                  n.data.visitingCursorColor === node.data.visitingCursorColor
              );

            if (prevNode) {
              // Find the previous node's position in current tree
              const sourceNode = currentNodes.find(
                (n) => n.data.name === prevNode.data.name
              );

              if (sourceNode) {
                animations.push({
                  cursorId: node.data.visitingCursorColor,
                  source: sourceNode,
                  target: node
                });
              }
            }
          }
        });

        return animations;
      };

      const hierarchyData = hierarchy(inputData);
      const treeLayout = tree<TreeNode>().size([xMax, yMax]);
      const rootWithXY = treeLayout(hierarchyData);

      const animations = findVisitingNodes(rootWithXY, prevTree);
      if (animations.length > 0) {
        setAnimationNodes(animations);
      } else {
        setAnimationNodes([]);
      }
    }
    setPrevTree(inputData);
  }, [inputData, xMax, yMax]);

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <LinearGradient id="lg" from={green} to={green} />
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={green} />
          </marker>
        </defs>
        <rect width={width} height={height} rx={14} fill={background} />
        <Tree<TreeNode> root={data} size={[xMax, yMax]}>
          {(tree) => (
            <Group top={margin.top} left={margin.left}>
              {tree.links().map((link, i) => (
                <LinePath
                  key={`link-${i}`}
                  stroke={lightpurple}
                  strokeWidth={1}
                  data={[
                    { x: link.source.x, y: link.source.y },
                    { x: link.target.x, y: link.target.y }
                  ]}
                  x={(d) => d.x}
                  y={(d) => d.y}
                />
              ))}
              {extraEdges.map((edge, i) => {
                const sourceNode = findNodeByName(tree, edge.from);
                const targetNode = findNodeByName(tree, edge.to);

                if (sourceNode && targetNode) {
                  // Calculate control point for curved path
                  const midX = (sourceNode.x + targetNode.x) / 2;
                  const midY = (sourceNode.y + targetNode.y) / 2;
                  const dx = targetNode.x + sourceNode.x;
                  const dy = targetNode.y + sourceNode.y;
                  const controlX = midX + dy * 0.2; // Increase 0.2 for more curve
                  const controlY = midY - dx * 0.2; // Increase 0.2 for more curve

                  return (
                    <path
                      key={`extra-edge-${i}`}
                      d={`M ${sourceNode.x} ${sourceNode.y} Q ${controlX} ${controlY} ${targetNode.x} ${targetNode.y}`}
                      stroke={green}
                      strokeWidth="1"
                      strokeDasharray="4"
                      fill="none"
                      markerEnd="url(#arrow)"
                    />
                  );
                }
                return null;
              })}
              {tree.descendants().map((node, i) => (
                <Node key={`node-${i}`} node={node} />
              ))}
              {animationNodes.length > 0 && (
                <AnimatedCircle animations={animationNodes} />
              )}
            </Group>
          )}
        </Tree>
      </svg>
    </div>
  );
}

export default function ResponsiveTreeDiagram({
  inputData,
  extraEdges,
  maxHeight = 500,
  maxWidth = 500
}: TreeProps) {
  return (
    <ParentSize debounceTime={10}>
      {({ width = 500, height = 500 }) => {
        const h = Math.min(height, maxHeight);
        const w = Math.min(width, maxWidth);
        return (
          <TreeDiagram
            inputData={inputData}
            width={w || maxWidth}
            height={h || maxHeight}
            extraEdges={extraEdges}
          />
        );
      }}
    </ParentSize>
  );
}
