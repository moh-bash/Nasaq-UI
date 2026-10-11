import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, Code2, Palette } from 'lucide-react';
import coverUrl from '../assets/cover.png';
import { readyComponents } from '../registry/componentRegistry.js';
import styles from './page.module.css';

const STEPS = [
  {
    icon: Palette,
    title: 'Theme-first design',
    body: 'Shape the UI system once, then watch the components update instantly across the whole product.',
  },
  {
    icon: Blocks,
    title: 'Accessible building blocks',
    body: 'Get production-ready controls with real behaviour, sensible defaults, and reliable tokens.',
  },
  {
    icon: Code2,
    title: 'Export polished code',
    body: 'Copy the JSX, semantic CSS, or Tailwind snippet without losing the design language.',
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.kickerRow}>
            <span className={styles.eyebrow}>Nasaq UI</span>
            <span className={styles.pill}>A considered React component system</span>
          </div>
          <h1 className={styles.display}>Craft elegant React interfaces with a system that feels premium.</h1>
          <p className={styles.lede}>
            Nasaq UI brings together a refined design language, accessible component building blocks,
            and a live playground for shipping polished product experiences without the design drift.
          </p>
          <div className={styles.actions}>
            <Link to="/docs" className={styles.primaryAction}>
              Get started
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/playground/accordion" className={styles.secondaryAction}>
              Open the playground
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.coverFrame}>
            <img
              src={coverUrl}
              alt="Nasaq UI React Components Library"
              className={styles.coverImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>
          In the kit
          <span className={styles.sectionNote}>{readyComponents.length} ready</span>
        </h2>
        <div className={styles.grid}>
          {readyComponents.map((component) => (
            <Link key={component.id} to={`/docs/components/${component.id}`} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardName}>{component.name}</span>
                <span className={styles.cardCategory}>{component.categoryLabel}</span>
              </div>
              <p className={styles.cardDesc}>{component.description}</p>
              <div className={styles.tags}>
                {component.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.grid}>
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className={styles.cardFeature}>
                <div className={styles.featureIconWrap}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span className={styles.cardName}>{step.title}</span>
                <p className={styles.cardDesc}>{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
