import { useEffect } from 'react';
import { useShell } from '../layouts/useShell.js';
import { useShellStore } from '../stores/shellStore.js';

/*
  One global keyboard layer. It never owns state beyond the stores, so the
  shortcuts work on every route and do not remount when the page changes.
*/
export default function AppShortcuts() {
  const setCommandOpen = useShellStore((state) => state.setCommandOpen);
  const setHelpOpen = useShellStore((state) => state.setHelpOpen);
  const setInspectorOpen = useShellStore((state) => state.setInspectorOpen);
  const inspectorOpen = useShellStore((state) => state.inspectorOpen);
  const { focusSidebarSearch, toggleCollapsed } = useShell();

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (mod && event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('nq:copy-primary'));
        return;
      }

      if (typing) return;

      if (event.key === '/') {
        event.preventDefault();
        focusSidebarSearch();
        return;
      }

      if (event.key === '[') {
        event.preventDefault();
        toggleCollapsed();
        return;
      }

      if (event.key === ']') {
        event.preventDefault();
        setInspectorOpen(!(inspectorOpen ?? true));
        return;
      }

      if (event.key === '?') {
        event.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    focusSidebarSearch,
    inspectorOpen,
    setCommandOpen,
    setHelpOpen,
    setInspectorOpen,
    toggleCollapsed,
  ]);

  return null;
}
