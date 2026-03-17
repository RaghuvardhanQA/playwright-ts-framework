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
