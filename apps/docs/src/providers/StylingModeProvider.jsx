import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STYLING_MODES } from '../generators/index.js';

/* Global styling mode. The live preview always renders the semantic-CSS
   component; this only decides which generator (CSS or Tailwind) the code panel
   and export tools produce. Persisted at cp.styling.v1. */

const KEY = 'cp.styling.v1';

function safeRead() {
  try {
    const value = window.localStorage.getItem(KEY);
    return STYLING_MODES.includes(value) ? value : 'css';
  } catch {
    return 'css';
  }
}

const StylingModeContext = createContext(null);

export function StylingModeProvider({ children }) {
  const [mode, setModeState] = useState(() => safeRead());

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const setMode = useCallback((next) => {
    if (STYLING_MODES.includes(next)) setModeState(next);
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <StylingModeContext.Provider value={value}>{children}</StylingModeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStylingMode() {
  const ctx = useContext(StylingModeContext);
  if (!ctx) throw new Error('useStylingMode must be used within a StylingModeProvider');
  return ctx;
}
