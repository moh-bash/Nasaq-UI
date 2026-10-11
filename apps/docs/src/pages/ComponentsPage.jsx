import { Link } from 'react-router-dom';
import { categories, countPlanned, countReady } from '../registry/componentRegistry.js';
import styles from './page.module.css';

export default function ComponentsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Library</span>
        <h1 className={styles.display}>Components</h1>
        <p className={styles.lede}>
          {countReady()} component{countReady() === 1 ? '' : 's'} wired into the studio and{' '}
          {countPlanned()} on the bench. Every ready component shares the same token set, inspector
          and code generators.
        </p>
      </section>

      {categories.map((category) => (
        <section key={category.id} aria-label={category.label}>
          <h2 className={styles.sectionTitle}>
            {category.label}
            <span className={styles.sectionNote}>{category.components.length}</span>
          </h2>
          <div className={styles.grid}>
            {category.components.map((component) => {
              const ready = component.status === 'ready';
              const inner = (
                <>
                  <div className={styles.cardHead}>
                    <span className={styles.cardName}>{component.name}</span>
                    {ready ? null : <span className={styles.soon}>soon</span>}
                  </div>
                  <p className={styles.cardDesc}>{component.description}</p>
                  {component.tags ? (
                    <div className={styles.tags}>
                      {component.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </>
              );

              return (
                <Link
                  key={component.id}
                  to={`/docs/components/${component.id}`}
                  className={styles.card}
                  data-status={ready ? undefined : 'planned'}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
