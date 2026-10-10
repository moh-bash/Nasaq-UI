import { Link } from 'react-router-dom';
import { readyComponents } from '../registry/componentRegistry.js';
import { useTheme } from '../providers/ThemeProvider.jsx';
import ThemeEditor from '../playground/ThemeEditor.jsx';
import ComponentPreview from '../components/ui/ComponentPreview.jsx';
import styles from './page.module.css';

export default function ThemePage() {
  const { theme, resolved, setMode, setToken, resetToken, resetTheme } = useTheme();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Theme</span>
        <h1 className={styles.display}>The palette every component reads from</h1>
        <p className={styles.lede}>
          Edit the library tokens once and every component follows. Components only break away from a
          token when you pin an explicit override on their own inspector.
        </p>
      </section>

      <div className={styles.twoCol}>
        <div className={styles.panel} style={{ marginTop: 0 }}>
          <h2 className={styles.panelTitle}>Tokens</h2>
          <ThemeEditor
            theme={theme}
            resolvedTheme={resolved}
            onMode={setMode}
            onToken={setToken}
            onResetToken={resetToken}
            onResetTheme={resetTheme}
          />
        </div>

        <div className={styles.panel} style={{ marginTop: 0 }}>
          <h2 className={styles.panelTitle}>Live response</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {readyComponents.map((component) => (
              <div key={component.id}>
                <p className={styles.cardCategory} style={{ marginBottom: 8 }}>
                  {component.name}
                </p>
                <ComponentPreview
                  component={component}
                  config={component.defaultConfig}
                  className={styles.previewMount}
                />
              </div>
            ))}
          </div>
          <p className={styles.sectionNote} style={{ marginTop: 16 }}>
            Adjust a token, then{' '}
            <Link to="/playground/accordion">open a component</Link> to fine-tune it.
          </p>
        </div>
      </div>
    </div>
  );
}
