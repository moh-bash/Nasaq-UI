import { createContext, useContext } from 'react';

const ShellContext = createContext(null);

export function ShellProvider({ value, children }) {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error('useShell must be used within a DocsShell');
  }
  return ctx;
}
