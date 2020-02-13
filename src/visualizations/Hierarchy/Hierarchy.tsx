/*
    Eventually this will be reimplemented with vx and d3 and use as a seperate library under Patternize org
    This is just a proof of concept:
 */
import * as React from 'react';
import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinkVertical } from '@vx/shape';
import { hierarchy } from 'd3-hierarchy';
import { LinearGradient } from '@vx/gradient';

const peach = '#fd9b93';
const pink = '#fe6e9e';
const blue = '#03c0dc';
const green = '#26deb0';
const plum = '#71248e';
const lightpurple = '#94f4ef';
const white = '#ffffff';
const bg = '#2a404e';
// const bg_white = 'white';

interface SlideShowProps {
    tree: object,
    margin?: {
        top: number,
        left: number,
        right: number,
        bottom: number
    },
    width?: number,
    height?: number
}

interface NodeProps {
    node: any// should be HierarchyNode<any>;
}

function Node({ node }: NodeProps) {
    const width = 80;
    const height = 20;
    const centerX = -width / 2;
    const centerY = -height / 2;
    const isRoot = node.depth === 0;
    const isParent = !!node.children;

    if (isRoot) return <RootNode node={node} />;
    if (isParent) return <ParentNode node={node} />;

    return (
        <Group top={node.y} left={node.x}>
            <rect
                height={height}
                width={width}
                y={centerY}
                x={centerX}
                fill={bg}
                stroke={green}
                strokeWidth={1}
                strokeDasharray={'2,2'}
                strokeOpacity={0.6}
                rx={10}
                onClick={() => {
                    alert(`clicked: ${JSON.stringify(node.data.name)}`);
                }}
            />
            <text
                dy={'.33em'}
                fontSize={12}
                fontFamily="Arial"
                textAnchor={'middle'}
                fill={green}
                style={{ pointerEvents: 'none' }}
            >
                {node.data.name}
            </text>
        </Group>
    );
}

function RootNode({ node }: NodeProps) {
    return (
        <Group top={node.y} left={node.x}>
            <circle r={12} fill="url('#lg')" />
            <text
                dy={'.33em'}
                fontSize={12}
                fontFamily="Arial"
                textAnchor={'middle'}
                style={{ pointerEvents: 'none' }}
                fill={plum}
            >
                {node.data.name}
            </text>
        </Group>
    );
}

function ParentNode({ node }: NodeProps) {
    const width = 60;
    const height = 20;
    const centerX = -width / 2;
    const centerY = -height / 2;

    return (
        <Group top={node.y} left={node.x}>
            <rect
                height={height}
                width={width}
                y={centerY}
                x={centerX}
                fill={bg}
                stroke={blue}
                strokeWidth={1}
                onClick={() => {
                    alert(`clicked: ${JSON.stringify(node.data.name)}`);
                }}
            />
            <text
                dy={'.33em'}
                fontSize={12}
                fontFamily="Arial"
                textAnchor={'middle'}
                style={{ pointerEvents: 'none' }}
                fill={white}
            >
                {node.data.name}
            </text>
        </Group>
    );
}

export const Hierarchy = ({
   tree,
   margin = { top: 30, left: 30, right: 60, bottom: 80 },
    height,
    width
}: SlideShowProps) => {

    // this is boilerplate code, because other with `yarn build` will have a 'window' not defined error since this is backend rendering
    if (typeof window === 'undefined') {
        (window as any).global = window;
    }

    width = width ? width : window.innerWidth > 500 ? 900: 500;
    width = 700;
    height = height ? height : 700;
    const data = hierarchy(tree);
    const xMax = height - margin.top - margin.bottom;
    const yMax = width - margin.left - margin.right;

    return (
        <svg width={width} height={height}>
            <LinearGradient id="lg" from={peach} to={pink} />
            <rect width={width} height={height} rx={12} fill={bg} />
            <Tree root={data} size={[yMax, xMax]}>
                {tree => {
                    return (
                        <Group top={margin.top} left={margin.left}>
                            {tree.links().map((link, i) => {
                                return (
                                    <LinkVertical
                                        key={`link-${i}`}
                                        data={link}
                                        stroke={lightpurple}
                                        strokeWidth="1"
                                        fill="none"
                                    />
                                );
                            })}
                            {tree.descendants().map((node, i) => {
                                return <Node key={`node-${i}`} node={node} />;
                            })}
                        </Group>
                    );
                }}
            </Tree>
        </svg>
    );
};
