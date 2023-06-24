import { test, expect } from '@playwright/test';

// @ts-ignore
const addDepartment = async (page, departmentName) => {
    await page.getByRole('button', { name: 'Add department' }).click();
    await page.getByRole('heading', { name: 'Add department' }).click();
    await page.getByLabel('Department name*').click();
    await page.getByLabel('Department name*').fill(departmentName);
    await page.getByRole('button', { name: 'Save' }).click();
};

test.beforeEach(async ({ page }) => {
    await page.goto('http://pay-check-mate.test/wp-admin');
    await page.getByLabel('Username or Email Address').click();
    await page.getByLabel('Username or Email Address').fill('admin');
    await page.getByLabel('Password', { exact: true }).click();
    await page.getByLabel('Password', { exact: true }).fill('admin');
    await page.getByRole('button', { name: 'Log In' }).click();

    // If navigation has PayCheckMate link, then the plugin is activated
    if (!await page.isVisible('text=PayCheckMate')) {
        // Hover plugins link
        await page.hover('text=Plugins');
        await page.getByRole('link', { name: 'Installed Plugins' }).click();

        // Activate the payCheckMate plugin only if it is not activated
        await page.getByRole('link', { name: 'Activate PayCheckMate' }).click();
    }

    // Go to the PayCheckMate Department list page
    await page.getByRole('link', { name: 'PayCheckMate', exact: true }).click();
    await page.locator('div').filter({ hasText: /^Settings$/ }).nth(2).click();
    await page.getByRole('link', { name: 'Departments' }).click();
})

test('Department empty list', async ({ page }) => {
    // Expect that the page has the text
    expect(await page.getByText('No departments found.')).toBeTruthy();
});

test('Add new department', async ({ page }) => {
    const departmentName = 'Test Department';

    // Add a new department
    await addDepartment(page, departmentName);

    // Expect that the success message is displayed, Department created successfully
    expect(await page.getByText('Department created successfully')).toBeTruthy();

    // Expect that the department is added to the list
    expect(await page.getByText(departmentName)).toBeTruthy();
})

test('Add new department with empty name', async ({ page }) => {
// Add a new department
    await addDepartment(page, '');

    // Expect that the error message is displayed; Department name is required
    expect(await page.getByText('Department name is required')).toBeTruthy();
})
