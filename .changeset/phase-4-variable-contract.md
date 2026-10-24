---
"nasaq": minor
---

Ship the component-variable contract and TypeScript source types.

- Every component rule now reads documented `--nq-*` variables with token
  fallbacks. Generated CSS exports a short variable-override block that imports
  `nasaq/styles.css` for structure; the Tailwind exports use the same mapping.
- Add `on-primary`, `on-secondary` and `on-danger` AA-contrast tokens. Theme
  state moves to version 3: replace the temporary `on-solid` key with the three
  role-specific tokens.
- Convert the library to TypeScript and generate `.d.ts` / `.d.cts` from
  source. The hand-written `types/index.d.ts` is removed.
- Export `COMPONENT_VARIABLES` and `COMPONENT_PROPS` metadata for docs and
  tooling.
