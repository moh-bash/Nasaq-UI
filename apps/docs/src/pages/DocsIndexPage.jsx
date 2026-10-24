import { Link } from 'react-router-dom';
import { ArrowRight, Blocks, Code2, Palette } from 'lucide-react';
import CodeBlock from '../components/docs/CodeBlock.jsx';
import { defaultButtonConfig } from '../config/buttonDefaults.js';
import { generateButtonJSX } from '../generators/css/generateButtonJSX.js';
import { readyComponents } from '../registry/componentRegistry.js';
import { paths } from '../routes.js';
import styles from './page.module.css';

const INSTALL_CODE = ['npm install nasaq', '', 'Then import the stylesheet once and the components you use:'].join('\n');

const IMPORT_CODE = `import 'nasaq/styles.css';
import { Button } from 'nasaq';

export default function App() {
  return <Button>Save changes</Button>;
}`;

const USAGE_CODE = generateButtonJSX(defaultButtonConfig);

const NEXT_STEPS = [
  {
    to: paths.installation,
    title: 'Installation',
    body: 'Requirements, framework setup and the one import every project needs.',
  },
  {
    to: paths.components,
    title: 'Components',
    body: 'Browse the ready controls, their props and the generated code they ship.',
  },
  {
    to: paths.theming,
    title: 'Theming',
    body: 'The token set every component reads from, and how to restyle it in one place.',
  },
];

export default function DocsIndexPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} style={{ paddingBottom: 32 }}>
        <div className={styles.heroContent}>
          <div className={styles.kickerRow}>
            <span className={styles.eyebrow}>Documentation</span>
            <span className={styles.pill}>Start here</span>
          </div>
          <h1 className={styles.docsTitle} style={{ maxWidth: 640 }}>
            Build with Nasaq UI
          </h1>
          <p className={styles.lede}>
            A React component system: a token set every component reads from, accessible building
            blocks, and generated JSX, CSS and Tailwind you can drop straight into a project.
          </p>
          <div className={styles.actions}>
            <Link to={paths.installation} className={styles.primaryAction}>
              Install now
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to={paths.components} className={styles.secondaryAction}>
              Browse components
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>Quick install</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 20 }}>
          <CodeBlock code={INSTALL_CODE} language="bash" filename="terminal" />
          <CodeBlock code={IMPORT_CODE} language="jsx" filename="main.jsx" />
        </div>
        <p className={styles.sectionNote} style={{ marginTop: 14 }}>
          Requires React 18 or 19. The stylesheet defines the design tokens and the component styles;
          components import nothing else at runtime.
        </p>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>First component</h2>
        <CodeBlock code={USAGE_CODE} language="jsx" filename="ActionButton.jsx" />
        <p className={styles.sectionNote} style={{ marginTop: 14 }}>
          That is the exact usage file the Button ready component exports from its{' '}
          <Link to={paths.componentDocs('button')}>documentation page</Link>. Open any ready component in
          the playground to generate the matching stylesheet or a self-contained Tailwind version.
        </p>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>
          Next steps
          <span className={styles.sectionNote}>{readyComponents.length} ready components</span>
        </h2>
        <div className={styles.grid}>
          {NEXT_STEPS.map((step) => (
            <Link key={step.to} to={step.to} className={styles.cardFeature}>
              <span className={styles.cardName}>{step.title}</span>
              <p className={styles.cardDesc}>{step.body}</p>
            </Link>
          ))}
          {NEXT_STEPS.length % 3 === 0 ? (
            <div className={styles.cardFeature} data-muted>
              <span className={styles.cardName}>Playground</span>
              <p className={styles.cardDesc}>
                Live previews, presets and exports for every ready component.
              </p>
              <span className={styles.cardCategory}>
                <Link to={paths.playground('accordion')}>Open the studio</Link>
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.grid}>
          {[
            {
              icon: Palette,
              title: 'Theme-first design',
              body: 'Shape the token set once, then every component updates in step across the product.',
            },
            {
              icon: Blocks,
              title: 'Accessible building blocks',
              body: 'Ready controls with real behaviour, sensible defaults and reliable tokens.',
            },
            {
              icon: Code2,
              title: 'Export polished code',
              body: 'Copy the JSX, semantic CSS or Tailwind snippet without losing the design language.',
            },
          ].map((step) => {
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