import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../app/SiteHeader.jsx';
import SkipLink from '../components/SkipLink.jsx';
import AppSidebar from './AppSidebar.jsx';
import { useShell } from './useShell.js';
import styles from './DocsShell.module.css';

const SEARCH_SELECTOR = '[data-sidebar-search]';

/*
  The docs chrome. Shell state comes from the store; this component only owns
  the drawer's focus lifecycle (move focus in on open, restore it on close).
*/
export default function DocsShell() {
  const { collapsed, mobileOpen, closeMobileDrawer, isNarrow, view } = useShell();
  const triggerRef = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!isNarrow) return undefined;

    if (mobileOpen) {
      if (!wasOpen.current) {
        wasOpen.current = true;
        const active = document.activeElement;
        triggerRef.current = active && active !== document.body ? active : null;
      }
      const id = requestAnimationFrame(() => document.querySelector(SEARCH_SELECTOR)?.focus());
      return () => cancelAnimationFrame(id);
    }

    if (wasOpen.current) {
      wasOpen.current = false;
      const trigger = triggerRef.current;
      triggerRef.current = null;
      trigger?.focus?.();
    }
    return undefined;
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
    <div className={styles.shell} data-view={view}>
      <SkipLink />
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
  );
}
