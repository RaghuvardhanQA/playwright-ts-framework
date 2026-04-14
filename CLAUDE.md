# Playwright TypeScript Framework — Claude Context

This is a Playwright + TypeScript end-to-end test automation framework targeting
`https://ecommerce-playground.lambdatest.io`. It uses the **Page Object Model (POM)**
pattern with centralized utilities, `#` path aliases, and storage-state-based auth.

This file is auto-loaded into every Claude Code session — critical rules live here.

---

## Critical Rules (read first)

### Testing

- **Always run tests 3 times to validate stability** before declaring success.
  A single passing run is not enough — flaky selectors, race conditions, and
  server-side session quirks can hide behind a lucky first pass.
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

- **After any `playwright.config.ts` or `.env` changes**, verify `dotenv` is
  explicitly loaded at the top of `playwright.config.ts`:
  ```ts
  import dotenv from 'dotenv';
  dotenv.config();
  ```
  Missing this is a silent failure — `process.env.USER_EMAIL` becomes `undefined`
  at runtime and login breaks without a clear error.

- **Type-check after every edit**: run `npx tsc --noEmit` after changes to
  `tsconfig.json`, path aliases, or any utility/page-object files.

### Documentation

- When updating `README.md`, always include sections for **all three** of:
  1. **Storage State** — auth save/load and auto-login fallback
  2. **Skills** — `.claude/skills/` folders
  3. **Agents** — `.claude/agents/` (test-generator, test-healer, test-planner)

  Missing the agents section is a recurring gap — do not stop at the first two.

### Debugging

- **If the user reports a discrepancy** between what they see and the file
  contents, **read the file on disk first with `Read`** before debugging.
  Stale editor buffers are a common cause of phantom bugs.

- For Playwright test failures, follow the healer agent workflow:
  run → parse error → inspect live page via `playwright-cli` → fix → validate 3×.

---

## Target Application

**Site**: [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.io)
**Type**: OpenCart-based e-commerce platform
**Base URL**: `https://ecommerce-playground.lambdatest.io`

### Key Pages & URL Routes

| Page              | URL / Route                                                  |
|-------------------|--------------------------------------------------------------|
| Home              | `/`                                                          |
| Login             | `/index.php?route=account/login`                             |
| Register          | `/index.php?route=account/register`                          |
| My Account        | `/index.php?route=account/account`                           |
| Logout            | `/index.php?route=account/logout`                            |
| Search Results    | `/index.php?route=product/search&search=<term>`              |
| Product Category  | `/index.php?route=product/category&path=<id>`                |
| Product Detail    | `/index.php?route=product/product&product_id=<id>`           |
| Shopping Cart     | `/index.php?route=checkout/cart`                             |
| Checkout          | `/index.php?route=checkout/checkout`                         |
| Wishlist          | `/index.php?route=account/wishlist`                          |
| Compare           | `/index.php?route=product/compare`                           |

### Common Selectors Reference (OpenCart patterns)

```typescript
// Navigation
const SEARCH_INPUT       = 'input[name="search"]';
const NAV_MENU           = '#narbar-menu';
const CART_BTN           = '#cart > button';
const MY_ACCOUNT_BTN     = "//*[@role='button'][contains(@href,'account')]";
const LOGIN_LINK         = "//a[contains(@href,'account/login')]";

// Auth pages
const EMAIL_INPUT        = "input[name='email']";
const PASSWORD_INPUT     = "input[name='password']";
const LOGIN_BTN          = "input[type='submit'][value='Login']";

// Product listing
const PRODUCT_CARDS      = '.product-thumb';
const PRODUCT_LINK       = '.product-thumb h4 a';
const NO_RESULTS_MSG     = "//p[contains(text(),'There is no product that matches')]";

// Product detail
const PRODUCT_TITLE      = 'h1.h3';
const ADD_TO_CART_BTN    = 'button.btn-cart';
```

---

## Project Structure

```
src/
├── main/
│   ├── resources/
│   │   ├── constants/timeouts.ts         # Timeout constants
│   │   └── setup/page-setup.ts           # Custom test fixture
│   └── utils/
│       ├── action-utils.ts               # Click, fill, hover, dialogs
│       ├── element-utils.ts              # Locators, state checks, waits
│       ├── expect-utils.ts               # Assertions
│       ├── page-utils.ts                 # Navigation, tabs, storage state
│       └── api-utils.ts                  # API helpers
└── tests/
    ├── pages/                            # Page Object files — one per page
    ├── specs/                            # Test spec files (*.spec.ts)
    ├── testdata/                         # Shared typed test data
    └── storage-setup/                    # Auth state save/load
.claude/
├── agents/                               # playwright-test-{generator,healer,planner}
└── skills/                               # utils + playwright-cli skills
```

---

## Imports — always use `#` aliases

Defined in `tsconfig.json` with `moduleResolution: "bundler"`. Never use relative
paths like `../../utils/...` in new code.

```typescript
// Test fixture — REQUIRED, do not import test from '@playwright/test' directly
import { test } from '#pagesetup';

// Utilities — named imports
import { click, fill, clickAndNavigate } from '#utils/action-utils';
import { getLocator, waitForElementToBeVisible } from '#utils/element-utils';
import { expectElementToBeVisible, expectPageToHaveTitle } from '#utils/expect-utils';
import { navigateToURL, getPage, saveStorageState } from '#utils/page-utils';

// Page objects
import * as LoginPage from '#pages/login-page';
import * as MyAccountPage from '#pages/my-account-page';

// Test data
import { validProducts, sortOptions, defaultUser } from '#testdata/plp-test-data';

// Storage setup
import { getUserAuthPath } from '#storage-setup/cookie-utils';

// Constants
import { SMALL_TIMEOUT, DEFAULT_TIMEOUT } from '#constants/timeouts';
```

Available aliases: `#pages/*`, `#utils/*`, `#constants/*`, `#setup/*`, `#pagesetup`,
`#storage-setup/*`, `#testdata/*`, `#resources/*`, `#playwright-config`.

---

## Naming Conventions

| Thing            | Convention        | Example                         |
|------------------|-------------------|---------------------------------|
| Files            | kebab-case        | `checkout-page.ts`              |
| Directories      | kebab-case        | `tests/pages/`                  |
| Functions        | camelCase         | `clickAddToCart()`              |
| Page functions   | verb-first        | `verify*()`, `click*()`, `navigate*()`, `fill*()`, `select*()` |
| Constants        | UPPER_SNAKE_CASE  | `DEFAULT_TIMEOUT`               |
| Types/Interfaces | PascalCase        | `ClickOptions`                  |
| Spec files       | `*.spec.ts`       | `plp-validation.spec.ts`        |
| Tags             | `@tagname`        | `@smoke`, `@regression`         |

---

## Page Object Pattern

**File location**: `src/tests/pages/<feature-name>-page.ts`

Page objects are **plain async functions** (no classes). Export each action as
a named async function. One page per file.

```typescript
// src/tests/pages/login-page.ts
import { fill, clickAndNavigate } from '#utils/action-utils';
import { expectPageToHaveTitle } from '#utils/expect-utils';
import { waitForPageLoadState } from '#utils/page-utils';
import { SMALL_TIMEOUT } from '#constants/timeouts';

// --- Locators ---
const EMAIL_INPUT    = "input[name='email']";
const PASSWORD_INPUT = "input[name='password']";
const LOGIN_BTN      = "input[type='submit'][value='Login']";

export async function verifyLoginPage() {
  await expectPageToHaveTitle('Account Login');
}

export async function login() {
  await waitForPageLoadState({ waitUntil: 'domcontentloaded', timeout: SMALL_TIMEOUT });
  await fill(EMAIL_INPUT, process.env.USER_EMAIL!);
  await fill(PASSWORD_INPUT, process.env.USER_PASSWORD!);
  await clickAndNavigate(LOGIN_BTN);
}
```

---

## Test Spec Pattern (parameterised)

```typescript
// src/tests/specs/plp-validation.spec.ts
import { test } from '#pagesetup';
import * as MyAccountPage from '#pages/my-account-page';
import * as ProductSearchPage from '#pages/product-search-page';
import { validProducts, sortOptions } from '#testdata/plp-test-data';

test.describe('PLP Validation @smoke', () => {

  test.beforeEach('Navigate to account', async () => {
    // auto-login fallback omitted for brevity
  });

  // Parameterised positive cases
  for (const product of validProducts) {
    test(`Verify search results for "${product.name}"`, async () => {
      await MyAccountPage.searchForProduct(product.searchTerm);
      await ProductSearchPage.verifyProductResultsAreDisplayed();
    });
  }

  // Parameterised sort options
  for (const option of sortOptions) {
    test(`Verify sort option "${option.label}"`, async () => {
      await MyAccountPage.searchForProduct(validProducts[0].searchTerm);
      await ProductSearchPage.selectSortOption(option.label);
      await ProductSearchPage.verifySortOptionIsSelected(option.label);
    });
  }
});
```

---

## Storage State Gotcha

- Session cookies with `expires: -1` are treated as **always-expired** — server-side
  sessions (OCSESSID on this site) don't survive across Playwright browser contexts.
- Use the **auto-login fallback pattern** in `beforeEach`: navigate to the account
  page, check if URL redirected to `/login`, perform a fresh login if so, then
  save the new storage state.
- `test.use({ storageState: { cookies: [], origins: [] } })` gives a clean
  unauthenticated context. Place it in a **separate top-level `describe`** block
  or it will inherit parent state.

---

## Utility Cheat Sheet

### ActionUtils — Interactions

```typescript
await click(locator);                        // Standard click
await clickAndNavigate(locator);             // Click + wait for navigation
await clickByJS(locator);                    // JS click (bypass overlays)
await hover(locator);
await fill(locator, 'text');                 // Clear + type
await fillAndEnter(locator, 'text');         // Fill + press Enter
await selectByText(locator, 'visible text');
await check(locator) / await uncheck(locator);
await uploadFiles(locator, ['path/to/file']);
// Option: { stable: true } — waits for element to stop animating
```

### ElementUtils — Locators & Waits

```typescript
const loc = getLocator('//xpath or css');
const loc = getLocatorByText('Submit');
const loc = getLocatorByRole('button', { name: 'Add' });
const loc = getLocatorByLabel('Email');
const loc = getLocatorByPlaceholder('Enter email');
const loc = getLocatorByTestId('submit-btn');

const text = await getText(locator);
const val  = await getInputValue(locator);

await waitForElementToBeVisible(locator);
await waitForElementToBeHidden(locator);
await waitForElementToBeStabled(locator);
```

### ExpectUtils — Assertions

```typescript
await expectElementToBeVisible(locator);
await expectElementToBeHidden(locator);
await expectElementToBeEnabled(locator);
await expectElementToBeChecked(locator);
await expectElementToHaveText(locator, 'exact text');
await expectElementToContainText(locator, 'partial');
await expectPageToContainURL('/path');
await expectPageToHaveTitle('Page Title');
// Soft assertion: { soft: true } — test continues on failure
```

### PageUtils — Navigation & Storage

```typescript
await navigateToURL('/path');                  // Relative to BASE_URL
await reloadPage();
const url = getPage().url();
await waitForPageLoadState({ waitUntil: 'networkidle' });
await saveStorageState('path/to/auth.json');
```

---

## Test Data Pattern

Live in `src/tests/testdata/`. Export typed arrays and consume via `for...of` loops:

```typescript
// src/tests/testdata/plp-test-data.ts
export interface Product {
  name: string;
  searchTerm: string;
  expectResults: boolean;
}

export const validProducts: Product[] = [
  { name: 'MacBook', searchTerm: 'Mac book', expectResults: true },
  { name: 'iPhone', searchTerm: 'iPhone', expectResults: true },
  // ...
];
```

---

## Environment Variables

Defined in `.env` (gitignored). Loaded via `dotenv` at the top of `playwright.config.ts`.

```
BASE_URL=https://ecommerce-playground.lambdatest.io/
USER_EMAIL=...
USER_PASSWORD=...
```

---

## Running Tests

```bash
npx playwright test                                  # All tests
npx playwright test --project=chromium               # Chromium only
npx playwright test --grep @smoke                    # By tag
npx playwright test src/tests/specs/foo.spec.ts      # Single file
npx playwright test --headed                         # Headed mode
npx playwright test --list                           # List without running
npx playwright show-report                           # Open HTML report
```

The `login-setup` project runs first as a dependency of `chromium` and saves
storage state to `/storage-state/<username>.json`.

---

## Key Design Rules

1. **Never use Playwright's native `test`** — always import from `#pagesetup`.
2. **No classes** in page objects — export plain `async function` only.
3. **All page functions must be `async`** and return `Promise<void>` (or typed value).
4. **Use utility functions** — never call `page.click()` directly in page objects or specs.
5. **Locator strategy priority**: `data-testid` > `data-*` > `id` > `name` > XPath > CSS > role/text.
6. **Locator constants** at the top of each page file, UPPER_SNAKE_CASE.
7. **One test per behaviour** — keep specs focused and readable.
8. **Tag test suites** with `@smoke`, `@regression`, or feature tags.
9. **Soft assertions** only when the test must continue after a non-critical check.
10. **Use `stable: true`** for elements that animate before interaction.
11. **One page object file per page** — never mix two pages in one file.
12. **Parameterise with test data** from `#testdata/*` instead of hardcoding.
13. **Never introduce relative imports** — always use `#` aliases.
14. **Run tests 3× before declaring success** — see Critical Rules above.
