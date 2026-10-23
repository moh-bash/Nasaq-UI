import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/*
  Axe smoke tests for the shell, the docs article layout, installation and the
  studio. Serious and critical findings fail the build; moderate findings are
  intentionally left to manual review (axe cannot judge design intent).
*/

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/docs', name: 'docs start' },
  { path: '/docs/installation', name: 'installation' },
  { path: '/docs/components/button', name: 'component docs' },
  { path: '/docs/components/button/playground', name: 'playground' },
];

const DARK_PAGES = [
  { path: '/docs', name: 'docs start' },
  { path: '/docs/components/button/playground', name: 'playground' },
];

async function audit(page, name) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('main')).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();

  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );
  if (blocking.length) {
    console.log(
      `AXE ${name}\n` +
        blocking
          .map(
            (violation) =>
              `- ${violation.id} (${violation.impact}): ${violation.help}\n` +
              violation.nodes.map((node) => `    ${node.target.join(' ')}`).join('\n'),
          )
          .join('\n'),
    );
  }
  expect(
    blocking,
    blocking
      .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length})`)
      .join('\n'),
  ).toEqual([]);
}

for (const entry of PAGES) {
  test(`axe: ${entry.name}`, async ({ page }) => {
    await page.goto(entry.path);
    await audit(page, entry.name);
  });
}

for (const entry of DARK_PAGES) {
  test(`axe dark: ${entry.name}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(entry.path);
    await audit(page, `dark ${entry.name}`);
  });
}
