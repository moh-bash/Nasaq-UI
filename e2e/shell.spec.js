import { test, expect } from '@playwright/test';

test('the skip link is the first stop and targets the main region', async ({ page }) => {
  await page.goto('/docs');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main-content');
  await expect(page.locator('#main-content')).toHaveCount(1);
});

test('command palette opens with the keyboard and navigates', async ({ page }) => {
  await page.goto('/docs');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog).toBeVisible();
  const input = dialog.getByPlaceholder(/Search components/);
  await input.fill('Button playground');
  await dialog.getByRole('option', { name: /Button playground/ }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button\/playground$/);
});

test('/ focuses the sidebar search', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'The sidebar is a drawer on mobile.');
  await page.goto('/docs');
  await page.keyboard.press('/');
  await expect(page.getByRole('searchbox', { name: 'Search components' })).toBeFocused();
});

test('share writes the configuration into the URL and offers undo', async ({ page }) => {
  await page.goto('/docs/components/button/playground');
  await page.getByRole('button', { name: 'Copy a link to this exact configuration' }).click();
  await expect(page).toHaveURL(/#nq=/);
  await expect(
    page.getByText('Share link copied. The address bar now points at this setup.'),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByText('Loaded from a shared link.')).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('Restored your previous configuration')).toBeVisible();
});

test('the inspector filter narrows fields and exposes reset only when modified', async ({ page }) => {
  await page.goto('/docs/components/button/playground');
  // On narrow screens the inspector is a drawer and starts closed. Wait for
  // the media query to settle before deciding whether to open it.
  await expect(page.locator('[data-inspector]')).toBeVisible();
  if (await page.locator('[data-inspector="closed"]').count()) {
    await page.getByRole('button', { name: /properties inspector/ }).click();
  }
  await expect(page.locator('[data-inspector="open"]')).toHaveCount(1);
  const filter = page.getByRole('searchbox', { name: 'Find a property' });
  await filter.fill('letter');
  await expect(page.getByText('Letter spacing')).toBeVisible();
  await expect(page.getByText('Corner radius')).toHaveCount(0);

  await filter.fill('');
  const label = page.getByRole('textbox', { name: 'Label', exact: true });
  await label.fill('Shared action');
  await expect(page.getByRole('button', { name: 'Reset content to defaults' })).toBeVisible();
});

test('mobile studio tabs switch between preview and code', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Compact layout only.');
  await page.goto('/docs/components/button/playground');
  await expect(page.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Code' }).click();
  await expect(page.getByRole('tablist', { name: 'Code files' })).toBeVisible();
});

test('shortcut helper lists the global keys', async ({ page }) => {
  await page.goto('/docs');
  await page.keyboard.press('Shift+?');
  const dialog = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Open the command palette')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
