import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { setPath } from '../utils/validateConfig.js';
import { safeStorage } from './safeStorage.js';

/*
  One config per component id. The store is intentionally component-agnostic:
  callers pass the registry descriptor, which supplies defaults, validation and
  presets. That keeps this module free of registry imports (and cycles).

  Old URL-less state lived at `cp.<id>.config.v2` / `cp.<id>.preset.v2`; those
  keys are imported once and left in place.
*/

const KEY = 'nq.configs.v1';
const CONFIG_RE = /^cp\.(.+)\.config\.v2$/;
const PRESET_RE = /^cp\.(.+)\.preset\.v2$/;

function readLegacyConfigs() {
  const configs = {};
  const activePresetId = {};
  for (const key of safeStorage.keys()) {
    const configMatch = CONFIG_RE.exec(key);
    if (configMatch) {
      try {
        const parsed = JSON.parse(safeStorage.getItem(key));
        if (parsed && typeof parsed === 'object') configs[configMatch[1]] = parsed;
      } catch {
        /* ignore corrupt component config */
      }
      continue;
    }
    const presetMatch = PRESET_RE.exec(key);
    if (presetMatch) {
      try {
        const parsed = JSON.parse(safeStorage.getItem(key));
        if (typeof parsed === 'string' && parsed) activePresetId[presetMatch[1]] = parsed;
      } catch {
        /* ignore corrupt preset id */
      }
    }
  }
  return { configs, activePresetId };
}

const legacy = readLegacyConfigs();

export const initialConfigData = {
  configs: {},
  activePresetId: {},
  lastChange: null,
};

let changeSeq = 0;
const announce = (label, value) => {
  changeSeq += 1;
  return { id: changeSeq, label, value };
};

function configFor(state, component) {
  return component.validate(state.configs[component.id] ?? component.defaultConfig);
}

export const useComponentConfigStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialConfigData,
        ...legacy,

        getConfig(component) {
          return configFor(get(), component);
        },

        updateConfig(component, path, value, label) {
          const next = component.validate(setPath(configFor(get(), component), path, value));
          set(
            (state) => ({
              configs: { ...state.configs, [component.id]: next },
              lastChange: label ? announce(label, value) : state.lastChange,
            }),
            false,
            'config/update',
          );
        },

        updateSection(component, section, patch) {
          const current = configFor(get(), component);
          const next = component.validate({
            ...current,
            [section]: { ...current[section], ...patch },
          });
          set(
            (state) => ({ configs: { ...state.configs, [component.id]: next } }),
            false,
            'config/updateSection',
          );
        },

        resetSection(component, section) {
          const current = configFor(get(), component);
          const next = component.validate({
            ...current,
            [section]: component.defaultConfig[section],
          });
          set(
            (state) => ({
              configs: { ...state.configs, [component.id]: next },
              lastChange: announce(`${section} reset`, 'defaults'),
            }),
            false,
            'config/resetSection',
          );
        },

        resetAll(component) {
          set(
            (state) => ({
              configs: {
                ...state.configs,
                [component.id]: component.validate(component.defaultConfig),
              },
              activePresetId: { ...state.activePresetId, [component.id]: '' },
              lastChange: announce('Configuration', 'reset to defaults'),
            }),
            false,
            'config/resetAll',
          );
        },

        applyPresetById(component, presetId) {
          const preset = component.presetById[presetId];
          if (!preset) return;
          const next = component.applyPreset(preset, configFor(get(), component));
          set(
            (state) => ({
              configs: { ...state.configs, [component.id]: next },
              activePresetId: { ...state.activePresetId, [component.id]: presetId },
              lastChange: announce('Preset', preset.name),
            }),
            false,
            'config/applyPreset',
          );
        },

        restorePreset(component) {
          const presetId = get().activePresetId[component.id];
          const preset = component.presetById[presetId];
          if (!preset) return;
          const next = component.applyPreset(preset, configFor(get(), component));
          set(
            (state) => ({
              configs: { ...state.configs, [component.id]: next },
              lastChange: announce('Preset', `${preset.name} restored`),
            }),
            false,
            'config/restorePreset',
          );
        },
      }),
      {
        name: KEY,
        version: 1,
        storage: createJSONStorage(() => safeStorage),
        partialize: (state) => ({
          configs: state.configs,
          activePresetId: state.activePresetId,
        }),
        migrate: (persisted) => {
          if (!persisted || typeof persisted !== 'object') return readLegacyConfigs();
          return {
            configs:
              persisted.configs && typeof persisted.configs === 'object'
                ? persisted.configs
                : {},
            activePresetId:
              persisted.activePresetId && typeof persisted.activePresetId === 'object'
                ? persisted.activePresetId
                : {},
          };
        },
        onRehydrateStorage: () => (_state, error) => {
          if (error) return;
        },
      },
    ),
    { name: 'nq.configs', enabled: import.meta.env.DEV },
  ),
);

export function resetComponentConfigStore() {
  changeSeq = 0;
  useComponentConfigStore.setState(initialConfigData);
}
