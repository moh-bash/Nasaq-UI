import { describe, expect, it } from 'vitest';
import { decodeShare, encodeShare } from '../utils/shareLink.js';

describe('share links', () => {
  it('round-trips configuration and theme payloads', () => {
    const payload = {
      id: 'button',
      config: { content: { label: 'Créer — projet' }, variant: 'primary', size: 'lg' },
      theme: { mode: 'dark', overrides: { primary: '#7d92ff' } },
    };
    const hash = `#nq=${encodeShare(payload)}`;
    const decoded = decodeShare(hash);
    expect(decoded.id).toBe('button');
    expect(decoded.config.content.label).toBe('Créer — projet');
    expect(decoded.theme.mode).toBe('dark');
    expect(decoded.v).toBe(1);
  });

  it('rejects malformed, truncated, and unsupported payloads', () => {
    expect(decodeShare('')).toBeNull();
    expect(decodeShare('#other=abc')).toBeNull();
    expect(decodeShare('#nq=not-a-real-payload')).toBeNull();
    expect(decodeShare(`#nq=${encodeShare({ theme: {} })}`)).toBeNull();
  });
});
