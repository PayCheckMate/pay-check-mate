// import { test, expect } from '@playwright/test';
//
// const userName = 'admin'
// const password = 'admin'
// test('Check we have the plugin.', async ({ page }) => {
//     await page.goto('http://pay-check-mate.test/wp-admin');
//     await page.getByLabel('Username or Email Address').click();
//     await page.getByLabel('Username or Email Address').fill(userName);
//     await page.getByLabel('Password', { exact: true }).click();
//     await page.getByLabel('Password', { exact: true }).fill(password);
//     await page.getByRole('button', { name: 'Log In' }).click();
//     await page.goto('https://pay-check-mate.test/wp-admin/plugins.php');
//
//     expect(page.getByText('PayCheckMate Plugin', { exact: true }));
//
// });
//
// test('Activate the plugin', async ({ page }) => {
//     await page.goto('https://pay-check-mate.test/wp-admin');
//     await page.getByLabel('Username or Email Address').click();
//     await page.getByLabel('Username or Email Address').fill(userName);
//     await page.getByLabel('Password', { exact: true }).click();
//     await page.getByLabel('Password', { exact: true }).fill(password);
//     await page.getByRole('button', { name: 'Log In' }).click();
//     await page.goto('https://pay-check-mate.test/wp-admin/plugins.php');
//
//     await page.getByLabel('Activate PayCheckMate Plugin' ).click();
//     expect(page.getByText('Plugin activated.', { exact: true }));
//
// });
