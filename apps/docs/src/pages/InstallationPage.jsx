import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CodeBlock from '../components/docs/CodeBlock.jsx';
import styles from './page.module.css';

const INSTALL_CODE = 'npm install nasaq';

const ENTRY_CODE = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'nasaq/styles.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`;

const USAGE_CODE = `import { Button } from 'nasaq';

export default function Demo() {
  return (
    <Button variant="primary" size="md">
      Save changes
    </Button>
  );
}`;

const THEME_CODE = `:root {
  --color-primary: #1e3ae0;
  --color-surface: #ffffff;
}`;

const REQUIREMENTS = [
  { label: 'React', value: '18 or 19' },
  { label: 'Node', value: '18+ (npm 9+)' },
  { label: 'Bundler', value: 'Vite, webpack, Next.js, or any bundler that resolves ESM' },
  { label: 'CSS', value: 'Support for a single imported stylesheet' },
];

export default function InstallationPage() {
  return (
    <div className={styles.page}>
      <Link to="/docs" className={styles.back}>
        <ArrowRight size={14} aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
        Start
      </Link>

      <section className={styles.docsHead}>
        <div>
          <span className={styles.eyebrow}>Getting started</span>
          <h1 className={styles.docsTitle}>Installation</h1>
          <p className={styles.docsOverview}>
            One package, one stylesheet import. Nasaq UI ships compiled ESM and CJS builds with
            TypeScript types, and the components pull everything else from CSS variables.
          </p>
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Requirements</h2>
        <div className={styles.grid}>
          {REQUIREMENTS.map((item) => (
            <div key={item.label} className={styles.cardFeature}>
              <span className={styles.cardCategory}>{item.label}</span>
              <span className={styles.cardName} style={{ fontSize: '1rem' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Install</h2>
        <CodeBlock code={INSTALL_CODE} language="bash" filename="terminal" />
        <p className={styles.sectionNote} style={{ marginTop: 12 }}>
          If you are not already in a React project, add <code>react</code> and{' '}
          <code>react-dom</code> alongside.
        </p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Import the stylesheet</h2>
        <CodeBlock code={ENTRY_CODE} language="jsx" filename="main.jsx" />
        <p className={styles.sectionNote} style={{ marginTop: 12 }}>
          The stylesheet defines the <code>--color-*</code> design tokens on <code>:root</code> and
          the styles all components rely on. Import it once, in the app entry or layout, before your
          own CSS.
        </p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Use a component</h2>
        <CodeBlock code={USAGE_CODE} language="jsx" filename="Demo.jsx" />
        <p className={styles.sectionNote} style={{ marginTop: 12 }}>
          In Next.js, put the stylesheet import in the app layout or <code>_app</code> and the
          component imports in the pages that use them.
        </p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>What is in the package</h2>
        <div className={styles.grid} style={{ gridTemplateColumns: '180px minmax(0, 1fr)' }}>
          <div className={styles.cardFeature}>
            <span className={styles.cardName}>dist/</span>
            <p className={styles.cardDesc}>nasaq.js (ESM), nasaq.cjs (CommonJS), styles.css.</p>
          </div>
          <div className={styles.cardFeature}>
            <span className={styles.cardName}>types/</span>
            <p className={styles.cardDesc}>
              Hand-written TypeScript declarations for every export.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Restyle it</h2>
        <CodeBlock code={THEME_CODE} language="css" filename="app.css" />
        <p className={styles.sectionNote} style={{ marginTop: 12 }}>
          Every component reads its colours from the theme tokens. Override just the variables you
          need, or see <Link to="/docs/theming">Theming</Link> for the full set and a live editor.
        </p>
      </section>
    </div>
  );
}