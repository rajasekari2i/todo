# E2E Testing with Playwright

E2E tests in `e2e/tests/`, config in `playwright.config.js`.

## Execution

- Serial execution only (`test.describe.serial`)
- Single worker (`workers: 1`)
- Chromium only
- Screenshots on failure, trace on first retry

## Auth Fixture

Use the custom `authenticatedPage` fixture from `e2e/fixtures/auth.fixture.js`:

```javascript
const { test } = require('../fixtures/auth.fixture');

test('create a todo', async ({ authenticatedPage: page }) => { ... });
```

- Creates a fresh user per test for isolation
- Registers via UI flow (validates auth UI works)
- User data uses `Date.now()` suffix for uniqueness

## Test Data

- Use `Date.now()` in names to avoid collisions: `` `Test Todo ${Date.now()}` ``
- Tests create their own data, don't depend on seeded data
- No cleanup step — fresh users mean no stale data conflicts

## Element Selection

- Prefer `page.getByText()`, `page.getByLabel()`, `page.getByRole()` (accessibility selectors)
- Use `.card` CSS class with `{ has: page.getByText(name) }` to scope to specific items
- Use explicit timeouts for assertions: `{ timeout: 5000 }`
