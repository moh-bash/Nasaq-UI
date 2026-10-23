import { useMemo, useState } from 'react';
import { Blocks, PanelLeftClose, Search } from 'lucide-react';
import { NavLink, useMatch } from 'react-router-dom';
import { buildSidebarSections, countPlanned, countReady } from '../navigation/docs-nav.js';
import { useShell } from './useShell.js';
import { paths, routePatterns } from '../routes.js';
import styles from './AppSidebar.module.css';

export default function AppSidebar() {
  const [query, setQuery] = useState('');
  const sections = useMemo(() => buildSidebarSections(), []);
  const { collapsed, toggleCollapsed, closeMobileDrawer } = useShell();
  const isPlaygroundView = !!useMatch(routePatterns.playground);

  const filteredSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return sections;
    const result = [];
    for (const section of sections) {
      if (section.type === 'static') {
        const items = (section.items || []).filter((item) => {
          return item.label.toLowerCase().includes(term);
        });
        if (items.length > 0) {
          result.push({ ...section, items });
        }
        continue;
      }
      if (section.type === 'components') {
        const baseItems = (section.items || []).filter((item) => item.label.toLowerCase().includes(term));
        const filteredCats = (section.categories || [])
          .map((category) => ({
            ...category,
            components: (category.components || []).filter(
              (component) =>
                component.name.toLowerCase().includes(term) ||
                (component.description || '').toLowerCase().includes(term),
            ),
          }))
          .filter((category) => category.components.length > 0);
        if (baseItems.length > 0 || filteredCats.length > 0) {
          result.push({
            ...section,
            items: baseItems,
            categories: filteredCats,
          });
        }
      }
    }
    return result;
  }, [query, sections]);

  const getComponentTo = (componentId) => {
    if (isPlaygroundView) {
      return paths.playground(componentId);
    }
    return paths.componentDocs(componentId);
  };

  return (
    <nav className={styles.sidebar} aria-label="Documentation" data-collapsed={collapsed ? 'true' : 'false'}>
      <div className={styles.body}>
        <div className={styles.searchWrap}>
          <Search size={13} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.search}
            name="component-search"
            placeholder="Search components"
            value={query}
            aria-label="Search components"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {filteredSections.length === 0 ? (
          <p className={styles.noResults}>No components match “{query}”.</p>
        ) : (
          filteredSections.map((section) => (
            <section className={styles.section} key={section.id} aria-label={section.label}>
              <p className={styles.sectionLabel}>{section.label}</p>
              {(section.items || []).map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? styles.active : styles.item)}
                  onClick={closeMobileDrawer}
                >
                  {item.label}
                </NavLink>
              ))}
              {(section.categories || []).map((category) => (
                <div className={styles.category} key={category.id} aria-label={category.label}>
                  <h3 className={styles.categoryLabel}>{category.label}</h3>
                  {(category.components || []).map((component) => {
                    if (!component.ready) {
                      return (
                        <div
                          key={component.id}
                          className={styles.entryDisabled}
                          title={`${component.name} is not built yet`}
                          aria-disabled="true"
                        >
                          <span className={styles.entryName}>{component.name}</span>
                          <span className={styles.soon}>soon</span>
                        </div>
                      );
                    }
                    return (
                      <NavLink
                        key={component.id}
                        to={getComponentTo(component.id)}
                        className={({ isActive }) => (isActive ? styles.entryActive : styles.entry)}
                        title={component.description}
                        onClick={closeMobileDrawer}
                      >
                        <span className={styles.activeDot} aria-hidden="true" />
                        <span className={styles.entryName}>{component.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </section>
          ))
        )}
      </div>

      <div className={styles.foot}>
        <Blocks size={12} aria-hidden="true" />
        <span>
          {countReady()} component{countReady() === 1 ? '' : 's'} wired up, {countPlanned()} planned
        </span>
        {toggleCollapsed ? (
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PanelLeftClose size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
