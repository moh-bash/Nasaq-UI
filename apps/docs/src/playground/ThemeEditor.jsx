import { useEffect, useRef, useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { THEME_TOKENS } from 'nasaq';
import { generateThemeCSS, generateTailwindThemeCSS } from '../generators/index.js';
import { useStylingMode } from '../hooks/useStylingMode.js';
import { useClipboard } from '../hooks/useClipboard.js';
import controls from './controls.module.css';
import styles from './ThemeEditor.module.css';

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function TokenRow({ token, value, edited, onChange, onReset }) {
  const [draft, setDraft] = useState(value);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(value);
  }, [value]);

  const commit = (next) => {
    setDraft(next);
    if (HEX_RE.test(next.trim())) onChange(next.trim().toLowerCase());
  };

  return (
    <div className={styles.row}>
      <span className={styles.rowLabel} title={`--color-${token.key}`}>
        {token.label}
      </span>
      <span className={styles.swatchWrap} style={{ backgroundColor: value }}>
        <input
          type="color"
          className={styles.swatchInput}
          name={`theme-color-${token.key}`}
          value={value}
          aria-label={`${token.label} color picker`}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
        />
      </span>
      <input
        className={styles.hex}
        name={`theme-hex-${token.key}`}
        value={draft}
        spellCheck={false}
        aria-invalid={!HEX_RE.test(draft.trim())}
        aria-label={`${token.label} hexadecimal value`}
        onFocus={() => {
          focused.current = true;
        }}
        onChange={(event) => commit(event.target.value)}
        onBlur={() => {
          focused.current = false;
          setDraft(value);
        }}
      />
      <button
        type="button"
        className={styles.reset}
        onClick={onReset}
        disabled={!edited}
        title={edited ? `Reset ${token.label.toLowerCase()} to the default` : 'Using the default value'}
        aria-label={`Reset ${token.label.toLowerCase()} to the default`}
      >
        <RotateCcw size={12} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ThemeEditor({ theme, resolvedTheme, onMode, onToken, onResetToken, onResetTheme }) {
  const { copy, status } = useClipboard();
  const { mode: stylingMode } = useStylingMode();
  const editedCount = Object.keys(theme.overrides || {}).length;
  const themeCode =
    stylingMode === 'tailwind' ? generateTailwindThemeCSS(resolvedTheme) : generateThemeCSS(resolvedTheme);

  return (
    <div>
      <div className={styles.mode}>
        <span className={styles.modeLabel}>Mode</span>
        <div className={controls.segmented} role="group" aria-label="Theme mode">
          {['light', 'dark', 'system'].map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={theme.mode === mode}
              onClick={() => onMode(mode)}
            >
              {mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System'}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.intro}>
        Library-wide colours. Every component inherits these until you set an override on the
        Component tab.
      </p>

      <div className={styles.rows}>
        {THEME_TOKENS.map((token) => (
          <TokenRow
            key={token.key}
            token={token}
            value={resolvedTheme[token.key]}
            edited={Boolean(theme.overrides && theme.overrides[token.key])}
            onChange={(value) => onToken(token.key, value)}
            onReset={() => onResetToken(token.key)}
          />
        ))}
      </div>

      <p className={styles.reuseNote}>
        {editedCount === 0
          ? 'All tokens are at their default values.'
          : `${editedCount} token${editedCount === 1 ? '' : 's'} changed from the default.`}
      </p>

      <div className={styles.actions}>
        <button type="button" className={controls.btn} onClick={onResetTheme}>
          Reset theme
        </button>
        <button type="button" className={controls.btn} onClick={() => copy(themeCode)}>
          {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {status === 'copied' ? 'Copied' : 'Copy theme CSS'}
        </button>
      </div>
    </div>
  );
}
