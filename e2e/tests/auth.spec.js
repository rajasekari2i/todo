const { test, expect } = require('@playwright/test');
const { generateUniqueEmail } = require('../fixtures/auth.fixture');

test.describe.serial('Authentication', () => {
  let registeredEmail;
  const password = 'Test123456';

  test('should register a new user', async ({ page }) => {
    registeredEmail = generateUniqueEmail();

    await page.goto('/register');
    await expect(page.getByText('Create your account')).toBeVisible();

    await page.getByLabel('Name').fill('E2E Test User');
    await page.getByLabel('Email').fill(registeredEmail);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Sign in to your account')).toBeVisible();

    await page.getByLabel('Email').fill(registeredEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.getByText('Dashboard')).toBeVisible();
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Sign in to your account')).toBeVisible();

    await page.getByLabel('Email').fill('nonexistent@test.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // Listen for the API response to confirm the error
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/auth/login') && resp.status() === 401
    );
    await page.getByRole('button', { name: 'Sign in' }).click();
    await responsePromise;

    // Verify we stayed on the login page (not redirected to dashboard)
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Sign in to your account')).toBeVisible();
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login', { timeout: 10000 });
    await expect(page.getByText('Sign in to your account')).toBeVisible();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Sign in to your account')).toBeVisible();

    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.waitForURL('/register');
    await expect(page.getByText('Create your account')).toBeVisible();

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.waitForURL('/login');
    await expect(page.getByText('Sign in to your account')).toBeVisible();
  });
});
