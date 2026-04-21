# Test Spec Pattern

**File location**: `src/tests/specs/<feature>-<flow>.spec.ts`

## Template

```typescript
// src/tests/specs/login-flow.spec.ts
import { test } from '@src/main/resources/setup/page-setup';
import * as LoginPage from '../pages/login-page';

test.describe('Login flow @smoke', () => {

  test.beforeEach('Navigate to login page', async () => {
    await LoginPage.navigateToLoginPage();
  });

  test('User can login with valid credentials', async () => {
    await LoginPage.verifyLoginPageIsDisplayed();
    await LoginPage.fillEmail(process.env.USER_EMAIL!);
    await LoginPage.fillPassword(process.env.USER_PASSWORD!);
    await LoginPage.clickLogin();
    await LoginPage.verifyLoginSuccess();
  });

});
```

## Rules

- **Never use Playwright's native `test`** — always import from `page-setup.ts`
- **One test per behaviour** — keep specs focused and readable
- **Tag test suites** with `@smoke`, `@regression`, or feature tags
- **Soft assertions** only when the test must continue after a non-critical check
- Import page objects as `* as PageName` namespace imports
- **No inline helper functions** — never define a local `async function` inside a spec file. If two or more tests share setup (e.g. "add HP LP3065 to cart"), put that flow in the corresponding page object as a single exported function (e.g. `ProductPage.addProductToCart('HP LP3065')`) and call it from the test.
- **No deep-link URL navigation in specs** — do not call `navigateToURL('/index.php?route=...')` to jump to a PDP, cart, or search results. Use the page-object UI flows: header search, card click, cart icon click. The only acceptable `navigateToURL` is the entry-point landing on `/`.

## Running Tests

```bash
npx playwright test                                          # All tests
npx playwright test --project=chromium                       # Chromium only
npx playwright test --grep @smoke                            # By tag
npx playwright test src/tests/specs/foo.spec.ts              # Single file
npx playwright test --headed                                 # Headed mode
npx playwright show-report                                   # HTML report
```

## Stability Check (After Creating or Modifying a Test)

Always run the spec 3 times to verify stability:

```bash
npx playwright test src/tests/specs/<file>.spec.ts --project=chromium --reporter=line
npx playwright test src/tests/specs/<file>.spec.ts --project=chromium --reporter=line
npx playwright test src/tests/specs/<file>.spec.ts --project=chromium --reporter=line
```

Report results as a table:

| Run | Result | Duration |
|-----|--------|----------|
| 1   | ✅ / ❌ | Xs |
| 2   | ✅ / ❌ | Xs |
| 3   | ✅ / ❌ | Xs |
