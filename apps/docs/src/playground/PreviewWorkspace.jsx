import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid3x3,
  LayoutGrid,
  Moon,
  PanelRight,
  RotateCcw,
  Square,
  Sun,
} from 'lucide-react';
import PreviewCanvas from './PreviewCanvas.jsx';
import CodePanel from './CodePanel.jsx';
import PresetPicker from './PresetPicker.jsx';
import ViewportSwitcher from './ViewportSwitcher.jsx';
import ExportToolbar from './ExportToolbar.jsx';
import controls from './controls.module.css';
import { paths } from '../routes.js';
import styles from './PreviewWorkspace.module.css';

const BACKGROUNDS = [
  { id: 'paper', label: 'Paper', icon: Square },
  { id: 'white', label: 'White', icon: Sun },
  { id: 'ink', label: 'Ink', icon: Moon },
  { id: 'grid', label: 'Grid', icon: Grid3x3 },
  { id: 'checker', label: 'Transparent', icon: LayoutGrid },
];

function formatValue(value) {
  if (value === null) return 'theme default';
  if (typeof value === 'boolean') return value ? 'on' : 'off';
  return String(value);
}

export default function PreviewWorkspace({
  component,
  config,
  previewCss,
  output,
  stylingMode,
  onStylingMode,
  resolved,
  presets,
  activePresetId,
  presetModified,
  onSelectPreset,
  onRestorePreset,
  onResetAll,
  lastChange,
  onToggleInspector,
}) {
  const [viewport, setViewport] = useState('desktop');
  const [background, setBackground] = useState('grid');

  return (
    <section className={styles.workspace} aria-label="Live preview workspace">
      <header className={styles.head}>
        <div className={styles.headTop}>
          <div className={styles.identity}>
            <h1 className={styles.name}>{component.name}</h1>
            <p className={styles.description}>{component.description}</p>
          </div>

          <Link to={paths.componentDocs(component.id)} className={styles.viewDocs}>
            View docs
          </Link>

          {lastChange ? (
            <div key={lastChange.id} className={styles.status} role="status" aria-live="polite">
              {lastChange.label}: {formatValue(lastChange.value)}
            </div>
          ) : (
            <div className={styles.status} style={{ visibility: 'hidden' }} role="status" aria-live="polite">
              ready
            </div>
          )}
        </div>

        <div className={styles.toolbar}>
          <PresetPicker
            presets={presets}
            activeId={activePresetId}
            modified={presetModified}
            onSelect={onSelectPreset}
            onRestore={onRestorePreset}
          />

          <span className={styles.groupLabel}>Board</span>
          <div className={styles.bgGroup} role="group" aria-label="Preview background">
            {BACKGROUNDS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={styles.bgBtn}
                  aria-pressed={background === option.id}
                  title={option.label}
                  onClick={() => setBackground(option.id)}
                >
                  <Icon size={13} aria-hidden="true" />
                  <span className="visually-hidden">{option.label}</span>
                </button>
              );
            })}
          </div>

          <ViewportSwitcher value={viewport} onChange={setViewport} />

          <span className={styles.spacer} />

          <ExportToolbar output={output} mode={stylingMode} onMode={onStylingMode} />

          <button type="button" className={controls.btn} onClick={onResetAll}>
            <RotateCcw size={13} aria-hidden="true" />
            Reset defaults
          </button>
          <button
            type="button"
            className={controls.iconBtn}
            onClick={onToggleInspector}
            aria-label="Toggle properties inspector"
          >
            <PanelRight size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <PreviewCanvas
        component={component}
        config={config}
        previewCss={previewCss}
        viewport={viewport}
        background={background}
        resolved={resolved}
      />

      <CodePanel output={output} />
    </section>
  );
}
