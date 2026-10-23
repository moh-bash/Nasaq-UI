import { useEffect, useMemo, useState } from 'react';
import { buildOutput } from '../generators/index.js';
import { useComponentConfig } from '../hooks/useComponentConfig.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useTheme } from '../providers/ThemeProvider.jsx';
import { useStylingMode } from '../providers/StylingModeProvider.jsx';
import PreviewWorkspace from './PreviewWorkspace.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import { useShell } from '../layouts/ShellContext.jsx';
import styles from './Studio.module.css';

/* The full studio for one component: live preview + code, inspector.
   Sidebar is provided by the shared shell. */
export default function Playground({ component }) {
  const { resolved } = useTheme();
  const { mode: stylingMode, setMode: setStylingMode } = useStylingMode();
  const shell = useShell();
  const onToggleSidebar = shell
    ? () => {
        if (shell.isNarrow) {
          if (shell.mobileOpen) {
            shell.closeMobileDrawer();
          } else {
            shell.openMobileDrawer();
          }
        } else {
          shell.toggleCollapsed();
        }
      }
    : () => {};

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
  const [prefs, setPrefs] = useState(null);
  const prefsApply = prefs !== null && prefs.narrow === isNarrow;
  const inspectorOpen = prefsApply ? prefs.inspector : !isNarrow;
  const setPanelPrefs = (patch) => setPrefs({ narrow: isNarrow, inspector: inspectorOpen, ...patch });

  useEffect(() => {
    if (!isNarrow) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPrefs({ narrow: true, inspector: false });
      }
      if (event.key === 'Escape' && shell?.closeMobileDrawer) {
        shell.closeMobileDrawer();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNarrow, shell]);

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
    setPrefs({ narrow: true, inspector: false });
    if (shell?.closeMobileDrawer) shell.closeMobileDrawer();
  };

  const sidebarOpenForWorkspace = shell ? (!shell.collapsed || (shell.isNarrow && shell.mobileOpen)) : true;

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
          sidebarOpen={sidebarOpenForWorkspace}
          onToggleSidebar={onToggleSidebar}
          onToggleInspector={() => setPanelPrefs({ inspector: !inspectorOpen })}
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
