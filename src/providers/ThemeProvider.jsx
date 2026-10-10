import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultTheme, resolveTheme } from '../theme/themeDefaults.js';

/* Global library theme: mode (light/dark) plus per-token overrides.
   Persisted at cp.theme.v1 and shared by the studio, the docs pages and the
   standalone theme page. */

const KEY = 'cp.theme.v1';
const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function getSystemMode() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function safeRead() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function validateTheme(raw) {
  const base = defaultTheme();
  const fallbackMode = getSystemMode();
  if (!raw || typeof raw !== 'object') return { ...base, mode: fallbackMode };
  const mode = raw.mode === 'dark' ? 'dark' : 'light';
  const overrides = {};
  if (raw.overrides && typeof raw.overrides === 'object') {
    for (const [key, value] of Object.entries(raw.overrides)) {
      if (typeof value === 'string' && HEX_RE.test(value.trim())) {
        overrides[key] = value.trim().toLowerCase();
      }
    }
  }
  return { version: base.version, mode, overrides };
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => validateTheme(safeRead()));

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-mode', theme.mode);
    root.setAttribute('data-theme', theme.mode);
  }, [theme.mode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(theme));
    } catch {
      /* storage blocked — the app still works in-memory */
    }
  }, [theme]);

  const resolved = useMemo(() => resolveTheme(theme), [theme]);

  const setMode = useCallback((mode) => {
    setTheme((current) => ({ ...current, mode: mode === 'dark' ? 'dark' : 'light' }));
  }, []);

  const setToken = useCallback((token, value) => {
    setTheme((current) => {
      const overrides = { ...current.overrides };
      if (value === null)
        delete overrides[token];
      else overrides[token] = value;
      return { ...current, overrides };
    });
  }, []);

  const resetToken = useCallback((token) => {
    setTheme((current) => {
      const overrides = { ...current.overrides };
      delete overrides[token];
      return { ...current, overrides };
    });
  }, []);

  const resetTheme = useCallback(() => setTheme(defaultTheme()), []);

  const overridesStyle = useMemo(() => {
    const style = {};
    for (const [key, value] of Object.entries(theme.overrides || {})) {
      style[`--color-${key}`] = value;
    }
    return style;
  }, [theme]);

  const value = useMemo(
    () => ({ theme, resolved, overridesStyle, setMode, setToken, resetToken, resetTheme }),
    [theme, resolved, overridesStyle, setMode, setToken, resetToken, resetTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
