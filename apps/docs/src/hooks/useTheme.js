import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { defaultTheme, resolveTheme } from 'nasaq';
import { useThemeStore } from '../stores/themeStore.js';
import { useMediaQuery } from './useMediaQuery.js';

/*
  Read the theme store through a narrow selector and resolve the effective
  palette. Only the tokens that actually changed trigger a re-render, and the
  mode/system media query is the single source for "resolved".
*/
export function useTheme() {
  const {
    mode,
    overrides,
    setMode,
    setToken,
    resetToken,
    resetOverrides,
    resetTheme,
  } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
      overrides: state.overrides,
      setMode: state.setMode,
      setToken: state.setToken,
      resetToken: state.resetToken,
      resetOverrides: state.resetOverrides,
      resetTheme: state.resetTheme,
    })),
  );

  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const resolvedMode = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  const theme = useMemo(
    () => ({ ...defaultTheme(), mode, overrides }),
    [mode, overrides],
  );

  const resolved = useMemo(
    () => resolveTheme({ ...defaultTheme(), mode: resolvedMode, overrides }),
    [resolvedMode, overrides],
  );

  const overridesStyle = useMemo(() => {
    const style = {};
    for (const [token, value] of Object.entries(overrides)) {
      style[`--color-${token}`] = value;
    }
    return style;
  }, [overrides]);

  const setModeSafe = useCallback((next) => setMode(next), [setMode]);

  return {
    theme,
    resolved,
    mode,
    resolvedMode,
    overridesStyle,
    setMode: setModeSafe,
    setToken,
    setOverride: setToken,
    resetToken,
    resetOverride: resetToken,
    resetOverrides,
    resetTheme,
  };
}
