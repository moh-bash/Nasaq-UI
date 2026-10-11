import { useMemo, useState } from 'react';
import { Blocks, PanelLeftClose, Search } from 'lucide-react';
import { categories, countPlanned, countReady } from '../registry/componentRegistry.js';
import controls from './controls.module.css';
import Logo from './Logo.jsx';
import styles from './ComponentSidebar.module.css';

export default function ComponentSidebar({ activeComponentId, onSelect, onCollapse }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories;
    return categories
      .map((category) => ({
        ...category,
        components: category.components.filter(
          (component) =>
            component.name.toLowerCase().includes(term) ||
            component.description.toLowerCase().includes(term),
        ),
      }))
      .filter((category) => category.components.length > 0);
  }, [query]);

  return (
    <nav id="component-explorer" className={styles.sidebar} aria-label="Component explorer">
      <div className={styles.head}>
        <span className={styles.mark}>
          <Logo size={50} />
        </span>
        <span className={styles.wordmark}>
          <span className={styles.name}>Nasaq UI</span>
          <span className={styles.tagline}>Component playground</span>
        </span>
        {onCollapse ? (
          <button
            type="button"
            className={controls.panelClose}
            onClick={onCollapse}
            aria-label="Close component explorer"
            title="Close component explorer"
          >
            <PanelLeftClose size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

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

        {filtered.length === 0 ? (
          <p className={styles.noResults}>No components match “{query}”.</p>
        ) : (
          filtered.map((category) => (
            <section className={styles.category} key={category.id} aria-label={category.label}>
              <h3 className={styles.categoryLabel}>{category.label}</h3>
              {category.components.map((component) => {
                const ready = component.status === 'ready';
                const current = component.id === activeComponentId;
                return (
                  <button
                    key={component.id}
                    type="button"
                    className={styles.entry}
                    aria-current={current ? 'true' : undefined}
                    disabled={!ready}
                    title={ready ? component.description : `${component.name} is not built yet`}
                    onClick={() => ready && onSelect(component.id)}
                  >
                    {ready ? <span className={styles.activeDot} aria-hidden="true" /> : null}
                    <span className={styles.entryName}>{component.name}</span>
                    {!ready ? <span className={styles.soon}>soon</span> : null}
                  </button>
                );
              })}
            </section>
          ))
        )}
      </div>

      <div className={styles.foot}>
        <Blocks size={12} aria-hidden="true" />
        <span>
          {countReady()} component{countReady() === 1 ? '' : 's'} wired up, {countPlanned()} planned
        </span>
      </div>
    </nav>
  );
}
