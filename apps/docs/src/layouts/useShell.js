import { useCallback } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { useShellStore } from '../stores/shellStore.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { routePatterns } from '../routes.js';

const SEARCH_SELECTOR = '[data-sidebar-search]';

function focusSearch() {
  if (typeof document === 'undefined') return;
  document.querySelector(SEARCH_SELECTOR)?.focus();
}

/*
  The shell facade over the store. No React context: every component that needs
  shell state subscribes to the exact slice it renders. Mobile drawer state is
  tied to the pathname that opened it, so navigating closes it without an
  effect or a cascading render.
*/
export function useShell() {
  const location = useLocation();
  const playgroundMatch = useMatch(routePatterns.playground);

  const collapsed = useShellStore((state) => state.sidebarCollapsed);
  const drawerOpen = useShellStore((state) => state.mobileDrawerOpen);
  const drawerPath = useShellStore((state) => state.mobileDrawerPath);
  const toggleCollapsed = useShellStore((state) => state.toggleCollapsed);
  const openDrawer = useShellStore((state) => state.openMobileDrawer);
  const closeMobileDrawer = useShellStore((state) => state.closeMobileDrawer);
  const getLastView = useShellStore((state) => state.getLastView);

  const isNarrow = useMediaQuery('(max-width: 1080px)');
  const inDocs = location.pathname === '/docs' || location.pathname.startsWith('/docs/');
  const mobileOpen = drawerOpen && drawerPath === location.pathname;

  const openMobileDrawer = useCallback(() => {
    openDrawer(location.pathname);
  }, [location.pathname, openDrawer]);

  const focusSidebarSearch = useCallback(() => {
    if (isNarrow) {
      openMobileDrawer();
      requestAnimationFrame(() => {
        requestAnimationFrame(focusSearch);
      });
      return;
    }
    focusSearch();
  }, [isNarrow, openMobileDrawer]);

  return {
    collapsed,
    toggleCollapsed,
    mobileOpen,
    openMobileDrawer,
    closeMobileDrawer,
    focusSidebarSearch,
    isNarrow,
    inDocs,
    getLastView,
    view: playgroundMatch ? 'playground' : 'docs',
  };
}
