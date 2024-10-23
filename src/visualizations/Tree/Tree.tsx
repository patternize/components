import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LinkVertical } from '@visx/shape';
import { useMemo } from 'react';

const green = '#26deb0';
const lightpurple = '#374469';
const white = '#ffffff';
const grey = '#8e8e8e';
const black = '#000000';
export const background = white;

interface TreeNode {
  name: string;
  children?: this[];
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

export type TreeProps = {
  inputData: TreeNode;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export function TreeDiagram({
  inputData,
  width = 500,
  height = 500,
  margin = defaultMargin
}: TreeProps) {
  const data = useMemo(() => hierarchy(inputData), []);
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <LinearGradient id="lg" from={green} to={green} />
        <rect width={width} height={height} rx={14} fill={background} />
        <Tree<TreeNode> root={data} size={[xMax, yMax]}>
          {(tree) => (
            <Group top={margin.top} left={margin.left}>
              {tree.links().map((link, i) => (
                <LinkVertical
                  key={`link-${i}`}
                  data={link}
                  stroke={lightpurple}
                  strokeWidth="1"
                  fill="none"
                />
              ))}
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

export default function ResponsiveTreeDiagram({ inputData }: TreeProps) {
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
          />
        );
      }}
    </ParentSize>
  );
}
