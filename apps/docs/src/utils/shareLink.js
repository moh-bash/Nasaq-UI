import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

/*
  Share links carry the whole playground state in the URL hash:

    #nq=<lz-string payload>

  The payload is never trusted: Playground runs config/theme through the same
  validators as a local edit before applying it.
*/

const HASH_PREFIX = '#nq=';
const VERSION = 1;

export function encodeShare(payload) {
  return compressToEncodedURIComponent(JSON.stringify({ v: VERSION, ...payload }));
}

export function decodeShare(hash) {
  if (typeof hash !== 'string' || !hash.startsWith(HASH_PREFIX)) return null;
  try {
    const raw = decompressFromEncodedURIComponent(hash.slice(HASH_PREFIX.length));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== VERSION || !parsed.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readShareFromLocation() {
  if (typeof window === 'undefined') return null;
  return decodeShare(window.location.hash);
}

export function buildShareUrl(payload) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.hash = `${HASH_PREFIX.slice(1)}${encodeShare(payload)}`;
  return url.toString();
}

export function writeShareHash(payload) {
  if (typeof window === 'undefined') return;
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${HASH_PREFIX}${encodeShare(payload)}`);
}

export function clearShareHash() {
  if (typeof window === 'undefined' || !window.location.hash.startsWith(HASH_PREFIX)) return;
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}
