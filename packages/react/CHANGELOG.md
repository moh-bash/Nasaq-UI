# nasaq

## 0.2.0

### Minor Changes

- d3f4063: Ship the component-variable contract and TypeScript source types.
  
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

## Unreleased

### Minor

- Add documented per-component `--nq-*` variables and export
  `COMPONENT_VARIABLES` / `COMPONENT_PROPS`.
- Add AA-contrast `on-primary`, `on-secondary` and `on-danger` tokens.
- Convert the library to TypeScript and generate `.d.ts` / `.d.cts` from
  source.

### Breaking

- Theme state version is now `3`. The temporary `on-solid` override key was
  replaced by `on-primary`, `on-secondary` and `on-danger`; persisted theme
  state is migrated automatically by the docs app.
- Generated CSS now imports `nasaq/styles.css` and contains variable overrides
  only. Consumers that expected a fully re-typed component stylesheet should
  keep the import or copy the library stylesheet alongside the override block.
