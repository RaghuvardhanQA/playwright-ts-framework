# Key Design Rules

1. **Never use Playwright's native `test`** — always import from `page-setup.ts`
2. **No classes** in page objects — export plain `async function` only
3. **All page functions must be `async`** and return `Promise<void>` (or typed value)
4. **Use utility functions** (`ActionUtils`, `ElementUtils`, etc.) — never call `page.click()` directly in page objects or specs
5. **Prefer XPath for complex selectors**, CSS for simple ones
6. **Locator selectors** stay as constants at the top of each page file
7. **One test per behaviour** — keep specs focused and readable
8. **Tag test suites** with `@smoke`, `@regression`, or feature tags
9. **Soft assertions** only when the test must continue after a non-critical check
10. **Use `stable: true`** option for elements that animate or transition before interaction
11. **One page object file per page** — every distinct page gets its own `*-page.ts` file
12. **No helper functions inside spec files** — any reusable logic (composite flows, multi-step setups) belongs in the corresponding page object file as an exported `async function`. Specs should only orchestrate page-object calls and assertions, never define local `async function` helpers.
13. **No deep-link URL navigation in page objects or specs** — do not call `navigateToURL('/index.php?route=...')` to jump straight to a PDP, cart, search results, or any inner page. Land on `/` (or use `navigateToBaseURL()`) and reach inner pages through real UI interactions: header search, clicking a product card, clicking the cart icon, clicking "View Cart" in the toast, etc. Deep-linking bypasses the navigation behaviours real users hit and hides regressions.
14. **Prefer `getVisibleLocator` over the jQuery `:visible` pseudo** — Playwright does not support `:visible` reliably as a CSS pseudo-class. Use `getVisibleLocator(selector)` (or `locator.and(page.locator(':visible'))` via the helper) so the visibility filter is baked into the locator before it reaches `boundingBox()` / stability checks.
15. **Use `clickByJS` to bypass pointer-event interception** — when an element is covered by a hover overlay or animated wrapper (common on PLP product cards), a normal click times out with `subtree intercepts pointer events`. Switch to `clickByJS(locator)` rather than fighting the overlay.
