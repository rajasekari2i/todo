const { test: base } = require('@playwright/test');

function generateUniqueEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `testuser_${timestamp}_${random}@test.com`;
}

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const email = generateUniqueEmail();
    const password = 'Test123456';
    const name = 'Test User';

    await page.goto('/register');
    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await page.waitForURL('/', { timeout: 10000 });

    await use(page);
  },
});

module.exports = { test, generateUniqueEmail };
