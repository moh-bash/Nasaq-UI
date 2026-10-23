import { createContext } from 'react';

/* The context object lives on its own so the provider file only exports a
   component (React Refresh) and the hook file only exports a hook. */
export const ShellContext = createContext(null);
