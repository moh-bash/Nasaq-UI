import { useEffect, useMemo, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import SiteHeader from '../app/SiteHeader.jsx';
import AppSidebar from './AppSidebar.jsx';
import { ShellProvider } from './ShellContext.jsx';
import { getSidebarState, setSidebarState } from '../utils/shellStorage.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import styles from './DocsShell.module.css';

export default function DocsShell() {
  const isNarrow = useMediaQuery('(max-width: 1080px)');
  const stored = typeof window !== 'undefined' ? getSidebarState() : null;
  const [collapsed, setCollapsed] = useState(stored === 'collapsed');
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPlaygroundView = !!useMatch('/docs/components/:componentId/playground');

  useEffect(() => {
    setMobileOpen(false);
  }, [isPlaygroundView]); // eslint-disable-line react-hooks/set-state-in-effect

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      setSidebarState(next ? 'collapsed' : 'expanded');
      return next;
    });
  };

  const openMobileDrawer = () => setMobileOpen(true);
  const closeMobileDrawer = () => setMobileOpen(false);

  const value = useMemo(
    () => ({
      collapsed,
      toggleCollapsed,
      mobileOpen,
      openMobileDrawer,
      closeMobileDrawer,
      isNarrow,
      view: isPlaygroundView ? 'playground' : 'docs',
    }),
    [collapsed, mobileOpen, isNarrow, isPlaygroundView],
  );

  useEffect(() => {
    if (!isNarrow) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNarrow]);

  return (
    <ShellProvider value={value}>
      <div className={styles.shell} data-view={isPlaygroundView ? 'playground' : 'docs'}>
        <SiteHeader />
        <div className={styles.body}>
          <aside
            className={styles.sidebar}
            data-collapsed={collapsed ? 'true' : 'false'}
            data-mobile={mobileOpen ? 'open' : 'closed'}
            inert={isNarrow && !mobileOpen ? true : undefined}
          >
            <AppSidebar />
          </aside>
          <main className={styles.main}>
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
