import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  THEME_TOKENS,
  THEME_VERSION,
  themeDefaults,
  defaultTheme,
  resolveTheme,
  tokenVar,
  Button,
  Accordion,
  Tabs,
} from '../src/index.js';

describe('public entry', () => {
  it('exports the three components', () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole('button', { name: 'Ok' })).toBeInTheDocument();
    render(<Accordion items={[{ id: 'a', question: 'Q?', answer: 'A.' }]} />);
    expect(screen.getByText('Q?')).toBeInTheDocument();
    render(<Tabs items={[{ id: 'a', label: 'One', content: 'First' }]} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First');
  });

  it('exports the theme model', () => {
    expect(typeof themeDefaults.light.primary).toBe('string');
    expect(defaultTheme()).toEqual({ version: THEME_VERSION, mode: 'light', overrides: {} });
    expect(resolveTheme(defaultTheme()).background).toBe(themeDefaults.light.background);
    expect(tokenVar('primary')).toBe('--color-primary');
    expect(THEME_TOKENS.some(({ key }) => key === 'danger')).toBe(true);
  });
});