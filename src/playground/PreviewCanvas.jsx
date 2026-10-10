import LivePreview from '../components/ui/LivePreview.jsx';
import styles from './PreviewCanvas.module.css';

const VIEWPORT_WIDTH = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
};

const INK_TOKENS = [
  ['primary', '--color-primary'],
  ['secondary', '--color-secondary'],
  ['accent', '--color-accent'],
  ['surface', '--color-surface'],
  ['text', '--color-text'],
  ['border', '--color-border'],
];

export default function PreviewCanvas({ component, config, previewCss, viewport, background, resolved }) {
  const Preview = component.Preview;
  const width = VIEWPORT_WIDTH[viewport] || '100%';

  return (
    <div className={styles.canvas} data-bg={background} id="preview-canvas">
      <div className={styles.stageWrap}>
        <div className={styles.stage} style={{ maxWidth: width }}>
          <span className={`${styles.crop} ${styles.cropTopLeft}`} aria-hidden="true" />
          <span className={`${styles.crop} ${styles.cropTopRight}`} aria-hidden="true" />
          <span className={`${styles.crop} ${styles.cropBottomLeft}`} aria-hidden="true" />
          <span className={`${styles.crop} ${styles.cropBottomRight}`} aria-hidden="true" />

          <LivePreview css={previewCss} className={styles.mount}>
            <Preview config={config} />
          </LivePreview>
        </div>
      </div>

      <div className={styles.inks} aria-hidden="true">
        {INK_TOKENS.map(([key, token]) => (
          <span
            key={key}
            className={styles.ink}
            style={{ background: resolved[key] }}
            title={`${token}: ${resolved[key]}`}
          />
        ))}
      </div>
    </div>
  );
}
