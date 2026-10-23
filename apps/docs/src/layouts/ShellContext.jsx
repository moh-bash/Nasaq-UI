import { ShellContext } from './shellContext.js';

export function ShellProvider({ value, children }) {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
