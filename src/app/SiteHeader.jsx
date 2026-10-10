import { Link, NavLink } from 'react-router-dom';
import { MoonStar, Play, SunMedium } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider.jsx';
import Logo from '../playground/Logo.jsx';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  const { theme, setMode } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="Nasaq UI home">
        <Logo size={44} className={styles.brandMark} />
        <span className={styles.wordmark}>
          <span className={styles.name}>Nasaq UI</span>
          <span className={styles.tagline}>Developer tooling for refined interfaces</span>
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          Home
        </NavLink>
        <NavLink to="/components" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          Components
        </NavLink>
        <NavLink to="/theme" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
          Theme
        </NavLink>
      </nav>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.themeToggle}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={() => setMode(isDark ? 'light' : 'dark')}
        >
          {isDark ? <SunMedium size={16} aria-hidden="true" /> : <MoonStar size={16} aria-hidden="true" />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
        <Link to="/playground/accordion" className={styles.cta} aria-label="Open playground">
          <Play size={14} fill="currentColor" aria-hidden="true" />
          Playground
        </Link>
      </div>
    </header>
  );
}
