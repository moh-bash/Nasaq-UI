import { useCallback, useMemo } from 'react';
import { useComponentConfigStore } from '../stores/componentConfigStore.js';
import { presetModifiedWith } from '../config/presetUtils.js';

/*
  Bind one registry component to its slice of the config store. The component
  descriptor supplies defaults, validation and presets, so adding a component
  never changes this hook.
*/
export function useComponentConfig(component) {
  const stored = useComponentConfigStore((state) => state.configs[component.id]);
  const activePresetId = useComponentConfigStore(
    (state) => state.activePresetId[component.id] || '',
  );
  const lastChange = useComponentConfigStore((state) => state.lastChange);

  const update = useComponentConfigStore((state) => state.updateConfig);
  const updateWholeSection = useComponentConfigStore((state) => state.updateSection);
  const resetOneSection = useComponentConfigStore((state) => state.resetSection);
  const resetEverything = useComponentConfigStore((state) => state.resetAll);
  const applyPreset = useComponentConfigStore((state) => state.applyPresetById);
  const restore = useComponentConfigStore((state) => state.restorePreset);

  const config = useMemo(
    () => component.validate(stored ?? component.defaultConfig),
    [component, stored],
  );

  const activePreset = component.presetById[activePresetId] || null;

  const presetModified = useMemo(
    () => presetModifiedWith(component.defaultConfig, activePreset, config),
    [component, activePreset, config],
  );

  const updateConfig = useCallback(
    (path, value, label) => update(component, path, value, label),
    [component, update],
  );

  const updateSection = useCallback(
    (section, patch) => updateWholeSection(component, section, patch),
    [component, updateWholeSection],
  );

  const resetSection = useCallback(
    (section) => resetOneSection(component, section),
    [component, resetOneSection],
  );

  const resetAll = useCallback(() => resetEverything(component), [component, resetEverything]);

  const applyPresetById = useCallback(
    (presetId) => applyPreset(component, presetId),
    [applyPreset, component],
  );

  const restorePreset = useCallback(() => restore(component), [component, restore]);

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
