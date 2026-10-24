import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getComponent, getReadyComponent, readyComponents } from '../registry/componentRegistry.js';
import ComponentPreview from '../components/ui/ComponentPreview.jsx';
import PropTable from '../components/docs/PropTable.jsx';
import CodeBlock from '../components/docs/CodeBlock.jsx';
import PageToc from '../components/docs/PageToc.jsx';
import SectionHeading from '../components/docs/SectionHeading.jsx';
import VariantGallery from '../components/docs/VariantGallery.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { useShellStore } from '../stores/shellStore.js';
import { paths } from '../routes.js';
import styles from './page.module.css';

export default function ComponentDocsPage() {
  const { componentId } = useParams();
  const component = getComponent(componentId);
  const ready = getReadyComponent(componentId);
  const { resolved } = useTheme();
  const setLastView = useShellStore((state) => state.setLastView);

  useEffect(() => {
    if (ready) setLastView(ready.id, 'docs');
  }, [ready, setLastView]);

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
  const hasVariants = component.sections.some((section) =>
    section.fields.some(
      (field) =>
        field.type === 'select' &&
        !field.path.includes('.') &&
        ['variant', 'size', 'tone', 'style'].includes(field.path) &&
        field.options?.length > 1,
    ),
  );

  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'preview', label: 'Preview' },
    ...(hasVariants ? [{ id: 'variants', label: 'Variants' }] : []),
    { id: 'props', label: 'Props' },
    { id: 'usage', label: 'Usage' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className={styles.page}>
      <Link to="/docs/components" className={styles.back}>
        <ArrowLeft size={14} aria-hidden="true" />
        Components
      </Link>

      <div className={styles.docsLayout}>
        <article>
          <section className={styles.docsHead} id="overview">
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
            <SectionHeading id="preview" className={styles.panelTitle}>
              Preview
            </SectionHeading>
            <ComponentPreview
              component={component}
              config={component.defaultConfig}
              className={styles.previewMount}
            />
          </div>

          {hasVariants ? (
            <div className={styles.panel} style={{ marginTop: 28 }}>
              <SectionHeading id="variants" className={styles.panelTitle}>
                Variants
              </SectionHeading>
              <VariantGallery component={component} />
            </div>
          ) : null}

          <div className={styles.twoCol} style={{ marginTop: 28 }}>
            <div className={styles.panel} style={{ marginTop: 0 }}>
              <SectionHeading id="props" className={styles.panelTitle}>
                Props
              </SectionHeading>
              <PropTable props={component.docs.props} />
            </div>

            <div className={styles.panel} style={{ marginTop: 0 }}>
              <SectionHeading id="notes" className={styles.panelTitle}>
                Notes
              </SectionHeading>
              <ul className={styles.notes}>
                {component.docs.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.panel}>
            <SectionHeading id="usage" className={styles.panelTitle}>
              Usage
            </SectionHeading>
            <CodeBlock code={usage} language="jsx" filename="usage.jsx" showLineNumbers />
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
        </article>

        <PageToc items={toc} />
      </div>
    </div>
  );
}