import { useContext } from 'react';
import { ShellContext } from './shellContext.js';

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error('useShell must be used within a DocsShell');
  }
  return ctx;
}

/* The header is shared with the marketing layout, which has no shell. */
export function useShellOptional() {
  return useContext(ShellContext);
}
