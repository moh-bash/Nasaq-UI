# nasaq

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
