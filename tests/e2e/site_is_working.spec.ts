import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://pay-check-mate.test/wp-admin');
    await page.getByLabel('Username or Email Address').click();
    await page.getByLabel('Username or Email Address').fill('admin');
    await page.getByLabel('Password', { exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill('admin');
    await page.getByRole('button', { name: 'Log In' }).click();
})
test('test', async ({ page }) => {
    await page.getByRole('heading', { name: 'Dashboard' }).click();

    // Expect that the heading text is correct
    expect(await page.textContent('h1')).toBe('Dashboard');
});

test('test pay check mate plugin is there', async ({ page }) => {
    // Hover plugins link
    await page.hover('text=Plugins');
    await page.getByRole('link', { name: 'Installed Plugins' }).click();

    // Expect that the plugin is there
    expect(await page.textContent('text=PayCheckMate')).toBe('PayCheckMate');
});

test('test pay check mate plugin can be activated', async ({ page }) => {
    // Hover plugins link
    await page.hover('text=Plugins');
    await page.getByRole('link', { name: 'Installed Plugins' }).click();

    // Activate the plugin
    await page.getByRole('link', { name: 'Activate PayCheckMate' }).click();

    // Expect that the plugin is there
    expect(await page.textContent('text=PayCheckMate')).toBe('PayCheckMate');
})
