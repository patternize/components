import React, { createContext, useContext, useMemo } from 'react';
import { Theme, ThemeOptions, createTheme, defaultTheme } from './tokens';

const ThemeContext = createContext<Theme>(defaultTheme);

export interface ThemeProviderProps {
  /** A full theme object, or… */
  theme?: Theme;
  /** …individual options to derive one (e.g. `{ primary: '#7c5cff' }`). */
  options?: ThemeOptions;
  /** Convenience shorthand for `options.primary`. */
  primary?: string;
  children: React.ReactNode;
}

/** Expose the active theme to CSS via custom properties on a wrapper element. */
const themeToCssVars = (theme: Theme): React.CSSProperties =>
  ({
    '--ptz-primary': theme.primary,
    '--ptz-bg': theme.colors.background,
    '--ptz-surface': theme.colors.surface,
    '--ptz-border': theme.colors.border,
    '--ptz-text': theme.colors.text,
    '--ptz-text-muted': theme.colors.textMuted,
    '--ptz-channel-q': theme.channels.query,
    '--ptz-channel-k': theme.channels.key,
    '--ptz-channel-v': theme.channels.value,
    '--ptz-radius': `${theme.radius}px`,
    '--ptz-duration': `${theme.animation.duration}ms`,
    '--ptz-easing': theme.animation.easing,
    fontFamily: theme.fontFamily,
    color: theme.colors.text
  }) as React.CSSProperties;

/**
 * Provides the active theme to all Patternize components. If no theme is
 * supplied the default green theme is used; pass `primary` (or `options`) to
 * recolor every component at once.
 */
export const ThemeProvider = ({
  theme,
  options,
  primary,
  children
}: ThemeProviderProps) => {
  const resolved = useMemo(() => {
    if (theme) return theme;
    if (options || primary) return createTheme({ ...options, primary: primary ?? options?.primary });
    return defaultTheme;
  }, [theme, options, primary]);

  return (
    <ThemeContext.Provider value={resolved}>
      <div style={themeToCssVars(resolved)}>{children}</div>
    </ThemeContext.Provider>
  );
};

/** Read the active theme. Falls back to the default theme outside a provider. */
export const useTheme = (): Theme => useContext(ThemeContext);
