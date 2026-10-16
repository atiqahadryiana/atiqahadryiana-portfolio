import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openHome } from './helpers';

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`responsive layout and working navigation at ${width}px`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await openHome(page);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: `test-results/hero-${width}.png` });
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width < 1120) {
      const menu = page.locator('button[aria-controls="primary-navigation"]');
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toBeFocused();
      await menu.click();
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Projects' })
        .click();
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
    await page.getByRole('button', { name: 'AI/ML', exact: true }).click();
    await expect(page.locator('.project-card')).toHaveCount(2);
    await page.getByRole('link', { name: 'SmartBunda', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('SmartBunda');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('SmartBunda');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
test('themes persist and both themes meet automated accessibility checks', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await openHome(page);
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ['dark', 'light']) {
    if (theme === 'light')
      await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
  await page.reload();
  await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: 'Open email app' })).toBeEnabled();
  await expect(page.locator('a[href="mailto:adryianawork@gmail.com"]')).toHaveCount(2);
  await expect(page.locator('a[href*="ADD_"]')).toHaveCount(0);
});
test('keyboard tabs, unknown routes, and work experience remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openHome(page);
  const frontend = page.getByRole('tab', { name: 'Frontend' });
  await frontend.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Backend' })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('Express');
  await expect(page.locator('.experience-empty')).toContainText(
    'Past work experience will appear here when a confirmed role is added.',
  );
  await page.goto('/projects/bakaubase');
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.goto('/projects/unknown');
  await expect(page.getByRole('link', { name: 'Back to projects' })).toBeVisible();
  await page.goto('/unknown');
  await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
});
