import { useMemo } from 'react';
import ComponentPreview from '../ui/ComponentPreview.jsx';
import { setPath } from '../../utils/validateConfig.js';
import styles from './VariantGallery.module.css';

const VARIANT_PATHS = ['variant', 'size', 'tone', 'style'];

function optionLabel(option) {
  return typeof option === 'string' ? option : option.label;
}

function optionValue(option) {
  return typeof option === 'string' ? option : option.value;
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/*
  Builds every variant x size combination from the same schema the inspector
  uses, so the gallery cannot drift from the controls.
*/
function buildEntries(component) {
  const fields = component.sections
    .flatMap((section) => section.fields)
    .filter(
      (field) =>
        field.type === 'select' &&
        !field.path.includes('.') &&
        VARIANT_PATHS.includes(field.path) &&
        Array.isArray(field.options) &&
        field.options.length > 1 &&
        field.options.length <= 6,
    );

  if (!fields.length) return { fields, entries: [] };

  let combos = [{}];
  for (const field of fields) {
    const next = [];
    for (const combo of combos) {
      for (const option of field.options) {
        next.push({ ...combo, [field.path]: optionValue(option) });
      }
    }
    combos = next;
  }

  return {
    fields,
    entries: combos.slice(0, 18).map((combo) => {
      let config = structuredClone(component.defaultConfig);
      for (const [path, value] of Object.entries(combo)) config = setPath(config, path, value);
      const label = fields
        .map((field) => {
          const match = field.options.find((option) => optionValue(option) === combo[field.path]);
          return match ? optionLabel(match) : String(combo[field.path]);
        })
        .join(' · ');
      return { id: Object.values(combo).map(slug).join('-'), label, config: component.validate(config) };
    }),
  };
}

export default function VariantGallery({ component }) {
  const { fields, entries } = useMemo(() => buildEntries(component), [component]);
  if (!entries.length) return null;

  return (
    <div className={styles.gallery}>
      <p className={styles.caption}>
        {fields.map((field) => field.label).join(' × ')} — every combination rendered with the default
        config.
      </p>
      <ul className={styles.grid} role="list">
        {entries.map((entry) => (
          <li key={entry.id} className={styles.card}>
            <div className={styles.stage}>
              <ComponentPreview component={component} config={entry.config} className={styles.mount} />
            </div>
            <span className={styles.label}>{entry.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
