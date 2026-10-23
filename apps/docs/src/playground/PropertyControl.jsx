import { useEffect, useId, useRef, useState } from 'react';
import { Link2, Unlink } from 'lucide-react';
import { contrastGrade, contrastRatio, readableOn } from '../utils/contrast.js';
import styles from './controls.module.css';

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function formatNumber(value, step) {
  if (Number.isInteger(value)) return String(value);
  const decimals = step && step < 0.1 ? 3 : step && step < 1 ? 2 : 1;
  return String(Number(value.toFixed(decimals)));
}

export function Switch({ checked, onChange, label, hideState = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={styles.switch}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.switchTrack}>
        <span className={styles.switchThumb} />
      </span>
      {hideState ? null : <span className={styles.switchState}>{checked ? 'On' : 'Off'}</span>}
    </button>
  );
}

function ColorField({ field, value, onChange, resolvedTheme }) {
  const inherited = value === null;
  const resolved = inherited ? resolvedTheme[field.token] || '#000000' : value;
  const [draft, setDraft] = useState(resolved);
  const focused = useRef(false);
  const referenceToken =
    field.contrastWith || (/surface|paper|background/.test(field.token) ? 'text' : 'surface');
  const reference = resolvedTheme[referenceToken] || '#ffffff';
  const ratio = contrastRatio(resolved, reference);
  const grade = contrastGrade(ratio);

  useEffect(() => {
    if (!focused.current) setDraft(resolved);
  }, [resolved]);

  const commitHex = (next) => {
    setDraft(next);
    if (HEX_RE.test(next.trim())) onChange(next.trim().toLowerCase());
  };

  return (
    <div className={styles.colorRow}>
      <span className={styles.swatchWrap} style={{ backgroundColor: resolved }}>
        <input
          type="color"
          className={styles.swatchInput}
          name={field.path}
          value={resolved}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange(event.target.value.toLowerCase());
          }}
          aria-label={`${field.label} color picker`}
        />
      </span>
      <input
        className={styles.hexInput}
        name={field.path}
        value={draft}
        aria-invalid={!HEX_RE.test(draft.trim())}
        spellCheck={false}
        aria-label={`${field.label} hexadecimal value`}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(event) => commitHex(event.target.value)}
        onBlur={() => {
          focused.current = false;
          setDraft(resolved);
        }}
      />
      <span
        className={styles.contrastChip}
        data-grade={grade === 'Fail' ? 'fail' : 'pass'}
        style={{ backgroundColor: resolved, color: readableOn(resolved) }}
        title={`Contrast against ${referenceToken}: ${ratio ? ratio.toFixed(1) : '—'}:1 (${grade || 'unknown'})`}
      >
        {ratio ? `${ratio.toFixed(1)}:1` : '—'}
        {grade ? <span className={styles.contrastGrade}>{grade}</span> : null}
      </span>
      <button
        type="button"
        className={styles.tokenBtn}
        data-inherited={inherited}
        aria-pressed={inherited}
        title={
          inherited
            ? `Inherited from --color-${field.token}. Click to set an override.`
            : `Overrides --color-${field.token}. Click to inherit again.`
        }
        onClick={() => onChange(inherited ? resolved : null)}
      >
        {inherited ? <Link2 size={11} aria-hidden="true" /> : <Unlink size={11} aria-hidden="true" />}
        {inherited ? field.token : 'theme'}
      </button>
    </div>
  );
}

function RangeField({ field, value, onChange }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <div className={styles.fieldTop}>
        <label className={styles.label} htmlFor={id}>
          {field.label}
        </label>
        <span className={styles.value}>
          {formatNumber(value, field.step)}
          {field.unit ? ` ${field.unit}` : ''}
        </span>
      </div>
      <div className={styles.rangeRow}>
        <input
          id={id}
          type="range"
          className={styles.range}
          name={field.path}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          type="number"
          className={styles.numberInput}
          name={`${field.path}-exact`}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={value}
          aria-label={`${field.label}, exact value`}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onChange(next);
          }}
        />
        {field.unit ? <span className={styles.unit}>{field.unit}</span> : null}
      </div>
      {field.help ? <p className={styles.help}>{field.help}</p> : null}
    </div>
  );
}

export function PropertyControl({ field, value, onChange, resolvedTheme, config }) {
  const id = useId();
  const change = (next) => onChange(next);

  if (field.type === 'toggle') {
    return (
      <div className={styles.field}>
        <div className={styles.fieldTop}>
          <span className={styles.label}>{field.label}</span>
          <Switch checked={Boolean(value)} onChange={change} label={field.label} />
        </div>
        {field.help ? <p className={styles.help}>{field.help}</p> : null}
      </div>
    );
  }

  if (field.type === 'range') {
    return <RangeField field={field} value={value} onChange={change} />;
  }

  if (field.type === 'color') {
    return (
      <div className={styles.field}>
        <div className={styles.fieldTop}>
          <span className={styles.label}>{field.label}</span>
        </div>
        <ColorField field={field} value={value} onChange={change} resolvedTheme={resolvedTheme} />
      </div>
    );
  }

  if (field.type === 'select') {
    const options =
      field.dynamicOptions === 'items'
        ? [
            { value: '', label: 'None' },
            ...(config?.content?.items || []).map((item) => ({
              value: item.id,
              label: item.question.length > 34 ? `${item.question.slice(0, 34)}…` : item.question,
            })),
          ]
        : field.options;

    return (
      <div className={styles.field}>
        <div className={styles.fieldTop}>
          <label className={styles.label} htmlFor={id}>
            {field.label}
          </label>
        </div>
        <select
          id={id}
          className={styles.select}
          name={field.path}
          value={value}
          onChange={(event) => {
            const raw = event.target.value;
            const match = field.options?.find((option) => String(option.value) === raw);
            change(match && typeof match.value === 'number' ? match.value : raw);
          }}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
        {field.help ? <p className={styles.help}>{field.help}</p> : null}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className={styles.field}>
        <div className={styles.fieldTop}>
          <label className={styles.label} htmlFor={id}>
            {field.label}
          </label>
        </div>
        <textarea
          id={id}
          className={styles.textarea}
          name={field.path}
          rows={field.rows || 3}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => change(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <div className={styles.fieldTop}>
        <label className={styles.label} htmlFor={id}>
          {field.label}
        </label>
      </div>
      <input
        id={id}
        className={styles.textInput}
        name={field.path}
        value={value}
        placeholder={field.placeholder}
        spellCheck={false}
        onChange={(event) => change(event.target.value)}
      />
      {field.help ? <p className={styles.help}>{field.help}</p> : null}
    </div>
  );
}
