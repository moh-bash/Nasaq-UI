import { useEffect, useMemo } from 'react';
import { buildOutput } from '../generators/index.js';
import { useComponentConfig } from '../hooks/useComponentConfig.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useTheme } from '../hooks/useTheme.js';
import { useStylingMode } from '../hooks/useStylingMode.js';
import PreviewWorkspace from './PreviewWorkspace.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import { useShellStore } from '../stores/shellStore.js';
import styles from './Studio.module.css';

/* The full studio for one component: live preview + code, inspector.
   Sidebar is provided by the shared shell. */
export default function Playground({ component }) {
  const { resolved } = useTheme();
  const { mode: stylingMode, setMode: setStylingMode } = useStylingMode();
  const closeMobileDrawer = useShellStore((state) => state.closeMobileDrawer);
  const inspectorPreference = useShellStore((state) => state.inspectorOpen);
  const setInspectorOpen = useShellStore((state) => state.setInspectorOpen);

  const {
    config,
    activePresetId,
    presetModified,
    presets,
    lastChange,
    updateConfig,
    updateSection,
    resetSection,
    resetAll,
    applyPresetById,
    restorePreset,
  } = useComponentConfig(component);

  const isNarrow = useMediaQuery('(max-width: 1080px)');
  const inspectorOpen = inspectorPreference ?? !isNarrow;
  const setPanelOpen = (open) => setInspectorOpen(open);

  useEffect(() => {
    if (!isNarrow) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setInspectorOpen(false);
        closeMobileDrawer();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeMobileDrawer, isNarrow, setInspectorOpen]);

  const previewCss = useMemo(() => {
    const output = component.generators.css(config, resolved);
    return output.files.find((file) => file.id === 'css')?.code || '';
  }, [component, config, resolved]);

  const output = useMemo(
    () => buildOutput(component, config, resolved, stylingMode),
    [component, config, resolved, stylingMode],
  );

  const drawerOpen = inspectorOpen && isNarrow;
  const closeDrawers = () => {
    setInspectorOpen(false);
    closeMobileDrawer();
  };

  return (
    <div
      className={styles.studio}
      data-inspector={inspectorOpen ? 'open' : 'closed'}
    >
      <main className={styles.main}>
        <PreviewWorkspace
          component={component}
          config={config}
          previewCss={previewCss}
          output={output}
          stylingMode={stylingMode}
          onStylingMode={setStylingMode}
          resolved={resolved}
          presets={presets}
          activePresetId={activePresetId}
          presetModified={presetModified}
          onSelectPreset={applyPresetById}
          onRestorePreset={restorePreset}
          onResetAll={resetAll}
          lastChange={lastChange}
          onToggleInspector={() => setPanelOpen(!inspectorOpen)}
        />
      </main>

      <div className={styles.inspectorSlot} inert={isNarrow && !inspectorOpen ? true : undefined}>
        <PropertiesPanel
          component={component}
          config={config}
          onChange={updateConfig}
          onItemsChange={(items) => updateSection('content', { items })}
          onResetSection={resetSection}
        />
      </div>

      {drawerOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close panels"
          onClick={closeDrawers}
        />
      ) : null}
    </div>
  );
}
