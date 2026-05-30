import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export interface TimelineItem {
  label: string;
  detail?: string;
}

export interface TimelineProps {
  /** Ordered events to lay out left-to-right. */
  items: TimelineItem[];
  color?: string;
  style?: React.CSSProperties;
}

/**
 * A simple horizontal timeline of labeled events. (Rewritten from a legacy
 * non-compiling stub.)
 */
const Timeline = ({ items, color, style }: TimelineProps) => {
  const theme = useTheme();
  const accent = color ?? theme.primary;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0,
        fontFamily: theme.fontFamily,
        ...style
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div
              style={{
                flex: 1,
                height: 2,
                background: i === 0 ? 'transparent' : theme.colors.border
              }}
            />
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: accent,
                flexShrink: 0
              }}
            />
            <div
              style={{
                flex: 1,
                height: 2,
                background: i === items.length - 1 ? 'transparent' : theme.colors.border
              }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: theme.colors.text }}>
            {item.label}
          </div>
          {item.detail && (
            <div style={{ fontSize: 11, color: theme.colors.textMuted, textAlign: 'center' }}>
              {item.detail}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
