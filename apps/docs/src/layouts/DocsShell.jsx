import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';
import SiteHeader from '../app/SiteHeader.jsx';
import AppSidebar from './AppSidebar.jsx';
import { ShellProvider } from './ShellContext.jsx';
import { getSidebarState, setSidebarState } from '../utils/shellStorage.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { routePatterns } from '../routes.js';
import styles from './DocsShell.module.css';

const SEARCH_SELECTOR = '[data-sidebar-search]';

export default function DocsShell() {
  const isNarrow = useMediaQuery('(max-width: 1080px)');
  const stored = typeof window !== 'undefined' ? getSidebarState() : null;
  const [collapsed, setCollapsed] = useState(stored === 'collapsed');
  const location = useLocation();
  /* Drawer state is tied to the pathname that opened it: navigating closes the
     drawer without an effect, so there is no cascading render. */
  const [drawer, setDrawer] = useState({ open: false, path: location.pathname });
  const mobileOpen = drawer.open && drawer.path === location.pathname;
  const triggerRef = useRef(null);

  const isPlaygroundView = !!useMatch(routePatterns.playground);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      setSidebarState(next ? 'collapsed' : 'expanded');
      return next;
    });
  }, []);

  const openMobileDrawer = useCallback(
    (trigger) => {
      triggerRef.current = trigger || (typeof document !== 'undefined' ? document.activeElement : null);
      setDrawer({ open: true, path: location.pathname });
    },
    [location.pathname],
  );

  const closeMobileDrawer = useCallback(() => {
    setDrawer({ open: false, path: location.pathname });
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger && typeof trigger.focus === 'function') {
      requestAnimationFrame(() => trigger.focus());
    }
  }, [location.pathname]);

  const focusSidebarSearch = useCallback(() => {
    if (isNarrow) {
      openMobileDrawer();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => document.querySelector(SEARCH_SELECTOR)?.focus());
      });
      return;
    }
    document.querySelector(SEARCH_SELECTOR)?.focus();
  }, [isNarrow, openMobileDrawer]);

  const value = useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      mobileOpen,
      openMobileDrawer,
      closeMobileDrawer,
      focusSidebarSearch,
      isNarrow,
      view: isPlaygroundView ? 'playground' : 'docs',
    }),
    [
      collapsed,
      toggleCollapsed,
      mobileOpen,
      openMobileDrawer,
      closeMobileDrawer,
      focusSidebarSearch,
      isNarrow,
      isPlaygroundView,
    ],
  );

  /* Move focus into the drawer when it opens so keyboard users are not left on
     the trigger behind the backdrop. */
  useEffect(() => {
    if (!isNarrow || !mobileOpen) return;
    const id = requestAnimationFrame(() => document.querySelector(SEARCH_SELECTOR)?.focus());
    return () => cancelAnimationFrame(id);
  }, [isNarrow, mobileOpen]);

  useEffect(() => {
    if (!isNarrow || !mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMobileDrawer();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMobileDrawer, isNarrow, mobileOpen]);

  return (
    <ShellProvider value={value}>
      <div className={styles.shell} data-view={isPlaygroundView ? 'playground' : 'docs'}>
        <SiteHeader />
        <div className={styles.body}>
          <aside
            className={styles.sidebar}
            aria-label="Sidebar"
            data-collapsed={collapsed ? 'true' : 'false'}
            data-mobile={mobileOpen ? 'open' : 'closed'}
            inert={isNarrow && !mobileOpen ? true : undefined}
          >
            <AppSidebar />
          </aside>
          <main className={styles.main} id="main-content">
            <Outlet />
          </main>
        </div>
        {isNarrow && mobileOpen ? (
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close sidebar"
            onClick={closeMobileDrawer}
          />
        ) : null}
      </div>
    </ShellProvider>
  );
}
