export async function openHome(page) {
  await page.goto('/');
  await page.keyboard.press('Escape');
}
