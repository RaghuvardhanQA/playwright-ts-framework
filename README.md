# Playwright TypeScript Framework

End-to-end test automation framework built with Playwright and TypeScript, targeting the [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.com). The framework follows the Page Object Model pattern and is designed to be readable, maintainable, and easy to extend.

---

## What's in here

The framework is built around a few core ideas:

- **Page Objects as plain functions** — no classes, no inheritance overhead. Each page gets its own file with exported async functions
- **Centralized utilities** — all Playwright interactions go through shared utils (`ActionUtils`, `ElementUtils`, `ExpectUtils`, `PageUtils`, `ApiUtils`). You never call `page.click()` directly in a test
- **Custom test fixture** — a thin wrapper around Playwright's `test` that wires up the page context automatically, so you don't pass `page` around everywhere
- **Winston logger** — structured logging during test runs for easier debugging
- **CI with sharding** — GitHub Actions splits tests across 3 parallel runners and merges the HTML reports at the end

---

## Project Structure

```
src/
├── main/
│   ├── resources/
│   │   ├── constants/timeouts.ts          # All timeout values in one place
│   │   ├── parameters/optional-parameters.ts
│   │   └── setup/
│   │       ├── custom-logger.ts           # Winston logger setup
│   │       └── page-setup.ts             # Custom test fixture
│   └── utils/
│       ├── action-utils.ts               # Click, fill, select, upload, dialogs
│       ├── api-utils.ts                  # GET, POST, PUT, DELETE via page.request
│       ├── element-utils.ts              # Locators, waits, state checks
│       ├── expect-utils.ts               # Assertions
│       └── page-utils.ts                 # Navigation, tabs, load states
└── tests/
    ├── pages/                            # One file per page of the app
    ├── specs/                            # Test files
    └── data/                             # JSON test data
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/RaghuvardhanQA/playwright-ts-framework.git
cd playwright-ts-framework
npm install
npx playwright install chromium
```

### Set up environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```
BASE_URL=https://ecommerce-playground.lambdatest.io
USER_EMAIL=your@email.com
USER_PASSWORD=yourpassword
```

---

## Running Tests

```bash
# Run everything
npx playwright test

# Chromium only
npx playwright test --project=chromium

# Smoke tests only
npx playwright test --grep @smoke

# A specific file
npx playwright test src/tests/specs/plp-validation.spec.ts

# Headed mode (watch the browser)
npx playwright test --headed

# Open the HTML report after a run
npx playwright show-report
```

---

## Writing a New Test

**1. Create a page object** in `src/tests/pages/`:

```typescript
// src/tests/pages/cart-page.ts
import { clickAndNavigate } from '../../main/utils/action-utils';
import { getLocator } from '../../main/utils/element-utils';
import { expectElementToBeVisible } from '../../main/utils/expect-utils';

const CART_TABLE   = '#shopping-cart';
const CHECKOUT_BTN = '//a[normalize-space()="Checkout"]';

export async function verifyCartIsDisplayed(): Promise<void> {
  await expectElementToBeVisible(getLocator(CART_TABLE));
}

export async function clickCheckout(): Promise<void> {
  await clickAndNavigate(getLocator(CHECKOUT_BTN));
}
```

**2. Write the spec** in `src/tests/specs/`:

```typescript
// src/tests/specs/cart-flow.spec.ts
import { test } from '../../main/resources/setup/page-setup';
import * as CartPage from '../pages/cart-page';

test.describe('Cart @smoke', () => {
  test('User can view cart and proceed to checkout', async () => {
    await CartPage.verifyCartIsDisplayed();
    await CartPage.clickCheckout();
  });
});
```

A few things worth noting:
- Import `test` from `page-setup`, not directly from `@playwright/test`
- One page object file per page — don't mix two pages in one file
- Locator strings go as constants at the top of each file

---

## Utilities Quick Reference

| Utility | What it does |
|---------|-------------|
| `ActionUtils.click(locator)` | Standard click |
| `ActionUtils.clickAndNavigate(locator)` | Click and wait for navigation |
| `ActionUtils.fill(locator, text)` | Clear and type |
| `ActionUtils.selectByText(locator, text)` | Dropdown selection by visible text |
| `ElementUtils.getLocator(selector)` | Get a locator by CSS or XPath |
| `ElementUtils.getLocator(selector, { hasText: 'x' })` | Filtered locator |
| `ElementUtils.waitForElementToBeVisible(locator)` | Explicit wait |
| `ExpectUtils.expectElementToBeVisible(locator)` | Assert visible |
| `ExpectUtils.expectElementToContainText(locator, text)` | Assert text content |
| `ExpectUtils.expectPageToHaveURL(path)` | Assert current URL |
| `PageUtils.navigateToURL(path)` | Navigate relative to BASE_URL |
| `ApiUtils.getRequest(url)` | HTTP GET |
| `ApiUtils.postRequest(url, { data })` | HTTP POST |

Full docs in [`skills/`](skills/) — broken down by utility, pattern, and use case.

---

## CI / CD

Tests run on every push and pull request to `main` via GitHub Actions. The job matrix splits tests across **3 shards** running in parallel, then merges the results into a single HTML report.

To configure on a fork:
1. Go to **Settings → Secrets and variables → Actions**
2. Add `USER_EMAIL` and `USER_PASSWORD` as repository secrets

`BASE_URL` is set directly in the workflow — no secret needed for it.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev) | ^1.58 | Browser automation |
| TypeScript | ^5.9 | Type safety |
| Winston | — | Test run logging |
| dotenv | ^17 | Environment config |
| GitHub Actions | — | CI with parallel sharding |
