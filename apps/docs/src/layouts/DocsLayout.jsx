import { NavLink, Outlet } from 'react-router-dom';
import SiteHeader from '../app/SiteHeader.jsx';
import { docsNav } from '../navigation/docs-nav.js';
import styles from './DocsLayout.module.css';

export default function DocsLayout() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav} aria-label="Documentation">
            {docsNav.map((section) => (
              <div key={section.label} className={styles.section}>
                <p className={styles.sectionLabel}>{section.label}</p>
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? styles.active : styles.item)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}