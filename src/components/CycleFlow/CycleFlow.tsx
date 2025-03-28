import { Group } from '@visx/group';
import { Text } from '@visx/text';
import React, { useMemo } from 'react';

interface Edge {
  source: string;
  target: string;
  label?: string;
  color?: string;
  animated?: boolean;
}

interface NodeConfig {
  id: string;
  color?: string;
}

interface NodeData {
  id: string;
  x: number;
  y: number;
  angle: number;
  color?: string;
}

interface CycleFlowProps {
  edges: Edge[];
  nodes?: NodeConfig[];
  width?: number;
  height?: number;
}

export const CycleFlow: React.FC<CycleFlowProps> = ({
  edges,
  nodes: nodeConfigs = [],
  width = 400,
  height = 400
}) => {
  // Create a map for node configurations
  const nodeConfigMap = useMemo(() => {
    return nodeConfigs.reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<string, NodeConfig>
    );
  }, [nodeConfigs]);

  // Extract unique nodes from edges
  const nodes = useMemo(() => {
    const nodeSet = new Set<string>();
    edges.forEach((edge) => {
      nodeSet.add(edge.source);
      nodeSet.add(edge.target);
    });

    const nodeArray = Array.from(nodeSet);
    const radius = Math.min(width, height) / 3;

    // Position nodes in a circle
    return nodeArray.map((id, index) => {
      const angle = (index * 2 * Math.PI) / nodeArray.length - Math.PI / 2; // Start from top
      const config = nodeConfigMap[id] || {};

      return {
        id,
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
        angle,
        color: config.color
      };
    });
  }, [edges, width, height, nodeConfigMap]);

  // Create a map for quick node lookup
  const nodeMap = useMemo(() => {
    return nodes.reduce(
      (acc, node) => {
        acc[node.id] = node;
        return acc;
      },
      {} as Record<string, NodeData>
    );
  }, [nodes]);

  const createCircularPath = (source: NodeData, target: NodeData) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the radius for the arc (larger than half the distance for a nice curve)
    const radius = distance * 0.8;

    // Determine if we should draw the large arc based on the angle between nodes
    const sourceAngle = source.angle;
    const targetAngle = target.angle;
    const angleDiff =
      ((targetAngle - sourceAngle + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

    // Always use the same sweep flag for consistent direction
    const sweep = 1;
    // Use large arc when going "backwards"
    const largeArc = Math.abs(angleDiff) > Math.PI ? 1 : 0;

    const path = `M ${source.x} ${source.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${target.x} ${target.y}`;

    // Calculate the midpoint of the arc for label placement
    const midAngle = (sourceAngle + targetAngle) / 2;
    const bulgeRatio = 0.15; // Controls how far the label sits from the direct line
    const midDistance = distance * bulgeRatio;

    // Calculate label position
    const labelX =
      (source.x + target.x) / 2 +
      (sweep ? 1 : -1) * midDistance * (dy / distance);
    const labelY =
      (source.y + target.y) / 2 -
      (sweep ? 1 : -1) * midDistance * (dx / distance);

    return {
      path,
      labelPosition: {
        x: labelX,
        y: labelY
      }
    };
  };

  // Helper to render multiline text
  const renderMultilineLabel = (label: string, x: number, y: number) => {
    const lines = label.split('\n');
    const lineHeight = 18;
    const padding = 8;
    const labelHeight = lines.length * lineHeight;

    // Better width estimation based on font size and character count
    // Average character width for a 14px font is around 8.5px for better accommodation
    const fontSizeFactor = 14 / 16; // Adjust if font size changes
    const maxLineWidth = Math.max(
      ...lines.map((line) => Math.max(line.length * 8.5 * fontSizeFactor, 40))
    );

    return (
      <g>
        {/* Background rectangle */}
        <rect
          x={x - maxLineWidth / 2 - padding}
          y={y - labelHeight / 2 - padding}
          width={maxLineWidth + padding * 2}
          height={labelHeight + padding * 2}
          fill="white"
          rx={4}
          ry={4}
        />

        {/* Text lines */}
        {lines.map((line, i) => (
          <Text
            key={i}
            x={x}
            y={y + (i - lines.length / 2 + 0.5) * lineHeight} // Offset each line
            fontSize={14}
            fill="#000"
            textAnchor="middle"
            verticalAnchor="middle"
          >
            {line}
          </Text>
        ))}
      </g>
    );
  };

  return (
    <svg width={width} height={height}>
      {/* Define animation */}
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth={8}
          markerHeight={8}
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#949494" />
        </marker>

        {/* Custom colored arrow markers */}
        {edges.map((edge, i) => {
          if (!edge.color) return null;
          return (
            <marker
              key={`arrow-${edge.source}-${edge.target}`}
              id={`arrow-${i}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth={8}
              markerHeight={8}
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={edge.color} />
            </marker>
          );
        })}

        {/* Add flowing animation keyframes */}
        <style>
          {`
            @keyframes flowDash {
              to {
                stroke-dashoffset: -20;
              }
            }
            
            @keyframes pulse {
              0%, 100% {
                opacity: 0.2;
              }
              50% {
                opacity: 0.5;
              }
            }
          `}
        </style>
      </defs>

      <Group>
        {/* Draw edges */}
        {edges.map((edge, i) => {
          const source = nodeMap[edge.source];
          const target = nodeMap[edge.target];

          if (!source || !target) return null;

          const { path, labelPosition } = createCircularPath(source, target);
          const basePathColor = edge.color || '#949494';
          const markerId = edge.color ? `arrow-${i}` : 'arrow';
          const isAnimated = edge.animated !== undefined ? edge.animated : true; // Default to true if not specified

          return (
            <g key={`edge-${i}`}>
              {/* Static background path */}
              <path
                d={path}
                fill="none"
                stroke={basePathColor}
                strokeWidth={3}
                markerEnd={`url(#${markerId})`}
              />

              {/* Animated flowing path (only if animated is true) */}
              {isAnimated && (
                <path
                  d={path}
                  fill="none"
                  stroke={'white'}
                  strokeWidth={6}
                  strokeDasharray="6 14"
                  style={{
                    animation:
                      'flowDash 1.5s linear infinite, pulse 3s ease-in-out infinite',
                    opacity: 0.8
                  }}
                />
              )}

              {edge.label &&
                renderMultilineLabel(
                  edge.label,
                  labelPosition.x,
                  labelPosition.y
                )}
            </g>
          );
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const hasCustomColor = !!node.color;
          const fillColor = hasCustomColor ? node.color : 'white';
          const textColor = hasCustomColor ? 'white' : '#374151';
          const strokeColor = '#374151';

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={40}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={hasCustomColor ? 0 : 1}
              />
              <Text
                x={node.x}
                y={node.y}
                fontSize={14}
                fontWeight="bold"
                fill={textColor}
                textAnchor="middle"
                verticalAnchor="middle"
                width={80}
                style={{ wordWrap: 'break-word' }}
              >
                {node.id}
              </Text>
            </g>
          );
        })}
      </Group>
    </svg>
  );
};
