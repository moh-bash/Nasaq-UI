import { Link } from 'react-router-dom';
import { Menu, MoonStar, Search, SunMedium } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.js';
import Logo from '../playground/Logo.jsx';
import { useShell } from '../layouts/useShell.js';
import { useShellStore } from '../stores/shellStore.js';
import styles from './SiteHeader.module.css';

const GITHUB_URL = 'https://github.com/moh-bash/Nasaq-UI';

function GitHubMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

export default function SiteHeader() {
  const { resolvedMode, setMode } = useTheme();
  const shell = useShell();
  const { inDocs, isNarrow, mobileOpen } = shell;
  const setCommandOpen = useShellStore((state) => state.setCommandOpen);
  const isDark = resolvedMode === 'dark';

  return (
    <header className={styles.header}>
      {inDocs && isNarrow ? (
        <button
          type="button"
          id="shell-mobile-trigger"
          className={styles.iconButton}
          aria-label="Open documentation menu"
          aria-expanded={mobileOpen}
          aria-controls="docs-sidebar"
          title="Open documentation menu"
          onClick={shell.openMobileDrawer}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
      ) : null}

      <Link to="/" className={styles.brand}>
        <Logo size={32} className={styles.brandMark} />
        <span className={styles.wordmark}>
          <span className={styles.name}>Nasaq UI</span>
          <span className={styles.tagline}>Developer tooling for refined interfaces</span>
        </span>
      </Link>

      <div className={styles.actions}>
        {inDocs ? (
          <button
            type="button"
            className={styles.searchTrigger}
            onClick={() => setCommandOpen(true)}
            aria-keyshortcuts="Control+K Meta+K"
            title="Search components and actions"
          >
            <Search size={14} aria-hidden="true" />
            <span className={styles.searchLabel}>Search…</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </button>
        ) : null}

        <button
          type="button"
          className={styles.iconButton}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={() => setMode(isDark ? 'light' : 'dark')}
        >
          {isDark ? <SunMedium size={16} aria-hidden="true" /> : <MoonStar size={16} aria-hidden="true" />}
        </button>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className={styles.iconButton}
          aria-label="Nasaq UI source on GitHub"
          title="Nasaq UI on GitHub"
        >
          <GitHubMark size={16} />
        </a>
      </div>
    </header>
  );
}
