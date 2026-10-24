import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { THEME_TOKENS, THEME_VERSION, COMPONENT_VARIABLES, themeDefaults } from 'nasaq';
import { readyComponents } from '../registry/componentRegistry.js';
import { useTheme } from '../hooks/useTheme.js';
import ThemeEditor from '../playground/ThemeEditor.jsx';
import ComponentPreview from '../components/ui/ComponentPreview.jsx';
import CodeBlock from '../components/docs/CodeBlock.jsx';
import { paths } from '../routes.js';
import styles from './page.module.css';

export default function ThemingPage() {
  const { theme, resolved, setMode, setToken, resetToken, resetTheme } = useTheme();

  const rootBlock = [
    ':root {',
    ...THEME_TOKENS.map((token) => `  --color-${token.key}: ${themeDefaults.light[token.key]};`),
    '}',
  ].join('\n');

  const darkBlock = [
    "[data-theme-mode='dark'] {",
    ...THEME_TOKENS.map((token) => `  --color-${token.key}: ${themeDefaults.dark[token.key]};`),
    '}',
  ].join('\n');

  return (
    <div className={styles.page}>
      <Link to="/docs" className={styles.back}>
        <ArrowRight size={14} aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
        Start
      </Link>

      <section className={styles.docsHead}>
        <div>
          <span className={styles.eyebrow}>Customization</span>
          <h1 className={styles.docsTitle}>Theming &amp; tokens</h1>
          <p className={styles.docsOverview}>
            Every component reads its colours from the same <code>--color-*</code> tokens. Change a
            token once and the whole kit follows — including the generated CSS.
          </p>
        </div>
      </section>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>The token set (v{THEME_VERSION})</h2>
        <div className={styles.wrap}>
          <table className={styles.tokenTable}>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Role</th>
                <th scope="col">Light</th>
                <th scope="col">Dark</th>
              </tr>
            </thead>
            <tbody>
              {THEME_TOKENS.map((token) => (
                <tr key={token.key}>
                  <td>
                    <code>--color-{token.key}</code>
                  </td>
                  <td>{token.role}</td>
                  <td>
                    <span className={styles.swatch} style={{ background: themeDefaults.light[token.key] }} />
                    <code>{themeDefaults.light[token.key]}</code>
                  </td>
                  <td>
                    <span className={styles.swatch} style={{ background: themeDefaults.dark[token.key] }} />
                    <code>{themeDefaults.dark[token.key]}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Component variables</h2>
        <p className={styles.sectionNote}>
          Every Playground control writes documented <code>--nq-*</code> variables (the size
          selector writes its four size values together). Generated CSS is a short override block,
          so you can also set these variables yourself.
        </p>
        {Object.entries(COMPONENT_VARIABLES).map(([component, variables]) => (
          <section key={component} style={{ marginTop: 24 }}>
            <h3 className={styles.cardCategory} style={{ marginBottom: 8 }}>
              {component[0].toUpperCase() + component.slice(1)}
            </h3>
            <div className={styles.wrap}>
              <table className={styles.tokenTable}>
                <thead>
                  <tr>
                    <th scope="col">Control</th>
                    <th scope="col">Variable</th>
                    <th scope="col">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {variables.map((entry) => (
                    <tr key={entry.variable}>
                      <td>{entry.control}</td>
                      <td>
                        <code>{entry.variable}</code>
                      </td>
                      <td>
                        <code>{entry.defaultValue}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <div className={styles.twoCol} style={{ marginTop: 28 }}>
        <div className={styles.panel} style={{ marginTop: 0 }}>
          <h2 className={styles.panelTitle}>Live editor</h2>
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
            Adjust a token, then <Link to={paths.playground('accordion')}>open a component</Link> to fine-tune
            a single control or export its stylesheet.
          </p>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Override in your CSS</h2>
        <div className={styles.twoCol} style={{ gridTemplateColumns: '1fr 1fr' }}>
          <CodeBlock code={rootBlock} language="css" filename="theme.css" />
          <CodeBlock code={darkBlock} language="css" filename="theme.dark.css" />
        </div>
        <p className={styles.sectionNote} style={{ marginTop: 12 }}>
          Dark mode is keyed on <code>[data-theme-mode=&quot;dark&quot;]</code> and{' '}
          <code>[data-theme=&quot;dark&quot;]</code>, so you can drive it from HTML, JavaScript, or
          your own attribute naming.
        </p>
      </div>
    </div>
  );
}