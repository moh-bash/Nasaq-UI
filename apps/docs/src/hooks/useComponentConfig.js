import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { presetModifiedWith } from '../config/presetUtils.js';

/* Per-component session state: the working config and the active preset, loaded
   defensively from localStorage and written back on change. The component
   descriptor supplies defaults, validation and presets, so this hook is shared
   by every registry entry. Mount one per component (key the host by id). */

function safeRead(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useComponentConfig(component) {
  const configKey = `cp.${component.id}.config.v2`;
  const presetKey = `cp.${component.id}.preset.v2`;

  const [config, setConfig] = useState(() => component.validate(safeRead(configKey)));
  const [activePresetId, setActivePresetId] = useState(() => {
    const stored = safeRead(presetKey);
    return typeof stored === 'string' && component.presetById[stored] ? stored : '';
  });
  const [lastChange, setLastChange] = useState(null);
  const changeSeq = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(configKey, JSON.stringify(config));
    } catch {
      /* storage blocked — the app still works in-memory */
    }
  }, [configKey, config]);

  useEffect(() => {
    try {
      window.localStorage.setItem(presetKey, JSON.stringify(activePresetId));
    } catch {
      /* ignore */
    }
  }, [presetKey, activePresetId]);

  const announce = useCallback((label, value) => {
    changeSeq.current += 1;
    setLastChange({ id: changeSeq.current, label, value });
  }, []);

  const updateConfig = useCallback(
    (path, value, label) => {
      setConfig((current) => {
        const keys = path.split('.');
        const next = { ...current };
        let cursor = next;
        for (let i = 0; i < keys.length - 1; i += 1) {
          cursor[keys[i]] = { ...cursor[keys[i]] };
          cursor = cursor[keys[i]];
        }
        cursor[keys[keys.length - 1]] = value;
        return component.validate(next);
      });
      if (label) announce(label, value);
    },
    [component, announce],
  );

  const updateSection = useCallback(
    (section, patch) => {
      setConfig((current) => component.validate({ ...current, [section]: { ...current[section], ...patch } }));
    },
    [component],
  );

  const resetSection = useCallback(
    (section) => {
      setConfig((current) => component.validate({ ...current, [section]: component.defaultConfig[section] }));
      announce(`${section} reset`, 'defaults');
    },
    [component, announce],
  );

  const resetAll = useCallback(() => {
    setConfig(component.validate(component.defaultConfig));
    setActivePresetId('');
    announce('Configuration', 'reset to defaults');
  }, [component, announce]);

  const applyPresetById = useCallback(
    (presetId) => {
      const preset = component.presetById[presetId];
      if (!preset) return;
      setConfig((current) => component.applyPreset(preset, current));
      setActivePresetId(presetId);
      announce('Preset', preset.name);
    },
    [component, announce],
  );

  const restorePreset = useCallback(() => {
    const preset = component.presetById[activePresetId];
    if (!preset) return;
    setConfig((current) => component.applyPreset(preset, current));
    announce('Preset', `${preset.name} restored`);
  }, [component, activePresetId, announce]);

  const activePreset = component.presetById[activePresetId] || null;
  const presetModified = useMemo(
    () => presetModifiedWith(component.defaultConfig, activePreset, config),
    [component, activePreset, config],
  );

  return {
    config,
    activePreset,
    activePresetId,
    presetModified,
    presets: component.presets,
    lastChange,
    updateConfig,
    updateSection,
    resetSection,
    resetAll,
    applyPresetById,
    restorePreset,
  };
}
