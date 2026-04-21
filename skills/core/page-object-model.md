# Page Object Model (POM)

**File location**: `src/tests/pages/<feature-name>-page.ts`

Page objects are **plain async functions** (no class required). Export each action as a named async function. One file per page — never mix two pages in one file.

## Template

```typescript
// src/tests/pages/login-page.ts
import * as ActionUtils from '@src/main/utils/action-utils';
import * as ElementUtils from '@src/main/utils/element-utils';
import * as ExpectUtils from '@src/main/utils/expect-utils';
import * as PageUtils from '@src/main/utils/page-utils';

// --- Locators (constants at the top) ---
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

## Rules

1. **No classes** — export plain `async function` only
2. **All functions must be `async`** and return `Promise<void>` (or typed value)
3. **Use utility functions** — never call `page.click()` directly
4. **Prefer XPath for complex selectors**, CSS for simple ones
5. **Locator selectors as constants** at the top of each file
6. **One page object file per page** — search triggers in `my-account-page.ts`, but results live in `search-results-page.ts`
7. **Use `clickAndNavigate` when the click causes a page/URL change** (e.g. login button, product link, nav links). Use `click` for same-page interactions (e.g. filters, checkboxes, dropdowns)
8. **No deep-link URL navigation** — page objects must reach inner pages through real UI flows, not by deep-linking with `navigateToURL('/index.php?route=...')`. Examples:
   - To open a PDP: land on `/`, search via the header, click the matching product card. Don't call `navigateToURL('/index.php?route=product/product&product_id=47')`.
   - To open the cart: click the header cart icon and the "View Cart" link in the dropdown drawer. Don't call `navigateToURL('/index.php?route=checkout/cart')`.
   - To open search results: use the header search box on `/`. Don't deep-link to `/index.php?route=product/search&search=...`.
   - The only acceptable `navigateToURL` call is the entry point — typically `navigateToURL('/')` at the start of a flow.
9. **Composite flows belong in page objects, not specs** — if multiple tests need the same multi-step setup (e.g. "search → click card → add to cart → wait for toast"), expose it as a single exported `async function` on the page object that owns the *result* of the flow. Spec files must not define local `async function` helpers.
10. **Disambiguate duplicate cards with an optional id** — when several product cards share a name (e.g. multiple "iPod Nano" variants where one is out-of-stock), accept an optional `productId` parameter and filter on `h4 a[href*="product_id=<id>"]` so the right card is clicked.
