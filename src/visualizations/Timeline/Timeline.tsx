import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { animated, useSpring } from 'react-spring';

interface TimelineEvent {
  year: number;
  title: string;
  detail: string;
}

interface TimelineProps {
  width?: number;
  height?: number;
  events: TimelineEvent[];
}

const Timeline = ({ width = 1000, height = 500, events }: TimelineProps) => {
  const lineY = height / 2;
  const baseCircleRadius = 5; // Base radius for scaling

  // Calculate min and max years for scaling
  // const minYear = Math.min(...events.map((e) => e.year));
  // const maxYear = Math.max(...events.map((e) => e.year));

  // Create gradient colors for the timeline
  const colors = [
    '#FFB74D', // Orange
    '#FF7043', // Deep Orange
    '#EC407A', // Pink
    '#AB47BC', // Purple
    '#7E57C2', // Deep Purple
    '#5C6BC0', // Indigo
    '#42A5F5', // Blue
    '#26C6DA', // Cyan
    '#26A69A', // Teal
    '#66BB6A', // Green
    '#9CCC65', // Light Green
    '#D4E157' // Lime
  ];

  const lineAnimation = useSpring({
    from: { x2: 50 },
    to: { x2: width },
    config: { duration: 500 }
  });

  const eventAnimations = events.map((_, i) =>
    useSpring({
      from: { opacity: 0 },
      to: { opacity: 1 },
      delay: i * 200 + 500,
      config: { duration: 150 }
    })
  );

  return (
    <svg width={width} height={height}>
      {/* Gradient Timeline Line */}
      <defs>
        <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {colors.map((color, i) => (
            <stop
              key={i}
              offset={`${(i * 100) / (colors.length - 1)}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
      {/* Main Timeline Line */}
      <animated.line
        x1={50}
        y1={lineY}
        y2={lineY}
        stroke="black"
        strokeWidth={2}
        {...lineAnimation}
      />
      {/* Events */}
      {events.map((event, i) => {
        let x;
        if (width < 580) {
          x = 50 + (width - 100) * (i / (events.length - 1));
        } else {
          // Calculate x position based on year gap
          const yearGap = event.year - events[0].year;
          const totalYears = events[events.length - 1].year - events[0].year;
          x = 50 + (width - 100) * (yearGap / totalYears);
          if (i > 0) x -= 25;
        }
        const isTop = i % 2 === 0;
        const circleRadius = baseCircleRadius;
        const textY = isTop
          ? height / 2 - (80 + circleRadius)
          : height / 2 + (80 + circleRadius);
        const iconY = isTop ? height / 2 - 40 : height / 2 + 40;

        return (
          // @ts-ignore
          <animated.g key={i} style={eventAnimations[i]}>
            {/* Horizontal Line Through Circle */}
            <line
              x1={x - circleRadius}
              y1={iconY}
              x2={x + circleRadius}
              y2={iconY}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
            />

            {/* Year Label */}
            <text
              x={x}
              y={height / 2 + (isTop ? 20 : -20)}
              textAnchor="middle"
              fontSize={12}
              fontWeight="bold"
            >
              {event.year}
            </text>

            {/* Circle Icon Background */}
            <circle
              cx={x}
              cy={iconY}
              r={circleRadius}
              fill="white"
              stroke={colors[i % colors.length]}
              strokeWidth={2}
            />

            {/* Connecting Line */}
            <line
              x1={x}
              y1={height / 2}
              x2={x}
              y2={iconY}
              stroke={colors[i % colors.length]}
              strokeWidth={1}
              strokeDasharray="4"
            />

            {/* Title and Detail */}
            <text
              x={x}
              y={textY}
              textAnchor="middle"
              fontSize={14}
              fontWeight="bold"
            >
              {event.title}
            </text>
            {width > 800 && (
              <text
                x={x}
                y={textY + 20}
                textAnchor="middle"
                fontSize={12}
                fill="#666"
              >
                {event.detail}
              </text>
            )}
          </animated.g>
        );
      })}
    </svg>
  );
};

interface ResponsiveTimelineProps {
  events: TimelineEvent[];
}

export function ResponsiveTimeline({ events }: ResponsiveTimelineProps) {
  return (
    <ParentSize>
      {({ width = 1000, height = 500 }) => {
        const maxHeight = 500;
        const maxWidth = 1000;
        const h = Math.min(height, maxHeight);
        const w = Math.min(width, maxWidth);
        return (
          <Timeline
            width={w || maxWidth}
            height={h || maxHeight}
            events={events}
          />
        );
      }}
    </ParentSize>
  );
}

export default ResponsiveTimeline;
