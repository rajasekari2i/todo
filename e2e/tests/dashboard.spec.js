const { expect } = require('@playwright/test');
const { test } = require('../fixtures/auth.fixture');

test.describe.serial('Dashboard', () => {
  test('should display stats cards', async ({ authenticatedPage: page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Overdue')).toBeVisible();
    await expect(page.locator('p', { hasText: 'Categories' })).toBeVisible();
  });

  test('should display quick actions', async ({ authenticatedPage: page }) => {
    await expect(page.getByText('Quick Actions')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add New Todo' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Manage Categories' })).toBeVisible();
  });

  test('should navigate via sidebar links', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Todos' }).click();
    await page.waitForURL('/todos');
    await expect(page.getByText('My Todos')).toBeVisible();

    await page.getByRole('link', { name: 'Categories' }).click();
    await page.waitForURL('/categories');
    await expect(page.getByText('Categories & Tags')).toBeVisible();

    await page.getByRole('link', { name: 'Dashboard' }).click();
    await page.waitForURL('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
