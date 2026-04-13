# Page Utils Reference

Source: `src/main/utils/page-utils.ts`

## Overview

Page utils provide functions for navigation, page management, multi-tab handling, and wait states. The module manages a global `page` reference that must be set via `setPage(page)` before use.

## Page Setup

### `setPage(pageInstance: Page): void`

Sets the global page instance. **Must be called before using any utilities.** This is handled automatically by the `page-setup.ts` test fixture.

### `getPage(): Page`

Returns the current global page instance.

### `getContext(): BrowserContext`

Returns the browser context of the current page.

### `getAllPages(): Page[]`

Returns all pages (tabs) in the current browser context.

## Navigation

### `navigateToURL(path: string, options?: GoToOptions): Promise<Response | null>`

Navigates to a URL. Uses `getDefaultLoadState()` as the default `waitUntil` option.

```typescript
await navigateToURL('/products');                           // Relative to BASE_URL
await navigateToURL('https://example.com');                 // Absolute URL
await navigateToURL('/login', { waitUntil: 'networkidle' }); // Custom wait
```

### `reloadPage(options?: NavigationOptions): Promise<void>`

Reloads the page, waits for `framenavigated` event and load state.

### `goBack(options?: NavigationOptions): Promise<void>`

Navigates back, waits for `framenavigated` event and load state.

### `getURL(options?: NavigationOptions): Promise<string>`

Returns the current page URL after waiting for load state. Returns `''` on error.

## Multi-Tab Management

### `switchPage(winNum: number, options?: SwitchPageOptions): Promise<void>`

Switches to a page by its 1-based index. Waits for the page to appear (polling) and for its load state.

```typescript
await switchPage(2);                                       // Switch to second tab
await switchPage(2, { loadState: 'networkidle' });         // With custom load state
```

### `switchToDefaultPage(): Promise<void>`

Switches back to the first page (tab) and brings it to front.

### `closePage(winNum?: number): Promise<void>`

Closes a page by its 1-based index. If no index provided, closes the current page. After closing, switches to the default page.

```typescript
await closePage();                                         // Close current tab
await closePage(2);                                        // Close second tab
```

## Wait / State

### `wait(ms: number): Promise<void>`

Waits for the specified number of milliseconds. Use sparingly — prefer explicit waits.

### `waitForPageLoadState(options?: NavigationOptions): Promise<void>`

Waits for the page to reach the specified load state (defaults to `getDefaultLoadState()`).

### `waitForNavigationEvent(options?: NavigationOptions): Promise<void>`

Waits for a `framenavigated` event on the page.

## Settings

### `getDefaultLoadState(): WaitForLoadStateOptions`

Returns the current default load state. Initial value: `'domcontentloaded'`.

### `setDefaultLoadState(value: WaitForLoadStateOptions): void`

Sets the default load state used by navigation functions.

```typescript
setDefaultLoadState('networkidle');                        // Wait for no network activity
setDefaultLoadState('domcontentloaded');                   // Wait for DOM ready (default)
setDefaultLoadState('load');                               // Wait for full page load
```

### `setDefaultLocatorFilterVisibility(value: boolean): void`

Sets whether locators filter to visible elements by default.

```typescript
setDefaultLocatorFilterVisibility(true);                   // Only visible elements (default)
setDefaultLocatorFilterVisibility(false);                  // Include hidden elements
```

## Storage

### `saveStorageState(path?: string): Promise<StorageState>`

Saves cookies and localStorage to a file. Useful for reusing auth state across tests.

```typescript
await saveStorageState('auth.json');                       // Save to file
```

## Window

### `getWindowSize(): Promise<{ width: number; height: number }>`

Returns the current browser viewport dimensions.

## Option Types

```typescript
type WaitForLoadStateOptions = 'load' | 'domcontentloaded' | 'networkidle';
type NavigationOptions = { waitUntil?: WaitForLoadStateOptions | 'commit'; timeout?: number };
type GoToOptions = PlaywrightGoToOptions;
type SwitchPageOptions = { timeout?: number; loadState?: WaitForLoadStateOptions };
```
