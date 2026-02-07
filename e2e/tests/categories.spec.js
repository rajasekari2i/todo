const { expect } = require('@playwright/test');
const { test } = require('../fixtures/auth.fixture');

test.describe.serial('Categories & Tags', () => {
  test('should create a new category', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Categories' }).click();
    await page.waitForURL('/categories');
    await expect(page.getByText('Categories & Tags')).toBeVisible();

    await page.getByRole('button', { name: 'Add Category' }).click();
    await expect(page.getByText('New Category')).toBeVisible();

    await page.getByLabel('Name').fill('Work');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('Work')).toBeVisible({ timeout: 5000 });
  });

  test('should edit a category', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Categories' }).click();
    await page.waitForURL('/categories');

    // First create a category to edit
    await page.getByRole('button', { name: 'Add Category' }).click();
    await page.getByLabel('Name').fill('EditMe');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('EditMe')).toBeVisible({ timeout: 5000 });

    // Wait for toasts to clear and dismiss any open popups
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Click the edit (pencil) button on the category row
    const categoryRow = page.locator('.rounded-lg.bg-gray-50', { has: page.getByText('EditMe') });
    const editButton = categoryRow.locator('button').nth(0);
    await editButton.click();

    await expect(page.getByText('Edit Category')).toBeVisible({ timeout: 5000 });
    await page.getByLabel('Name').clear();
    await page.getByLabel('Name').fill('Edited Category');
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByText('Edited Category')).toBeVisible({ timeout: 5000 });
  });

  test('should delete a category', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Categories' }).click();
    await page.waitForURL('/categories');

    // First create a category to delete
    await page.getByRole('button', { name: 'Add Category' }).click();
    await page.getByLabel('Name').fill('DeleteMe');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('DeleteMe')).toBeVisible({ timeout: 5000 });

    // Wait for toasts to clear
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Click the delete (trash) button on the category row
    const categoryRow = page.locator('.rounded-lg.bg-gray-50', { has: page.getByText('DeleteMe') });
    const deleteButton = categoryRow.locator('button').nth(1);
    await deleteButton.click();

    await expect(page.getByText('DeleteMe')).toBeHidden({ timeout: 5000 });
  });

  test('should create and delete a tag', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Categories' }).click();
    await page.waitForURL('/categories');

    // Create a tag
    const tagName = `testtag${Date.now()}`;
    await page.getByPlaceholder('New tag name...').fill(tagName);
    await page.getByRole('button', { name: 'Add Tag' }).click();

    await expect(page.getByText(`#${tagName}`)).toBeVisible({ timeout: 5000 });

    // Delete the tag (click the trash button next to it)
    const tagItem = page.locator('.rounded-full', { has: page.getByText(`#${tagName}`) }).first();
    await tagItem.getByRole('button').click();

    await expect(page.getByText(`#${tagName}`)).toBeHidden({ timeout: 5000 });
  });
});
