let counter = 0;

/** Stable, human-readable ids for Q&A items. */
export function makeItemId(seed = 'q') {
  counter += 1;
  const slug = String(seed)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24);
  return `${slug || 'item'}-${Date.now().toString(36).slice(-4)}${counter}`;
}
