import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getComponent, getReadyComponent, readyComponents } from '../registry/componentRegistry.js';
import ComponentPreview from '../components/ui/ComponentPreview.jsx';
import PropTable from '../components/docs/PropTable.jsx';
import CodeBlock from '../components/docs/CodeBlock.jsx';
import { useTheme } from '../providers/ThemeProvider.jsx';
import { setLastView } from '../utils/shellStorage.js';
import { paths } from '../routes.js';
import styles from './page.module.css';

export default function ComponentDocsPage() {
  const { componentId } = useParams();
  const component = getComponent(componentId);
  const ready = getReadyComponent(componentId);
  const { resolved } = useTheme();

  useEffect(() => {
    if (ready) setLastView(ready.id, 'docs');
  }, [ready]);

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
          <Link to={paths.components} className={styles.primaryAction}>
            Back to components
          </Link>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className={styles.page}>
        <Link to={paths.components} className={styles.back}>
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

  const index = readyComponents.findIndex((entry) => entry.id === component.id);
  const prev = readyComponents[index - 1] || null;
  const next = readyComponents[index + 1] || null;

  return (
    <div className={styles.page}>
      <Link to="/docs/components" className={styles.back}>
        <ArrowLeft size={14} aria-hidden="true" />
        Components
      </Link>

      <section className={styles.docsHead}>
        <div>
          <span className={styles.eyebrow}>{component.categoryLabel}</span>
          <h1 className={styles.docsTitle}>{component.name}</h1>
          <p className={styles.docsOverview}>{component.docs.overview}</p>
        </div>
        <Link to={paths.playground(component.id)} className={styles.primaryAction}>
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
          <PropTable props={component.docs.props} />
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
        <CodeBlock code={usage} language="jsx" filename="usage.jsx" />
      </div>

      <nav className={styles.pager}>
        {prev ? (
          <Link to={paths.componentDocs(prev.id)} className={styles.pagerLink}>
            <ArrowLeft size={14} aria-hidden="true" />
            <span>
              <em>Previous</em>
              {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={paths.componentDocs(next.id)} className={styles.pagerLink} data-next>
            <span>
              <em>Next</em>
              {next.name}
            </span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}