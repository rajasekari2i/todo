const { expect } = require('@playwright/test');
const { test } = require('../fixtures/auth.fixture');

test.describe.serial('Todos', () => {
  const todoTitle = `Test Todo ${Date.now()}`;
  const updatedTitle = `Updated ${todoTitle}`;

  test('should create a new todo', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Todos' }).click();
    await page.waitForURL('/todos');
    await expect(page.getByText('My Todos')).toBeVisible();

    await page.getByRole('button', { name: 'Add Todo' }).click();

    await expect(page.getByText('Create Todo')).toBeVisible();
    await page.getByLabel('Title *').fill(todoTitle);
    await page.getByLabel('Description').fill('This is a test todo description');
    await page.getByLabel('Priority').selectOption('high');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('high', { exact: true })).toBeVisible();
  });

  test('should edit an existing todo', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Todos' }).click();
    await page.waitForURL('/todos');

    // Create a todo to edit
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByLabel('Title *').fill(todoTitle);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText(todoTitle)).toBeVisible({ timeout: 5000 });

    // Click the edit button on the todo item
    const todoItem = page.locator('.card', { has: page.getByText(todoTitle) }).first();
    await todoItem.getByRole('button').filter({ has: page.locator('svg') }).nth(1).click();

    await expect(page.getByText('Edit Todo')).toBeVisible();
    await page.getByLabel('Title *').clear();
    await page.getByLabel('Title *').fill(updatedTitle);
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByText(updatedTitle)).toBeVisible({ timeout: 5000 });
  });

  test('should toggle todo completion', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Todos' }).click();
    await page.waitForURL('/todos');

    // Create a todo to toggle
    const toggleTodo = `Toggle Todo ${Date.now()}`;
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByLabel('Title *').fill(toggleTodo);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText(toggleTodo)).toBeVisible({ timeout: 5000 });

    // Click the toggle (check circle) button - it's the first button in the todo item
    const todoItem = page.locator('.card', { has: page.getByText(toggleTodo) }).first();
    await todoItem.locator('button').first().click();

    // After toggling, the todo should have line-through style (completed)
    await expect(todoItem.locator('.line-through')).toBeVisible({ timeout: 5000 });
  });

  test('should delete a todo', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Todos' }).click();
    await page.waitForURL('/todos');

    // Create a todo to delete
    const deleteTodo = `Delete Todo ${Date.now()}`;
    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByLabel('Title *').fill(deleteTodo);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText(deleteTodo)).toBeVisible({ timeout: 5000 });

    // Click the delete button (last button with trash icon)
    const todoItem = page.locator('.card', { has: page.getByText(deleteTodo) }).first();
    await todoItem.getByRole('button').filter({ has: page.locator('svg') }).last().click();

    await expect(page.getByText(deleteTodo)).toBeHidden({ timeout: 5000 });
  });

  test('should filter todos by search', async ({ authenticatedPage: page }) => {
    await page.getByRole('link', { name: 'Todos' }).click();
    await page.waitForURL('/todos');

    // Create two distinct todos
    const searchableTodo = `Searchable ${Date.now()}`;
    const otherTodo = `Other ${Date.now()}`;

    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByLabel('Title *').fill(searchableTodo);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText(searchableTodo)).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'Add Todo' }).click();
    await page.getByLabel('Title *').fill(otherTodo);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText(otherTodo)).toBeVisible({ timeout: 5000 });

    // Use the search filter
    await page.getByPlaceholder('Search todos...').fill('Searchable');

    // Wait for the filter to take effect
    await expect(page.getByText(searchableTodo)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(otherTodo)).toBeHidden({ timeout: 5000 });
  });
});
