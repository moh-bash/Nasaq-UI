import { test, expect } from '@playwright/test';

/*
  Smoke + visual regression for every ready component in both views.

  The critical assertion is (b): a computed background / padding / radius inside
  the shadow root. If the generators emit selectors the component never uses
  (the `.btn` vs `nq-btn` regression), the preview still mounts and screenshots
  still "work", but these values stay at browser defaults and the test fails.
*/

const COMPONENTS = [
  {
    id: 'button',
    name: 'Button',
    docsSelector: '.nq-btn',
    playgroundSelector: '.nq-btn',
    expectPadding: true,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    docsSelector: '.nq-acc',
    playgroundSelector: '.nq-acc',
    expectPadding: false,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    docsSelector: '.nq-tabs-panel',
    playgroundSelector: '.nq-tabs-panel',
    expectPadding: true,
  },
];

function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function assertStyledPreview(page, selector, { expectPadding }) {
  const preview = page.locator('[data-live-preview]').first();
  await expect(preview).toBeVisible();
  const target = preview.locator(selector).first();
  await expect(target).toBeVisible();

  const style = await target.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      background: computed.backgroundColor,
      padding: computed.padding,
      radius: computed.borderTopLeftRadius,
      color: computed.color,
      display: computed.display,
    };
  });

  expect(style.display).not.toBe('inline');
  expect(style.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(style.radius).not.toBe('0px');
  expect(style.color).not.toBe('');
  if (expectPadding) expect(style.padding).not.toBe('0px');
}

for (const component of COMPONENTS) {
  test.describe(`${component.name} views`, () => {
    test('docs page renders a styled preview', async ({ page }, testInfo) => {
      const errors = collectConsoleErrors(page);
      await page.goto(`/docs/components/${component.id}`);
      await page.evaluate(() => document.fonts.ready);
      await assertStyledPreview(page, component.docsSelector, component);
      await expect(page.locator('[data-live-preview]').first()).toHaveScreenshot(
        `docs-${component.id}-${testInfo.project.name}.png`,
      );
      expect(errors, `console errors:\n${errors.join('\n')}`).toEqual([]);
    });

    test('playground renders a styled preview', async ({ page }, testInfo) => {
      const errors = collectConsoleErrors(page);
      await page.goto(`/docs/components/${component.id}/playground`);
      await page.evaluate(() => document.fonts.ready);
      await assertStyledPreview(page, component.playgroundSelector, component);
      await expect(page.locator('#preview-canvas')).toHaveScreenshot(
        `playground-${component.id}-${testInfo.project.name}.png`,
      );
      expect(errors, `console errors:\n${errors.join('\n')}`).toEqual([]);
    });
  });
}
