import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LinePath, LinkVertical } from '@visx/shape';
import { useMemo } from 'react';

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

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeProps {
  inputData: TreeNode;
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
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle r={12} fill={background} stroke={isParent ? black : grey} />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? black : grey}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }: { node: HierarchyPointNode<TreeNode> }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect
        width={width}
        height={height}
        y={centerY}
        x={centerX}
        fill={black}
      />
      <text
        dy=".33em"
        fontSize={9}
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

export function TreeDiagram({
  inputData,
  width = 500,
  height = 500,
  margin = defaultMargin,
  extraEdges = []
}: TreeProps) {
  const data = useMemo(() => hierarchy(inputData), [inputData]);
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

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
                  return (
                    <LinkVertical
                      key={`extra-edge-${i}`}
                      data={{
                        source: {
                          x: sourceNode.x,
                          y: sourceNode.y
                        },
                        target: {
                          x: targetNode.x,
                          y: targetNode.y
                        }
                      }}
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
            </Group>
          )}
        </Tree>
      </svg>
    </div>
  );
}

export default function ResponsiveTreeDiagram({
  inputData,
  extraEdges
}: TreeProps) {
  return (
    <ParentSize debounceTime={10}>
      {({ width = 500, height = 500 }) => {
        const maxHeight = 500;
        const maxWidth = 500;
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
