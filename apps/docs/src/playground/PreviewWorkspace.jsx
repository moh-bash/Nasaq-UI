import { Link } from 'react-router-dom';
import {
  Check,
  Grid3x3,
  LayoutGrid,
  Moon,
  PanelRight,
  RotateCcw,
  Square,
  Sun,
} from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import PreviewCanvas from './PreviewCanvas.jsx';
import CodePanel from './CodePanel.jsx';
import PresetPicker from './PresetPicker.jsx';
import ViewportSwitcher from './ViewportSwitcher.jsx';
import ExportToolbar from './ExportToolbar.jsx';
import OverflowMenu from './OverflowMenu.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { usePlaygroundStore } from '../stores/playgroundStore.js';
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
  onShare,
  lastChange,
  onToggleInspector,
  inspectorOpen,
  shareNotice,
  onUndoShare,
  onDismissShare,
}) {
  const viewport = usePlaygroundStore((state) => state.viewport);
  const background = usePlaygroundStore((state) => state.background);
  const mobileView = usePlaygroundStore((state) => state.mobileView);
  const splitLayout = usePlaygroundStore((state) => state.splitLayout);
  const setViewport = usePlaygroundStore((state) => state.setViewport);
  const setBackground = usePlaygroundStore((state) => state.setBackground);
  const setMobileView = usePlaygroundStore((state) => state.setMobileView);
  const setSplitLayout = usePlaygroundStore((state) => state.setSplitLayout);

  const isCompact = useMediaQuery('(max-width: 900px)');

  const preview = (
    <PreviewCanvas
      component={component}
      config={config}
      previewCss={previewCss}
      viewport={viewport}
      background={background}
      resolved={resolved}
    />
  );

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
          <div className={styles.toolbarGroup}>
            <PresetPicker
              presets={presets}
              activeId={activePresetId}
              modified={presetModified}
              onSelect={onSelectPreset}
              onRestore={onRestorePreset}
            />
            <ViewportSwitcher value={viewport} onChange={setViewport} />
          </div>

          <span className={styles.spacer} />

          <div className={styles.toolbarGroup}>
            <ExportToolbar
              output={output}
              mode={stylingMode}
              onMode={onStylingMode}
              onShare={onShare}
            />

            <OverflowMenu label="Preview board options">
              <button
                type="button"
                role="menuitem"
                onClick={() => setBackground(background === 'grid' ? 'paper' : 'grid')}
              >
                {background === 'grid' ? <Check size={13} aria-hidden="true" /> : <Grid3x3 size={13} aria-hidden="true" />}
                Toggle grid board
              </button>
              {BACKGROUNDS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={background === option.id}
                    aria-pressed={background === option.id}
                    onClick={() => setBackground(option.id)}
                  >
                    <Icon size={13} aria-hidden="true" />
                    {option.label}
                    {background === option.id ? <Check size={13} aria-hidden="true" /> : null}
                  </button>
                );
              })}
              <button type="button" role="menuitem" onClick={onResetAll}>
                <RotateCcw size={13} aria-hidden="true" />
                Reset defaults
              </button>
            </OverflowMenu>

            <button
              type="button"
              className={styles.inspectorBtn}
              onClick={onToggleInspector}
              aria-expanded={Boolean(inspectorOpen)}
              aria-controls="properties-inspector"
              aria-label={inspectorOpen ? 'Hide properties inspector' : 'Show properties inspector'}
              title={inspectorOpen ? 'Hide properties inspector' : 'Show properties inspector'}
            >
              <PanelRight size={14} aria-hidden="true" />
              <span>Properties</span>
            </button>
          </div>
        </div>

        {shareNotice ? (
          <div className={styles.notice} role="status">
            <span>{shareNotice.message}</span>
            {shareNotice.canUndo ? (
              <button type="button" className={styles.noticeAction} onClick={onUndoShare}>
                Undo
              </button>
            ) : null}
            <button
              type="button"
              className={styles.noticeDismiss}
              onClick={onDismissShare}
              aria-label="Dismiss shared-link notice"
            >
              ×
            </button>
          </div>
        ) : null}
      </header>

      {isCompact ? (
        <div className={styles.compact}>
          <div className={styles.mobileTabs} role="tablist" aria-label="Studio view">
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === 'preview'}
              onClick={() => setMobileView('preview')}
            >
              Preview
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobileView === 'code'}
              onClick={() => setMobileView('code')}
            >
              Code
            </button>
          </div>
          <div className={styles.compactBody}>
            {mobileView === 'preview' ? preview : <CodePanel output={output} />}
          </div>
        </div>
      ) : (
        <Group
          orientation="vertical"
          className={styles.split}
          defaultLayout={splitLayout}
          onLayoutChanged={(layout) => setSplitLayout(layout)}
        >
          <Panel id="preview" minSize={20} className={styles.panel}>
            <ErrorBoundary label="The live preview failed to render.">{preview}</ErrorBoundary>
          </Panel>
          <Separator
            className={styles.separator}
            aria-label="Resize preview and code panels"
          />
          <Panel id="code" minSize={15} className={styles.panel}>
            <ErrorBoundary label="The generated code panel failed to render.">
              <CodePanel output={output} />
            </ErrorBoundary>
          </Panel>
        </Group>
      )}
    </section>
  );
}
