import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { buildOutput } from '../generators/index.js';
import { useComponentConfig } from '../hooks/useComponentConfig.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useTheme } from '../hooks/useTheme.js';
import { useStylingMode } from '../hooks/useStylingMode.js';
import { useClipboard } from '../hooks/useClipboard.js';
import PreviewWorkspace from './PreviewWorkspace.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import { useShellStore } from '../stores/shellStore.js';
import { useComponentConfigStore } from '../stores/componentConfigStore.js';
import { buildShareUrl, clearShareHash, readShareFromLocation, writeShareHash } from '../utils/shareLink.js';
import styles from './Studio.module.css';

/* The full studio for one component: live preview + code, inspector.
   Sidebar is provided by the shared shell. */
export default function Playground({ component }) {
  const { resolved, mode, overrides, replaceTheme } = useTheme();
  const { mode: stylingMode, setMode: setStylingMode } = useStylingMode();
  const closeMobileDrawer = useShellStore((state) => state.closeMobileDrawer);
  const inspectorPreference = useShellStore((state) => state.inspectorOpen);
  const setInspectorOpen = useShellStore((state) => state.setInspectorOpen);
  const setWholeConfig = useComponentConfigStore((state) => state.setConfig);
  const { copy } = useClipboard();

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

  const [sharePayload] = useState(() => readShareFromLocation());
  const [shareNotice, setShareNotice] = useState(() => {
    if (!sharePayload) return null;
    if (sharePayload.id !== component.id) {
      return {
        message: `This link was saved for ${sharePayload.id}, not ${component.name}.`,
        canUndo: false,
      };
    }
    try {
      if (sharePayload.config) component.validate(sharePayload.config);
      return { message: 'Loaded from a shared link.', canUndo: true };
    } catch {
      return { message: 'That share link could not be applied.', canUndo: false };
    }
  });
  const previousShareRef = useRef(null);
  const shareApplied = useRef(false);

  useEffect(() => {
    if (shareApplied.current || !sharePayload || sharePayload.id !== component.id) return;
    shareApplied.current = true;

    try {
      if (sharePayload.config) {
        setWholeConfig(component, sharePayload.config, 'Shared configuration');
      }
      if (sharePayload.theme) {
        replaceTheme({ mode: sharePayload.theme.mode, overrides: sharePayload.theme.overrides });
      }
      previousShareRef.current = { config, theme: { mode, overrides } };
    } catch {
      clearShareHash();
    }
  }, [component, config, mode, overrides, replaceTheme, setWholeConfig, sharePayload]);

  const handleShare = async () => {
    const payload = { id: component.id, config, theme: { mode, overrides } };
    const url = buildShareUrl(payload);
    writeShareHash(payload);
    const ok = await copy(url);
    if (ok) toast.success('Share link copied — it restores this exact setup');
    else toast.error('Could not copy the share link');
    setShareNotice({
      message: ok ? 'Share link copied. The address bar now points at this setup.' : 'Share link created.',
      canUndo: false,
    });
  };

  const handleUndoShare = () => {
    const previous = previousShareRef.current;
    if (previous) {
      setWholeConfig(component, previous.config, 'Restored configuration');
      replaceTheme(previous.theme);
    }
    clearShareHash();
    setShareNotice(null);
    toast.success('Restored your previous configuration');
  };

  const handleDismissShare = () => setShareNotice(null);

  const handleResetAll = () => {
    resetAll();
    clearShareHash();
    setShareNotice(null);
    toast.success('Reset this component to its defaults');
  };

  const handlePreset = (presetId) => {
    applyPresetById(presetId);
    const preset = presets.find((entry) => entry.id === presetId);
    toast.success(`Applied ${preset?.label || 'preset'} preset`);
  };

  const handleResetSection = (sectionId) => {
    resetSection(sectionId);
    toast.success('Reset section to its defaults');
  };

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
      <div className={styles.main}>
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
          onSelectPreset={handlePreset}
          onRestorePreset={restorePreset}
          onResetAll={handleResetAll}
          onShare={handleShare}
          lastChange={lastChange}
          onToggleInspector={() => setPanelOpen(!inspectorOpen)}
          inspectorOpen={inspectorOpen}
          shareNotice={shareNotice}
          onUndoShare={handleUndoShare}
          onDismissShare={handleDismissShare}
        />
      </div>

      <div className={styles.inspectorSlot} inert={isNarrow && !inspectorOpen ? true : undefined}>
        <PropertiesPanel
          component={component}
          config={config}
          onChange={updateConfig}
          onItemsChange={(items) => updateSection('content', { items })}
          onResetSection={handleResetSection}
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
