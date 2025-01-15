import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import { hierarchy } from 'd3-hierarchy';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

const green = '#26deb0';
const white = '#ffffff';
const black = '#000000';

interface BTreeNode {
  keys: number[];
  isLeaf: boolean;
  children?: BTreeNode[];
  next?: BTreeNode; // For leaf node links
  visiting?: boolean;
  highlight?: string;
}

interface NodeProps {
  node: HierarchyPointNode<BTreeNode>;
  scale?: number;
}

export function Node({ node, scale = 1 }: NodeProps) {
  const nodeWidth = node.data.keys.length * 40 + 20;
  const nodeHeight = 30;

  return (
    <Group top={node.y} left={node.x - nodeWidth / 2}>
      <rect
        width={nodeWidth}
        height={nodeHeight}
        fill={white}
        stroke={node.data.visiting ? green : black}
        strokeWidth={node.data.visiting ? 2 : 1}
      />
      {node.data.keys.map((key, i) => (
        <g key={i}>
          {i > 0 && (
            <line
              x1={i * 40 + 10}
              y1={0}
              x2={i * 40 + 10}
              y2={nodeHeight}
              stroke={black}
              strokeWidth={1}
            />
          )}
          <text
            x={i * 40 + 30}
            y={nodeHeight / 2}
            dy=".33em"
            fontSize={12}
            textAnchor="middle"
            fill={node.data.highlight === 'deleted' ? '#ff0000' : node.data.highlight === key.toString() ? green : black}
          >
            {key}
          </text>
        </g>
      ))}
    </Group>
  );
}

interface BTreeProps {
  data: BTreeNode;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
}

function BTreeDiagram({ data, width = 800, height = 600 }: BTreeProps) {
  const root = hierarchy(data);
  const margin = { top: 20, left: 20, right: 20, bottom: 20 };
  
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill={white} rx={14} />
      <Tree 
        root={root} 
        size={[xMax, yMax * 0.6]}
        separation={(a, b) => (a.parent === b.parent ? 1.5 : 2)}
      >
        {(tree) => (
          <Group top={margin.top} left={margin.left}>
            {tree.links().map((link, i) => (
              <line
                key={`link-${i}`}
                x1={link.source.x}
                y1={link.source.y}
                x2={link.target.x}
                y2={link.target.y}
                stroke={black}
                strokeWidth={1}
              />
            ))}
            {tree.descendants().map((node, i) => (
              <Node key={`node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Tree>
    </svg>
  );
}

export function BTree({
  maxHeight = 400,
  maxWidth = 500,
  ...props
}: BTreeProps) {
  return (
    <ParentSize debounceTime={10}>
      {({ width = 500, height = 500 }) => {
        const h = Math.min(height, maxHeight);
        const w = Math.min(width, maxWidth);
        return (
          <BTreeDiagram
            {...props}
            width={w || maxWidth}
            height={h || maxHeight}
          />
        );
      }}
    </ParentSize>
  );
}

export default BTree; 