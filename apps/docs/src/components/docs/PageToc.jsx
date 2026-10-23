import { useActiveHeading } from '../../hooks/useActiveHeading.js';
import styles from './PageToc.module.css';

/* Sticky on-page navigation. Links are real anchors so they survive reloads. */
export default function PageToc({ items }) {
  const activeId = useActiveHeading(items.map((item) => item.id));

  return (
    <aside className={styles.toc} aria-label="On this page">
      <p className={styles.title}>On this page</p>
      <ol className={styles.list}>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={styles.link}
                data-active={active ? 'true' : undefined}
                aria-current={active ? 'location' : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
