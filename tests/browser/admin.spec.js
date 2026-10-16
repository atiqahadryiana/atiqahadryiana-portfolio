import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { profile, projects, projectFilters } from '../../src/data/portfolio.js';
import { openHome } from './helpers';

async function mockAdmin(page, { signedIn = true, failResume = false } = {}) {
  let content = structuredClone({
    profile: { ...profile, resume: '' },
    projects,
    projectFilters,
    revision: 'test-one',
  });
  let revision = 1;
  await page.route('**/__admin/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const body = route.request().method() === 'POST' ? route.request().postDataJSON() : null;
    const auth = {
      authenticated: signedIn,
      configured: true,
      ...(signedIn ? { username: 'testowner', token: 'browser-test-token' } : {}),
    };
    if (path.endsWith('/session')) return route.fulfill({ json: auth });
    if (path.endsWith('/login')) {
      if (body.password !== 'test-password')
        return route.fulfill({
          status: 401,
          json: { error: 'The username or password is incorrect.' },
        });
      signedIn = true;
      return route.fulfill({
        json: { authenticated: true, username: 'testowner', token: 'browser-test-token' },
      });
    }
    if (!signedIn) return route.fulfill({ status: 401, json: { error: 'Sign in again.' } });
    if (path.endsWith('/logout')) {
      signedIn = false;
      return route.fulfill({ json: { authenticated: false } });
    }
    if (path.endsWith('/content')) return route.fulfill({ json: content });
    if (path.endsWith('/resume')) {
      if (failResume) {
        failResume = false;
        return route.fulfill({
          status: 500,
          json: { error: 'The update could not be saved. Try again.' },
        });
      }
      content.profile.resume = body.resume;
    }
    if (path.endsWith('/profile')) content.profile = { ...content.profile, ...body.profile };
    if (path.endsWith('/projects')) {
      const index = content.projects.findIndex((item) => item.slug === body.originalSlug);
      if (index === -1)
        content.projects.push({ ...body.project, number: '05', art: 'fallback', gallery: [] });
      else content.projects[index] = { ...content.projects[index], ...body.project };
    }
    content.revision = `test-${++revision}`;
    return route.fulfill({ json: content });
  });
}
async function audit(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })),
  ).toEqual([]);
}

test.describe('Local portfolio administration', () => {
  test.use({ baseURL: 'http://127.0.0.1:4174' });
  test('shortcut opens sign-in, credentials gate edits, and an owner can add and edit projects and profile', async ({
    page,
  }) => {
    await mockAdmin(page, { signedIn: false });
    await openHome(page);
    await page.keyboard.press('m');
    await page.keyboard.press('Control+Shift+m');
    await expect(page).toHaveURL('http://127.0.0.1:4174/');
    await page.getByLabel('Your name').fill('Draft message');
    await page.keyboard.press('Control+m');
    await expect(page).toHaveURL('http://127.0.0.1:4174/');
    await page.getByRole('heading', { level: 1 }).click();
    await page.keyboard.press('Control+m');
    await expect(page).toHaveURL('http://127.0.0.1:4174/admin');
    await expect(page.getByRole('heading', { name: 'Admin sign-in.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New project' })).toHaveCount(0);
    await page.getByLabel('Username').fill('testowner');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('incorrect');
    await page.getByLabel('Password').fill('test-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.getByRole('button', { name: 'New project' }).click();
    await page.getByLabel('Project title').fill('Browser test project');
    await page.getByLabel('Project URL slug').fill('browser-test-project');
    await page.getByLabel('Project category').fill('Web application');
    await page.getByLabel('Short description').fill('A project created through the editor.');
    await page.getByRole('checkbox', { name: 'Web', exact: true }).check();
    await page.getByRole('button', { name: 'Add project', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Browser test project' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit Browser test project', exact: true }).click();
    await page.getByLabel('Project title').fill('Updated browser project');
    await page.getByRole('button', { name: 'Save project', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Updated browser project' })).toBeVisible();
    await page.getByRole('button', { name: 'Profile', exact: true }).click();
    await page.getByLabel('Full name').fill('Test owner');
    await page.getByRole('button', { name: 'Save profile', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Profile saved');
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Admin sign-in.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New project' })).toHaveCount(0);
  });
  for (const width of [390, 1440]) {
    test(`login and editor layouts, failed saves and accessibility at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await mockAdmin(page, { signedIn: false, failResume: true });
      await page.goto('/admin');
      await expect(page.getByRole('heading', { name: 'Admin sign-in.' })).toBeVisible();
      await audit(page);
      await page.screenshot({ path: `test-results/login-${width}.png`, fullPage: true });
      await page.getByLabel('Username').fill('testowner');
      await page.getByLabel('Password').fill('test-password');
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await page.getByRole('button', { name: 'Resume', exact: true }).click();
      const input = page.getByLabel('Resume PDF URL');
      const save = page.getByRole('button', { name: 'Save resume link' });
      await input.fill('javascript:alert(1)');
      await save.click();
      await expect(input).toBeFocused();
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await input.fill('https://example.com/resume.pdf');
      await save.click();
      await expect(page.getByRole('alert')).toContainText('could not be saved');
      await expect(input).toHaveValue('https://example.com/resume.pdf');
      await save.click();
      await expect(page.getByRole('link', { name: 'View resume' })).toHaveAttribute(
        'href',
        'https://example.com/resume.pdf',
      );
      for (const theme of ['dark', 'light']) {
        if (theme === 'light')
          await page.getByRole('button', { name: 'Switch to light theme' }).click();
        await audit(page);
      }
      await expect(page.getByRole('status')).toContainText('Resume saved');
      await page.screenshot({ path: `test-results/admin-${width}.png`, fullPage: true });
      await input.fill('');
      await save.click();
      await expect(page.getByRole('status')).toContainText('resume button is now hidden');
      await page.getByRole('button', { name: 'Projects', exact: true }).click();
      await page.getByRole('button', { name: 'New project' }).click();
      await audit(page);
      await page.screenshot({ path: `test-results/project-editor-${width}.png`, fullPage: true });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    });
  }
});
test('production excludes admin login, editor and shortcut', async ({ page }) => {
  await openHome(page);
  await page.keyboard.press('Control+m');
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await page.goto('/admin');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A little off the beaten path.');
  await expect(page.getByRole('form', { name: 'Admin sign-in' })).toHaveCount(0);
});
