# Playwright TypeScript Framework

End-to-end test automation framework built with Playwright and TypeScript, targeting the [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.com). The framework follows the Page Object Model pattern and is designed to be readable, maintainable, and easy to extend.

## What's in here

The framework is built around a few core ideas:

- **Page Objects as plain functions** — no classes, no inheritance overhead. Each page gets its own file with exported async functions
- **Centralized utilities** — all Playwright interactions go through shared utils (`ActionUtils`, `ElementUtils`, `ExpectUtils`, `PageUtils`, `ApiUtils`). You never call `page.click()` directly in a test
- **Custom test fixture** — a thin wrapper around Playwright's `test` that wires up the page context automatically, so you don't pass `page` around everywhere
- **Storage state** — login is performed once per session and saved to disk; subsequent tests reuse the saved auth state with auto-login fallback if the session expires
- **Parameterised tests** — test data is centralised in `src/tests/testdata/` and looped over to generate multiple test cases from a single spec
- **TypeScript path aliases** — short imports like `#pages/login-page` instead of deep relative paths
- **Winston logger** — structured logging during test runs for easier debugging
- **CI with sharding** — GitHub Actions splits tests across 3 parallel runners and merges the HTML reports at the end

---

## Project Structure

```
src/
├── main/
│   ├── resources/
│   │   ├── constants/timeouts.ts              # All timeout values in one place
│   │   ├── parameters/optional-parameters.ts
│   │   └── setup/
│   │       ├── custom-logger.ts               # Winston logger setup
│   │       └── page-setup.ts                  # Custom test fixture
│   └── utils/
│       ├── action-utils.ts                    # Click, fill, select, upload, dialogs
│       ├── api-utils.ts                       # GET, POST, PUT, DELETE via page.request
│       ├── element-utils.ts                   # Locators, waits, state checks
│       ├── expect-utils.ts                    # Assertions
│       └── page-utils.ts                      # Navigation, tabs, load states, storage state
└── tests/
    ├── pages/                                 # One file per page of the app
    ├── specs/                                 # Test files
    │   ├── plp-validation.spec.ts             # Original full UI login tests
    │   ├── plp-with-storage-state.spec.ts     # Tests using saved auth state
    │   └── plp-without-storage-state.spec.ts  # Tests with full UI login (parameterised)
    ├── storage-setup/                         # Auth state management
    │   ├── login-storage-setup.ts             # Playwright setup project — saves login state
    │   ├── cookie-utils.ts                    # Session validation & path helpers
    │   └── session-types.ts                   # User type definitions
    └── testdata/                              # Centralised test data
        └── plp-test-data.ts                   # Products, sort options, users
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
# Run everything (login-setup runs first automatically)
npx playwright test

# Chromium only
npx playwright test --project=chromium

# Smoke tests only
npx playwright test --grep @smoke

# A specific file
npx playwright test src/tests/specs/plp-with-storage-state.spec.ts

# Headed mode (watch the browser)
npx playwright test --headed

# Debug mode — opens Playwright Inspector on page.pause()
npx playwright test --headed --debug

# Open the HTML report after a run
npx playwright show-report
```

---

## Storage State (Auth Reuse)

The `login-setup` project runs before `chromium` tests and saves auth state to disk:

```
src/tests/storage-state/
└── user-default.json     # Saved cookies + localStorage for the default user
```

- If the stored session is **still valid**, setup is skipped automatically
- If it has **expired**, a fresh login is performed and the file is overwritten
- Tests in `plp-with-storage-state.spec.ts` use the saved auth state; if the session expired mid-run, they fall back to a fresh login inline

To add more users, extend the `validUsers` array in `login-storage-setup.ts`.

---

## Writing a New Test

**1. Create a page object** in `src/tests/pages/`:

```typescript
// src/tests/pages/cart-page.ts
import { clickAndNavigate } from '#utils/action-utils';
import { getLocator } from '#utils/element-utils';
import { expectElementToBeVisible } from '#utils/expect-utils';

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
import { test } from '#pagesetup';
import * as CartPage from '#pages/cart-page';

test.describe('Cart @smoke', () => {
  test('User can view cart and proceed to checkout', async () => {
    await CartPage.verifyCartIsDisplayed();
    await CartPage.clickCheckout();
  });
});
```

A few things worth noting:
- Import `test` from `#pagesetup`, not directly from `@playwright/test`
- Use path aliases (`#pages/`, `#utils/`, `#pagesetup`) — no more deep relative paths
- One page object file per page — don't mix two pages in one file
- Locator strings go as constants at the top of each file
- Use `clickAndNavigate` when the click causes a page/URL change; use `click` for same-page interactions (filters, checkboxes, dropdowns)

---

## Utilities Quick Reference

| Utility | What it does |
|---------|-------------|
| `ActionUtils.click(locator)` | Same-page click (filters, checkboxes, dropdowns) |
| `ActionUtils.clickAndNavigate(locator)` | Click that causes a page/URL change |
| `ActionUtils.fill(locator, text)` | Clear and type |
| `ActionUtils.selectByText(locator, text)` | Dropdown selection by visible text |
| `ElementUtils.getLocator(selector)` | Get a locator by CSS or XPath |
| `ElementUtils.getLocator(selector, { hasText: 'x' })` | Filtered locator |
| `ElementUtils.waitForElementToBeVisible(locator)` | Explicit wait |
| `ExpectUtils.expectElementToBeVisible(locator)` | Assert visible |
| `ExpectUtils.expectElementToContainText(locator, text)` | Assert text content |
| `ExpectUtils.expectPageToHaveURL(path)` | Assert current URL |
| `PageUtils.navigateToURL(path)` | Navigate relative to BASE_URL |
| `PageUtils.waitForNavigationEvent()` | Wait for `framenavigated` event |
| `PageUtils.saveStorageState(path)` | Save cookies + localStorage to disk |
| `ApiUtils.getRequest(url)` | HTTP GET |
| `ApiUtils.postRequest(url, { data })` | HTTP POST |

Full docs in [`skills/`](skills/) — broken down by utility, pattern, and use case.

---

## Skills & AI Agent Support

This framework ships with a `SKILL.md` file that makes it natively usable by AI coding agents (Claude Code and others). The skill teaches the agent everything it needs to write, run, and debug tests in this repo without needing extra explanation.

### What the skill covers

| Category | Files |
|----------|-------|
| **Core patterns** | POM structure, spec pattern, design rules, project structure |
| **Utilities** | action-utils, element-utils, expect-utils, page-utils, api-utils |
| **Locator guidance** | Locator strategy, browser token optimisation |
| **Browser automation** | Playwright CLI — sessions, storage state, tracing, video, request mocking, test generation |
| **Target application** | URL routes, common selectors, key user flows |
| **CI/CD** | Running tests locally, GitHub Actions with sharding |

### Skills directory layout

```
skills/
├── core/
│   ├── design-rules.md          # Framework-wide conventions and rules
│   ├── page-object-model.md     # POM pattern and function structure
│   ├── project-structure.md     # Directory layout and import paths
│   └── test-spec-pattern.md     # How to write describe/test blocks
├── utils/
│   ├── action-utils.md          # click, fill, select, upload, dialogs
│   ├── element-utils.md         # getLocator, waits, state checks
│   ├── expect-utils.md          # assertions
│   ├── page-utils.md            # navigation, storage state, load states
│   ├── api-utils.md             # HTTP requests
│   ├── locator-strategy.md      # Choosing the right locator
│   └── browser-strategy.md      # Minimising browser token usage
├── reference/
│   └── target-application.md    # Site URLs, selectors, user flows
├── playwright-cli/
│   ├── SKILL.md                 # Playwright CLI quick start
│   └── references/
│       ├── request-mocking.md
│       ├── running-code.md
│       ├── session-management.md
│       ├── storage-state.md
│       ├── test-generation.md
│       ├── tracing.md
│       └── video-recording.md
└── ci-cd/
    └── running-tests.md         # Local run commands and GitHub Actions setup
```

### Test validation loop (for agents)

When an agent writes or modifies tests it must follow this loop before committing:

1. Write the page object and spec
2. Run `npx playwright test <spec> --project=chromium --reporter=line`
3. Review failures — use `--headed` or trace viewer for visual debugging
4. Fix and re-run
5. **Run 3 times** for stability verification before committing

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
| TypeScript | ^5.9 | Type safety, path aliases |
| Winston | — | Test run logging |
| dotenv | ^17 | Environment config |
| GitHub Actions | — | CI with parallel sharding |
