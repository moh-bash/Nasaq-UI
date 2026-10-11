# Changelog

All notable changes to Nasaq UI are tracked here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
respects [Semantic Versioning](https://semver.org).

## Unreleased

### Added

- Monorepo restructure into npm workspaces.
- `nasaq` package publishing pipeline: Vite library build (ESM + CJS),
  extracted `styles.css`, hand-written TypeScript declarations, and a dry-run
  package gate (`npm run check`).
- Separation of the documentation site into `apps/docs` (routes `/`,
  `/docs`, `/docs/components`, `/docs/components/<component>`, `/docs/theming`,
  `/docs/installation`, `/playground/<component>`) with legacy redirects from
  the old `/components` and `/theme` URLs.
- Docs shell with persistent sidebar navigation and per-component next/previous
  navigation.
- Theme token metadata (`THEME_TOKENS`, `TOKEN_KEYS`, `tokenVar`, `THEME_VERSION`,
  `themeDefaults`, `resolveTheme`) exported from `nasaq`.

## 0.1.0 — 2026-10-11

### Added

- `nasaq` package with accessible **Button**, **Accordion** and **Tabs**
  components and a theme-first `--color-*` token system (light + dark).
- Playground: live shadow-DOM previews, per-component inspectors and presets,
  and exports of JSX, semantic CSS and self-contained Tailwind components.