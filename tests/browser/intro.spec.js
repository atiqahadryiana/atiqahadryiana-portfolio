import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the homepage appears after ten seconds, not before', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-16T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-16T00:00:01Z'));
  await page.goto('/');
  await expect(page.getByRole('progressbar')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
  await page.clock.fastForward(9000);
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '9');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
  await page.clock.fastForward(1000);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveCount(0);
});
for (const width of [390, 1440]) {
  test(`intro is accessible, fits the viewport, and can be skipped at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('progressbar')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/intro-${width}.png` });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((item) => item.id)).toEqual([]);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('#main-content')).toBeFocused();
    await page.goto('/#projects');
    await expect(page.getByRole('progressbar')).toHaveCount(0);
    await page.goto('/projects/smartbunda');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('SmartBunda.');
    await expect(page.getByRole('progressbar')).toHaveCount(0);
  });
}
test('Ctrl+M opens local admin directly from the welcome screen', async ({ page }) => {
  await page.goto('http://127.0.0.1:4174/');
  await expect(page.getByRole('progressbar')).toBeVisible();
  await page.keyboard.press('Control+m');
  await expect(page).toHaveURL('http://127.0.0.1:4174/admin');
  await expect(page.getByRole('heading', { name: 'Admin sign-in.' })).toBeVisible();
});
