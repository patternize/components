import { animated } from '@react-spring/web';
import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LinePath } from '@visx/shape';
import {
  forceCollide,
  forceLink,
  forceSimulation,
  forceX,
  forceY
} from 'd3-force';
import { useEffect, useMemo, useState } from 'react';

export const green = '#26deb0';
const lightpurple = '#374469';
const white = '#ffffff';
const black = '#000000';
export const background = white;

export interface LinkedListNode {
  id: string;
  value: string | number;
  nextNode?: string;
  highlight?: string;
  visiting?: boolean;
  floating?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkedListProps {
  nodes: LinkedListNode[];
  width?: number;
  height?: number;
  maxHeight?: number;
  maxWidth?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

function Node({
  node,
  x = 0,
  y = 0
}: {
  node: LinkedListNode;
  x?: number;
  y?: number;
}) {
  return (
    <Group top={y} left={x}>
      <circle
        r={20}
        fill={background}
        stroke={node.highlight || black}
        strokeWidth={node.visiting ? 2 : 1}
      />
      <text
        dy=".33em"
        fontSize={12}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={black}
      >
        {node.value}
      </text>
    </Group>
  );
}

function Arrow({
  start,
  end,
  color = lightpurple
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color?: string;
}) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);

  // Calculate the point where arrow meets the node
  const nodeRadius = 20;
  const endX = end.x - nodeRadius * Math.cos(angle);
  const endY = end.y - nodeRadius * Math.sin(angle);

  // Calculate arrow head points
  const arrowLength = 10;
  const arrowAngle = Math.PI / 6; // 30 degrees

  const tip = { x: endX, y: endY };
  const left = {
    x: endX - arrowLength * Math.cos(angle - arrowAngle),
    y: endY - arrowLength * Math.sin(angle - arrowAngle)
  };
  const right = {
    x: endX - arrowLength * Math.cos(angle + arrowAngle),
    y: endY - arrowLength * Math.sin(angle + arrowAngle)
  };

  return (
    <Group>
      <LinePath
        stroke={color}
        strokeWidth={1}
        data={[
          { x: start.x + nodeRadius, y: start.y },
          { x: endX, y: endY }
        ]}
        x={(d) => d.x}
        y={(d) => d.y}
      />
      <path
        d={`M ${tip.x} ${tip.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`}
        fill={color}
      />
    </Group>
  );
}

const defaultMargin = { top: 40, left: 20, right: 40, bottom: 40 };

export function LinkedListDiagram({
  nodes: inputNodes,
  width = 500,
  height = 200,
  margin = defaultMargin
}: LinkedListProps) {
  // Initialize nodes with positions based on linked list order
  const initializedNodes = useMemo(() => {
    const orderedNodes: LinkedListNode[] = [];
    const nodeMap = new Map(inputNodes.map((node) => [node.id, node]));

    // Find head node (node that no other node points to)
    let currentId = inputNodes.find(
      (node) => !inputNodes.some((n) => n.nextNode === node.id)
    )?.id;

    // Build ordered list following nextNode pointers
    let index = 0;
    while (currentId && index < inputNodes.length) {
      const currentNode = nodeMap.get(currentId);
      if (currentNode) {
        orderedNodes.push({
          ...currentNode,
          x: margin.left + 50 + index * 100,
          y: currentNode.floating ? margin.top : height / 2
        });
        currentId = currentNode.nextNode;
        index++;
      }
    }

    // Add any remaining nodes (in case of cycles or disconnected nodes)
    inputNodes.forEach((node) => {
      if (!orderedNodes.some((n) => n.id === node.id)) {
        orderedNodes.push({
          ...node,
          x: margin.left + 50 + index * 100,
          y: node.floating ? margin.top : height / 2
        });
        index++;
      }
    });

    return orderedNodes;
  }, [inputNodes, height, margin]);

  const [nodes, setNodes] = useState(initializedNodes);

  // Create links array from nextNode relationships
  const links = useMemo(() => {
    return nodes
      .filter((node) => node.nextNode)
      .map((node) => ({
        source: node.id,
        target: node.nextNode!,
        id: `${node.id}-${node.nextNode}`
      }));
  }, [nodes]);

  // Set up force simulation
  useEffect(() => {
    setNodes(initializedNodes); // Update nodes when input changes

    const simulation = forceSimulation(initializedNodes)
      .force(
        'link',
        forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force(
        'x',
        forceX((d: any, i) => margin.left + 50 + i * 100).strength(0.3)
      )
      .force('y', forceY(height / 2).strength(1))
      .force('collide', forceCollide(30))
      .on('tick', () => {
        setNodes((currentNodes) => [...currentNodes]);
      });

    // Special handling for floating nodes
    initializedNodes.forEach((node) => {
      if (node.floating) {
        node.fy = margin.top;
      } else {
        node.fy = height / 2;
      }
    });

    simulation.alpha(0.3).restart();

    return () => simulation.stop();
  }, [initializedNodes, links, width, height, margin]);

  // Animate node positions
  const AnimatedNode = animated(Node);

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} rx={14} fill={background} />
        <Group>
          {nodes.map((node) => {
            if (node.nextNode) {
              const targetNode = nodes.find((n) => n.id === node.nextNode);
              if (targetNode) {
                return (
                  <Arrow
                    key={`arrow-${node.id}-${targetNode.id}`}
                    start={{ x: node.x || 0, y: node.y || 0 }}
                    end={{ x: targetNode.x || 0, y: targetNode.y || 0 }}
                    color={node.highlight || lightpurple}
                  />
                );
              }
            }
            return null;
          })}
          {nodes.map((node) => (
            <AnimatedNode
              key={node.id}
              node={node}
              x={node.x || 0}
              y={node.y || 0}
            />
          ))}
        </Group>
      </svg>
    </div>
  );
}

export default function ResponsiveLinkedList({
  maxHeight = 400,
  maxWidth = 500,
  ...props
}: LinkedListProps) {
  return (
    <ParentSize debounceTime={10}>
      {({ width = 500, height = 500 }) => {
        const h = Math.min(height, maxHeight);
        const w = Math.min(width, maxWidth);
        return (
          <LinkedListDiagram
            {...props}
            width={w || maxWidth}
            height={h || maxHeight}
          />
        );
      }}
    </ParentSize>
  );
}
