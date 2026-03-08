# Playwright TypeScript Framework — Claude Context

This is a Playwright + TypeScript end-to-end test automation framework targeting `https://ecommerce-playground.lambdatest.com`. It follows the **Page Object Model (POM)** pattern with centralized utilities, custom types, and a Winston logger.

---

## Target Application

**Site**: [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.com)
**Type**: OpenCart-based e-commerce platform (built for automation practice)
**Base URL**: `https://ecommerce-playground.lambdatest.com`

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
| Order Success     | `/index.php?route=checkout/success`                          |
| Order History     | `/index.php?route=account/order`                             |
| Wishlist          | `/index.php?route=account/wishlist`                          |
| Compare           | `/index.php?route=product/compare`                           |
| Contact Us        | `/index.php?route=information/contact`                       |

### Key User Flows to Automate

1. **User Registration** — Register with name, email, password, confirm password
2. **User Login / Logout** — Login with credentials, verify account dashboard, logout
3. **Product Search** — Search by keyword, verify results, filter/sort
4. **Browse by Category** — Navigate categories from top nav
5. **Product Detail** — View product, select options (size/color/qty), add to cart
6. **Shopping Cart** — Add/remove items, update quantities, verify totals
7. **Checkout Flow** — Guest or logged-in checkout, fill address, select shipping/payment, place order
8. **Wishlist** — Add product to wishlist, verify, remove
9. **Product Compare** — Add products to compare, view comparison table
10. **My Account** — Update profile, manage addresses, view order history

### Common Selectors Reference (OpenCart patterns)

```typescript
// Navigation
const SEARCH_INPUT       = 'input[name="search"]';
const SEARCH_BTN         = '.btn.btn-default.btn-lg';
const NAV_MENU           = '#narbar-menu'; // top nav
const CART_BTN           = '#cart > button';
const MY_ACCOUNT_LINK    = '//span[text()="My account"]';

// Auth pages
const EMAIL_INPUT        = '#input-email';
const PASSWORD_INPUT     = '#input-password';
const LOGIN_BTN          = '//input[@value="Login"]';
const REGISTER_LINK      = '//a[normalize-space()="Register"]';
const FIRSTNAME_INPUT    = '#input-firstname';
const LASTNAME_INPUT     = '#input-lastname';
const CONFIRM_PWD_INPUT  = '#input-confirm';
const AGREE_CHECKBOX     = 'input[name="agree"]';
const CONTINUE_BTN       = '//input[@value="Continue"]';

// Product listing
const PRODUCT_CARDS      = '.product-thumb';
const PRODUCT_NAME       = '.product-thumb h4 a';
const ADD_TO_CART_BTN    = '//button[@title="Add to Cart"]';
const ADD_TO_WISHLIST_BTN = '//button[@title="Add to Wish List"]';
const ADD_TO_COMPARE_BTN = '//button[@title="Compare this Product"]';

// Product detail
const PRODUCT_TITLE      = '//h1[contains(@class,"product-title") or @itemprop="name"]';
const QUANTITY_INPUT     = '#input-quantity';
const CART_ADD_BTN       = '#button-cart';

// Cart
const CART_TABLE         = '#shopping-cart';
const CART_TOTAL         = '.table-bordered tfoot';
const REMOVE_ITEM_BTN    = '.btn-danger';
const CHECKOUT_BTN       = '//a[normalize-space()="Checkout"]';

// Checkout
const BILLING_FIRSTNAME  = '#input-payment-firstname';
const BILLING_LASTNAME   = '#input-payment-lastname';
const BILLING_ADDRESS    = '#input-payment-address-1';
const BILLING_CITY       = '#input-payment-city';
const BILLING_POSTCODE   = '#input-payment-postcode';
const BILLING_COUNTRY    = '#input-payment-country';
const BILLING_STATE      = '#input-payment-zone';
const CONFIRM_ORDER_BTN  = '#button-confirm';
```

---

## Project Structure

```
src/
├── main/
│   ├── resources/
│   │   ├── constants/timeouts.ts          # Timeout constants
│   │   ├── parameters/optional-parameters.ts  # Custom option types
│   │   └── setup/
│   │       ├── custom-logger.ts           # Winston reporter
│   │       └── page-setup.ts             # Custom test fixture
│   └── utils/
│       ├── action-utils.ts               # Click, fill, hover, drag, dialogs
│       ├── element-utils.ts              # Locators, state checks, waits
│       ├── expect-utils.ts               # Assertions (visibility, text, state)
│       └── page-utils.ts                 # Navigation, tabs, page state
└── tests/
    ├── pages/                            # Page Object files — one file per page
    │   ├── landing-page.ts              # Home page
    │   ├── login-page.ts               # Login page
    │   ├── my-account-page.ts          # My Account dashboard + header search
    │   ├── search-results-page.ts      # Search results page (separate from search action)
    │   ├── register-page.ts            # Register page
    │   ├── product-page.ts             # Product detail page
    │   ├── cart-page.ts                # Cart page
    │   └── checkout-page.ts            # Checkout page
    ├── specs/                            # Test spec files (*.spec.ts)
    └── data/                             # Test data (JSON)
```

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
| Spec files       | `*.spec.ts`       | `checkout-flow.spec.ts`         |
| Tags             | `@tagname`        | `@smoke`, `@regression`         |

---

## Imports Reference

Always import from these paths:

```typescript
// Test fixture (use instead of Playwright's native `test`)
import { test } from '@src/main/resources/setup/page-setup';

// Utilities
import * as ActionUtils from '@src/main/utils/action-utils';
import * as ElementUtils from '@src/main/utils/element-utils';
import * as ExpectUtils from '@src/main/utils/expect-utils';
import * as PageUtils from '@src/main/utils/page-utils';

// Timeouts
import { TIMEOUTS } from '@src/main/resources/constants/timeouts';
// TIMEOUTS.INSTANT = 1000, SMALL = 5000, DEFAULT = 30000, LONG = 60000, VERY_LONG = 120000

// Custom option types
import {
  ClickOptions, FillOptions, HoverOptions, SelectOptions, ExpectOptions
} from '@src/main/resources/parameters/optional-parameters';
```

---

## Page Object Pattern

**File location**: `src/tests/pages/<feature-name>-page.ts`

Page objects are **plain async functions** (no class required). Export each action as a named async function.

```typescript
// src/tests/pages/login-page.ts
import * as ActionUtils from '@src/main/utils/action-utils';
import * as ElementUtils from '@src/main/utils/element-utils';
import * as ExpectUtils from '@src/main/utils/expect-utils';
import * as PageUtils from '@src/main/utils/page-utils';

// --- Locators ---
const EMAIL_INPUT    = '#input-email';
const PASSWORD_INPUT = '#input-password';
const LOGIN_BTN      = '//input[@value="Login"]';
const ACCOUNT_HEADER = '//h2[normalize-space()="My Account"]';

export async function navigateToLoginPage(): Promise<void> {
  await PageUtils.navigateToURL('/index.php?route=account/login');
}

export async function verifyLoginPageIsDisplayed(): Promise<void> {
  await ExpectUtils.expectPageToHaveURL('route=account/login');
}

export async function fillEmail(email: string): Promise<void> {
  await ActionUtils.fill(await ElementUtils.getLocator(EMAIL_INPUT), email);
}

export async function fillPassword(password: string): Promise<void> {
  await ActionUtils.fill(await ElementUtils.getLocator(PASSWORD_INPUT), password);
}

export async function clickLogin(): Promise<void> {
  await ActionUtils.clickAndNavigate(await ElementUtils.getLocator(LOGIN_BTN));
}

export async function verifyLoginSuccess(): Promise<void> {
  await ExpectUtils.expectElementToBeVisible(
    await ElementUtils.getLocator(ACCOUNT_HEADER)
  );
}
```

---

## Test Spec Pattern

**File location**: `src/tests/specs/<feature>-<flow>.spec.ts`

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

---

## Utility Cheat Sheet

### ActionUtils — Interactions

```typescript
// Clicking
await ActionUtils.click(locator);                        // Standard click
await ActionUtils.clickAndNavigate(locator);             // Click + wait for navigation
await ActionUtils.clickByJS(locator);                    // JS click (bypass overlays)
await ActionUtils.doubleClick(locator);
await ActionUtils.hover(locator);

// Typing
await ActionUtils.fill(locator, 'text');                 // Clear + type
await ActionUtils.fillAndEnter(locator, 'text');         // Fill + press Enter
await ActionUtils.fillAndTab(locator, 'text');           // Fill + press Tab
await ActionUtils.pressSequentially(locator, 'text');    // Type char by char

// Dropdowns
await ActionUtils.selectByValue(locator, 'value');
await ActionUtils.selectByText(locator, 'visible text');
await ActionUtils.selectByIndex(locator, 0);

// Checkboxes / Radio
await ActionUtils.check(locator);
await ActionUtils.uncheck(locator);

// File upload
await ActionUtils.uploadFiles(locator, ['path/to/file']);

// Dialogs
await ActionUtils.acceptAlert();
await ActionUtils.dismissAlert();
const msg = await ActionUtils.getAlertText();

// Stability option — waits for element to stop moving before acting
await ActionUtils.click(locator, { stable: true });
```

### ElementUtils — Locators & Waits

```typescript
// Get locators
const loc = await ElementUtils.getLocator('//xpath or css');
const loc = await ElementUtils.getVisibleLocator('css');           // Filters to visible
const loc = await ElementUtils.getLocatorByText('Submit');
const loc = await ElementUtils.getLocatorByRole('button', { name: 'Add' });
const loc = await ElementUtils.getLocatorByLabel('Email');
const loc = await ElementUtils.getLocatorByPlaceholder('Enter email');
const loc = await ElementUtils.getLocatorByTestId('submit-btn');

// Text extraction
const text  = await ElementUtils.getText(locator);
const texts = await ElementUtils.getAllTexts(locator);            // Array
const val   = await ElementUtils.getInputValue(locator);
const attr  = await ElementUtils.getAttribute(locator, 'href');

// State checks (return boolean)
const visible  = await ElementUtils.isElementVisible(locator);
const hidden   = await ElementUtils.isElementHidden(locator);
const checked  = await ElementUtils.isElementChecked(locator);
const attached = await ElementUtils.isElementAttached(locator);

// Waits
await ElementUtils.waitForElementToBeVisible(locator);
await ElementUtils.waitForElementToBeHidden(locator);
await ElementUtils.waitForElementToBeStabled(locator);           // Waits for position to stop moving

// Frames / iframes
const frame = await ElementUtils.getFrame('frame-name');
const frameLoc = await ElementUtils.getFrameLocator('iframe#id');
const locInFrame = await ElementUtils.getLocatorInFrame('iframe#id', 'button.submit');
```

### ExpectUtils — Assertions

```typescript
// Visibility
await ExpectUtils.expectElementToBeVisible(locator);
await ExpectUtils.expectElementToBeHidden(locator);
await ExpectUtils.expectElementToBeInViewport(locator);

// State
await ExpectUtils.expectElementToBeChecked(locator);
await ExpectUtils.expectElementToBeDisabled(locator);
await ExpectUtils.expectElementToBeEditable(locator);
await ExpectUtils.expectElementToBeAttached(locator);

// Content
await ExpectUtils.expectElementToHaveText(locator, 'exact text');
await ExpectUtils.expectElementToContainText(locator, 'partial');
await ExpectUtils.expectElementToHaveValue(locator, 'input value');
await ExpectUtils.expectElementToHaveAttribute(locator, 'attr', 'value');

// Page-level
await ExpectUtils.expectPageToHaveURL('/path');
await ExpectUtils.expectPageToHaveTitle('Page Title');

// Dialogs
await ExpectUtils.expectAlertToHaveText('Alert message');

// Soft assertions (non-blocking — test continues on failure)
await ExpectUtils.expectElementToBeVisible(locator, { soft: true });
```

### PageUtils — Navigation & Tabs

```typescript
await PageUtils.navigateToURL('/path');                  // Relative to BASE_URL
await PageUtils.reloadPage();
await PageUtils.goBack();
const url = await PageUtils.getURL();

// Multi-tab
await PageUtils.switchPage(1);                           // Switch to tab index
await PageUtils.switchToDefaultPage();                   // Back to first tab
await PageUtils.closePage();

// Wait / state
await PageUtils.wait(2000);                              // ms
await PageUtils.waitForPageLoadState('networkidle');
await PageUtils.saveStorageState('auth.json');           // Save cookies/localStorage

// Settings
PageUtils.setDefaultLoadState('domcontentloaded');
PageUtils.setDefaultLocatorFilterVisibility(true);       // Only interact with visible elements
```

---

## Environment Variables

Defined in `.env` (gitignored). Access via `process.env`:

```
BASE_URL=https://ecommerce-playground.lambdatest.com
USER_EMAIL=test@example.com
USER_PASSWORD=secret
```

---

## Running Tests

```bash
npx playwright test                           # All tests
npx playwright test --project=chromium        # Chromium only
npx playwright test --grep @smoke             # By tag
npx playwright test src/tests/specs/foo.spec.ts  # Single file
npx playwright test --headed                  # Headed mode
npx playwright show-report                    # Open HTML report
```

## After Creating or Modifying a Test

**Always run the spec file 3 times automatically** using `--reporter=line` to verify stability. Do not wait for the user to ask.

```bash
npx playwright test src/tests/specs/<file>.spec.ts --project=chromium --reporter=line
npx playwright test src/tests/specs/<file>.spec.ts --project=chromium --reporter=line
npx playwright test src/tests/specs/<file>.spec.ts --project=chromium --reporter=line
```

Report results as a table:

| Run | Result | Duration |
|-----|--------|----------|
| 1   | ✅ Passed / ❌ Failed | Xs |
| 2   | ✅ Passed / ❌ Failed | Xs |
| 3   | ✅ Passed / ❌ Failed | Xs |

---

## Key Design Rules

1. **Never use Playwright's native `test`** — always import from `page-setup.ts`.
2. **No classes** in page objects — export plain `async function` only.
3. **All page functions must be `async`** and return `Promise<void>` (or typed value).
4. **Use utility functions** (`ActionUtils`, `ElementUtils`, etc.) — never call `page.click()` directly in page objects or specs.
5. **Prefer XPath for complex selectors**, CSS for simple ones.
6. **Locator selectors** stay as constants at the top of each page file.
7. **One test per behaviour** — keep specs focused and readable.
8. **Tag test suites** with `@smoke`, `@regression`, or feature tags.
9. **Soft assertions** only when the test must continue after a non-critical check.
10. **Use `stable: true`** option for elements that animate or transition before interaction.
11. **One page object file per page** — every distinct page in the app gets its own `*-page.ts` file. Never mix two pages in one file. Example: search is triggered from `my-account-page.ts`, but results live in `search-results-page.ts` because the results load on a new page.
