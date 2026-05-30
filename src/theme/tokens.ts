/**
 * Theme tokens. A theme is derived from a single configurable `primary`
 * color (green by default) plus a small set of fixed semantic colors used
 * by the ML visualizations (the Q / K / V channels from attention).
 */
import { ramp, lighten, darken, readableText } from './color';

export interface AnimationTokens {
  /** Default transition duration in ms. */
  duration: number;
  /** Slower duration for staged/step animations. */
  durationSlow: number;
  /** CSS easing curve used across components. */
  easing: string;
  /** react-spring style config. */
  spring: { tension: number; friction: number };
}

export interface ChannelColors {
  /** Query channel (blue in the reference screenshot). */
  query: string;
  /** Key channel (red). */
  key: string;
  /** Value channel (green). */
  value: string;
  /** Neutral / weight color. */
  neutral: string;
}

export interface Theme {
  /** The single source-of-truth brand color. */
  primary: string;
  /** 50..900 tint/shade ramp derived from `primary`. */
  primaryRamp: Record<number, string>;
  /** Semantic surface + text colors. */
  colors: {
    background: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
  };
  /** Q/K/V + neutral colors for tensor / attention components. */
  channels: ChannelColors;
  /** Diverging endpoints for signed weight matrices. */
  diverging: { low: string; high: string };
  animation: AnimationTokens;
  radius: number;
  fontFamily: string;
  monoFamily: string;
}

export interface ThemeOptions {
  primary?: string;
  channels?: Partial<ChannelColors>;
  animation?: Partial<AnimationTokens>;
  radius?: number;
  dark?: boolean;
}

export const DEFAULT_PRIMARY = '#20bf6b';

const DEFAULT_CHANNELS: ChannelColors = {
  query: '#4a90e2',
  key: '#e8616a',
  value: '#26de81',
  neutral: '#7f8fa6'
};

/** Build a complete theme from a handful of options. */
export const createTheme = (options: ThemeOptions = {}): Theme => {
  const primary = options.primary ?? DEFAULT_PRIMARY;
  const dark = options.dark ?? false;
  const primaryRamp = ramp(primary);

  return {
    primary,
    primaryRamp,
    colors: dark
      ? {
          background: '#16181d',
          surface: '#1f232b',
          border: '#2c313c',
          text: '#f5f7fa',
          textMuted: '#9aa4b2',
          accent: lighten(primary, 0.1)
        }
      : {
          background: '#ffffff',
          surface: '#f7f9fb',
          border: '#e4e9f0',
          text: '#1f2933',
          textMuted: '#7b8794',
          accent: darken(primary, 0.05)
        },
    channels: { ...DEFAULT_CHANNELS, ...options.channels },
    diverging: { low: '#4a90e2', high: '#e8616a' },
    animation: {
      duration: 350,
      durationSlow: 700,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      spring: { tension: 210, friction: 22 },
      ...options.animation
    },
    radius: options.radius ?? 8,
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    monoFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
  };
};

export const defaultTheme = createTheme();

export { readableText };
