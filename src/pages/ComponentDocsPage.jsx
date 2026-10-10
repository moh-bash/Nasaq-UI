import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getComponent, getReadyComponent } from '../registry/componentRegistry.js';
import ComponentPreview from '../components/ui/ComponentPreview.jsx';
import { useTheme } from '../providers/ThemeProvider.jsx';
import styles from './page.module.css';

export default function ComponentDocsPage() {
  const { componentId } = useParams();
  const component = getComponent(componentId);
  const ready = getReadyComponent(componentId);
  const { resolved } = useTheme();

  const usage = useMemo(() => {
    if (!ready) return '';
    const output = ready.generators.css(ready.defaultConfig, resolved);
    return output.files.find((file) => file.id === 'usage')?.code || '';
  }, [ready, resolved]);

  if (!component) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.display}>Not in the library</h1>
        <p className={styles.lede}>No component is registered under “{componentId}”.</p>
        <div className={styles.actions} style={{ justifyContent: 'center' }}>
          <Link to="/components" className={styles.primaryAction}>
            Back to components
          </Link>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className={styles.page}>
        <Link to="/components" className={styles.back}>
          <ArrowLeft size={14} aria-hidden="true" />
          Components
        </Link>
        <section className={styles.docsHead}>
          <div>
            <h1 className={styles.docsTitle}>{component.name}</h1>
            <p className={styles.docsOverview}>{component.description}</p>
          </div>
          <span className={styles.soon}>On the bench</span>
        </section>
        <div className={styles.panel}>
          <p className={styles.cardDesc}>
            {component.name} is planned. It will reuse the same token set, inspector and generators as
            the rest of the library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/components" className={styles.back}>
        <ArrowLeft size={14} aria-hidden="true" />
        Components
      </Link>

      <section className={styles.docsHead}>
        <div>
          <span className={styles.eyebrow}>{component.categoryLabel}</span>
          <h1 className={styles.docsTitle}>{component.name}</h1>
          <p className={styles.docsOverview}>{component.docs.overview}</p>
        </div>
        <Link to={`/playground/${component.id}`} className={styles.primaryAction}>
          Open in playground
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Preview</h2>
        <ComponentPreview
          component={component}
          config={component.defaultConfig}
          className={styles.previewMount}
        />
      </div>

      <div className={styles.twoCol} style={{ marginTop: 28 }}>
        <div className={styles.panel} style={{ marginTop: 0 }}>
          <h2 className={styles.panelTitle}>Props</h2>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {component.docs.props.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                  </td>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                  <td>
                    <code>{prop.default}</code>
                  </td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.panel} style={{ marginTop: 0 }}>
          <h2 className={styles.panelTitle}>Notes</h2>
          <ul className={styles.notes}>
            {component.docs.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Usage</h2>
        <pre className={styles.usage}>{usage}</pre>
      </div>
    </div>
  );
}
