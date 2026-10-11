import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildOutput } from '../generators/index.js';
import { useComponentConfig } from '../hooks/useComponentConfig.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useTheme } from '../providers/ThemeProvider.jsx';
import { useStylingMode } from '../providers/StylingModeProvider.jsx';
import ComponentSidebar from './ComponentSidebar.jsx';
import PreviewWorkspace from './PreviewWorkspace.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import styles from './Studio.module.css';

/* The full studio for one component: explorer, live preview + code, inspector.
   All state is sourced from providers and the component descriptor, so mounting
   a different registry entry is the only change needed for a new component. */
export default function Playground({ component }) {
  const navigate = useNavigate();
  const { resolved } = useTheme();
  const { mode: stylingMode, setMode: setStylingMode } = useStylingMode();

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
  /* Panel preferences are remembered per layout width, so returning to a wide
     layout restores the defaults without needing an effect. */
  const [prefs, setPrefs] = useState(null);
  const prefsApply = prefs !== null && prefs.narrow === isNarrow;
  const sidebarOpen = prefsApply ? prefs.sidebar : !isNarrow;
  const inspectorOpen = prefsApply ? prefs.inspector : !isNarrow;
  const setPanelPrefs = (patch) => setPrefs({ narrow: isNarrow, sidebar: sidebarOpen, inspector: inspectorOpen, ...patch });

  useEffect(() => {
    if (!isNarrow) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPrefs({ narrow: true, sidebar: false, inspector: false });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNarrow]);

  /* The preview always renders the semantic-CSS component, so a configuration
     change is reflected instantly regardless of the export mode. */
  const previewCss = useMemo(() => {
    const output = component.generators.css(config, resolved);
    return output.files.find((file) => file.id === 'css')?.code || '';
  }, [component, config, resolved]);

  const output = useMemo(
    () => buildOutput(component, config, resolved, stylingMode),
    [component, config, resolved, stylingMode],
  );

  const drawerOpen = (sidebarOpen || inspectorOpen) && isNarrow;
  const closeDrawers = () => setPrefs({ narrow: true, sidebar: false, inspector: false });

  return (
    <div
      className={styles.studio}
      data-sidebar={sidebarOpen ? 'open' : 'closed'}
      data-inspector={inspectorOpen ? 'open' : 'closed'}
    >
      <div className={styles.sidebarSlot} inert={isNarrow && !sidebarOpen ? true : undefined}>
        <ComponentSidebar
          activeComponentId={component.id}
          onSelect={(id) => {
            navigate(`/playground/${id}`);
            if (isNarrow) setPanelPrefs({ sidebar: false });
          }}
          onCollapse={() => setPanelPrefs({ sidebar: false })}
        />
      </div>

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
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setPanelPrefs({ sidebar: !sidebarOpen })}
          onToggleInspector={() => setPanelPrefs({ inspector: !inspectorOpen })}
          onOpenDocs={() => navigate(`/components/${component.id}`)}
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
