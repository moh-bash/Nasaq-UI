import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { getPath } from '../utils/validateConfig.js';
import { makeItemId } from '../utils/ids.js';
import { useTheme } from '../hooks/useTheme.js';
import { PropertyControl, Switch } from './PropertyControl.jsx';
import ThemeEditor from './ThemeEditor.jsx';
import controls from './controls.module.css';
import styles from './PropertiesPanel.module.css';

function fieldVisible(field, config) {
  if (field.dependsOn) return Boolean(getPath(config, field.dependsOn));
  if (field.dependsOnValue) {
    return field.dependsOnValue.values.includes(getPath(config, field.dependsOnValue.path));
  }
  return true;
}

function ItemsEditor({ items, onChange, itemType = 'accordion' }) {
  const isTabs = itemType === 'tabs';
  const update = (index, patch) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const move = (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () =>
    onChange([
      ...items,
      isTabs
        ? { id: makeItemId('tab'), label: 'New tab', content: 'Add tab content here.', disabled: false }
        : { id: makeItemId('item'), question: 'New question', answer: 'Write the answer here.', disabled: false },
    ]);

  return (
    <div className={styles.items}>
      {items.length === 0 ? (
        <p className={styles.emptyNote}>No items yet. The preview shows the empty state until you add one.</p>
      ) : null}

      {items.map((item, index) => (
        <div className={styles.itemCard} key={item.id}>
          <div className={styles.itemTop}>
            <span className={styles.itemIndex}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.itemSpacer} />
            <button
              type="button"
              className={styles.miniBtn}
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={`Move item ${index + 1} up`}
            >
              <ArrowUp size={13} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.miniBtn}
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              aria-label={`Move item ${index + 1} down`}
            >
              <ArrowDown size={13} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.miniBtn}
              onClick={() => remove(index)}
              aria-label={`Delete item ${index + 1}`}
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          </div>

          <input
            className={controls.textInput}
            name={`item-label-${item.id}`}
            value={isTabs ? item.label : item.question}
            aria-label={`${isTabs ? 'Label' : 'Question'} ${index + 1}`}
            onChange={(event) => update(index, isTabs ? { label: event.target.value } : { question: event.target.value })}
          />
          <textarea
            className={controls.textarea}
            name={`item-content-${item.id}`}
            rows={3}
            value={isTabs ? item.content : item.answer}
            aria-label={`${isTabs ? 'Content' : 'Answer'} ${index + 1}`}
            onChange={(event) => update(index, isTabs ? { content: event.target.value } : { answer: event.target.value })}
          />
          <div className={styles.smallField}>
            <Switch
              checked={item.disabled}
              onChange={(next) => update(index, { disabled: next })}
              hideState
              label={`Disable item ${index + 1}`}
            />
            <span className={styles.smallLabel}>Disabled</span>
          </div>
        </div>
      ))}

      <button type="button" className={styles.addBtn} onClick={add}>
        <Plus size={13} aria-hidden="true" />
        Add item
      </button>
    </div>
  );
}

function CollapsibleSection({ section, config, defaultOpen, onReset, controlProps, onItemsChange }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <button
          type="button"
          className={styles.sectionToggle}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronRight size={14} className={styles.chevron} data-open={open} aria-hidden="true" />
          <span className={styles.sectionTitle}>{section.label}</span>
        </button>
        <button
          type="button"
          className={styles.resetBtn}
          title={`Reset ${section.label.toLowerCase()} to defaults`}
          aria-label={`Reset ${section.label.toLowerCase()} to defaults`}
          onClick={onReset}
        >
          <RotateCcw size={12} aria-hidden="true" />
        </button>
      </div>

      {open ? (
        <div className={styles.sectionBody}>
          {section.fields.map((field) => {
            if (!fieldVisible(field, config)) return null;
            if (field.type === 'items') {
              return (
                  <div key={field.path} style={{ paddingTop: 6 }}>
                  <ItemsEditor
                    items={config.content?.items || []}
                    itemType={field.itemType}
                    onChange={onItemsChange}
                  />
                </div>
              );
            }
            return (
              <PropertyControl
                key={field.path}
                field={field}
                value={getPath(config, field.path)}
                resolvedTheme={controlProps.resolvedTheme}
                config={config}
                onChange={(value) => controlProps.onChange(field.path, value, field.label)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

const OPEN_BY_DEFAULT = new Set(['content', 'appearance', 'colors']);

export default function PropertiesPanel({ component, config, onChange, onItemsChange, onResetSection }) {
  const [tab, setTab] = useState('component');
  const { theme, resolved, setMode, setToken, resetToken, resetTheme } = useTheme();

  const controlProps = { onChange, resolvedTheme: resolved };

  return (
    <aside className={styles.panel} aria-label="Properties inspector">
      <div className={styles.head}>
        <div className={styles.tabs} role="tablist" aria-label="Inspector mode">
          <button
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={tab === 'component'}
            id="inspector-tab-component"
            aria-controls="inspector-panel"
            onClick={() => setTab('component')}
          >
            Component
          </button>
          <button
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={tab === 'theme'}
            id="inspector-tab-theme"
            aria-controls="inspector-panel"
            onClick={() => setTab('theme')}
          >
            Theme
          </button>
        </div>
      </div>

      <div className={styles.body} id="inspector-panel" role="tabpanel" aria-labelledby={`inspector-tab-${tab}`}>
        {tab === 'component' ? (
          component.sections.map((section) => (
            <CollapsibleSection
              key={section.id}
              section={section}
              config={config}
              defaultOpen={OPEN_BY_DEFAULT.has(section.id)}
              onReset={() => onResetSection(section.id)}
              controlProps={controlProps}
              onItemsChange={onItemsChange}
            />
          ))
        ) : (
          <ThemeEditor
            theme={theme}
            resolvedTheme={resolved}
            onMode={setMode}
            onToken={setToken}
            onResetToken={resetToken}
            onResetTheme={resetTheme}
          />
        )}
      </div>
    </aside>
  );
}
