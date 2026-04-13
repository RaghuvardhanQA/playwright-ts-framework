# Element Utils Reference

Source: `src/main/utils/element-utils.ts`

## Overview

Element utils provide functions for finding elements, extracting data, checking state, and waiting. All functions accept `string | Locator` as the `input` parameter.

## Locator Functions

### `getLocator(input: string | Locator, options?: LocatorOptions): Locator`

Core function. If `input` is a string, creates a locator via `page.locator(input)`. If `input` is already a Locator, returns it as-is. When `onlyVisible: true`, appends `:visible` filter.

### `getVisibleLocator(input: string | Locator, options?: LocatorOptions): Locator`

Same as `getLocator` but defaults to `onlyVisible: true`. This is what action functions use internally.

### `getLocatorByTestId(testId: string | RegExp, attributeName?: string): Locator`

Uses `page.getByTestId()`. Optionally sets a custom test ID attribute name via `selectors.setTestIdAttribute()`.

### `getLocatorByText(text: string | RegExp, options?: GetByTextOptions): Locator`

Uses `page.getByText()`. Finds elements by their text content.

### `getLocatorByRole(role: GetByRoleTypes, options?: GetByRoleOptions): Locator`

Uses `page.getByRole()`. Finds elements by ARIA role.

```typescript
const btn = getLocatorByRole('button', { name: 'Submit' });
const link = getLocatorByRole('link', { name: /learn more/i });
```

### `getLocatorByLabel(text: string | RegExp, options?: GetByRoleOptions): Locator`

Uses `page.getByLabel()`. Finds form elements by their associated label.

### `getLocatorByPlaceholder(text: string | RegExp, options?: GetByPlaceholderOptions): Locator`

Uses `page.getByPlaceholder()`. Finds input elements by placeholder text.

### `getAllLocators(input: string | Locator, options?): Promise<Locator[]>`

Returns all matching locators as an array. Waits for at least the first element to be attached before resolving.

Options include `waitForLocator?: boolean` (default `true`) and `timeout?: number`.

## Text Extraction

### `getText(input, options?: TimeoutOption): Promise<string>`

Returns trimmed `innerText` of the element.

### `getAllTexts(input, options?: LocatorWaitOptions): Promise<string[]>`

Returns trimmed `allInnerTexts()` of all matching elements.

### `getInputValue(input, options?: TimeoutOption): Promise<string>`

Returns trimmed input value of a form element.

### `getAllInputValues(input, options?: TimeoutOption): Promise<string[]>`

Returns input values of all matching form elements.

### `getAttribute(input, attributeName: string, options?: TimeoutOption): Promise<string | null>`

Returns trimmed attribute value, or `null` if not present.

## State Checks (return boolean)

### `isElementVisible(input, options?: TimeoutOption): Promise<boolean>`

Polls visibility until `true` or timeout. Returns `false` on timeout.

### `isElementHidden(input, options?: TimeoutOption): Promise<boolean>`

Polls hidden state until `true` or timeout. Returns `false` on timeout.

### `isElementChecked(input, options?: TimeoutOption): Promise<boolean>`

Returns `true` if element is visible and checked. Returns `false` otherwise.

### `isElementAttached(input, options?: TimeoutOption): Promise<boolean>`

Returns `true` if element is attached to DOM within timeout. Returns `false` otherwise.

## Wait Functions

### `waitForElementToBeVisible(input, options?: TimeoutOption): Promise<void>`

Waits until element is visible. Throws on timeout.

### `waitForElementToBeHidden(input, options?: TimeoutOption): Promise<void>`

Waits until element is hidden. Throws on timeout.

### `waitForElementToBeAttached(input, options?: TimeoutOption): Promise<void>`

Waits until element is attached to DOM. Throws on timeout.

### `waitForElementToBeDetached(input, options?: TimeoutOption): Promise<void>`

Waits until element is detached from DOM. Throws on timeout.

### `waitForElementToBeStabled(input, options?: TimeoutOption): Promise<boolean>`

Waits for element position to stop moving. Polls bounding box coordinates — requires 3 consecutive stable readings. Returns `true` if stable, `false` if max wait exceeded.

### `waitForFirstElementToBeAttached(input, options?: LocatorWaitOptions): Promise<void>`

Waits for the first matching element to be attached. Used internally by `getAllLocators`.

## Count

### `getLocatorCount(input, options?: LocatorWaitOptions): Promise<number>`

Returns the number of matching elements. Returns `0` on error.

## Frame Functions

### `getFrame(frameSelector: FrameOptions, options?): Frame | null`

Gets a Frame by name or URL. Throws if not found unless `{ force: true }`.

```typescript
const frame = getFrame({ name: 'my-iframe' });
const frame = getFrame({ url: /embed/ });
```

### `getFrameLocator(frameInput: string | FrameLocator): FrameLocator`

Gets a FrameLocator from a selector or existing FrameLocator.

### `getLocatorInFrame(frameInput, input): Locator`

Gets a locator for an element inside a frame.

```typescript
const btn = getLocatorInFrame('#my-iframe', '#submit-btn');
await click(btn); // Works with action utils
```

## Key Concept: Visible by Default

`getVisibleLocator()` (and by extension all action functions) filters to only visible elements by default. This prevents accidentally interacting with hidden duplicates.

```typescript
// Returns locator filtered to visible elements
const loc = getVisibleLocator('#submit');

// Equivalent to:
const loc = getLocator('#submit', { onlyVisible: true });

// To include hidden elements:
const loc = getLocator('#submit', { onlyVisible: false });
```

## Option Types

```typescript
type LocatorOptions = PlaywrightLocatorOptions & { onlyVisible?: boolean };
type LocatorWaitOptions = { waitForLocator?: boolean } & TimeoutOption;
type GetByTextOptions = PlaywrightGetByTextOptions & { onlyVisible?: boolean };
type GetByRoleTypes = PlaywrightGetByRoleTypes;
type GetByRoleOptions = PlaywrightGetByRoleOptions;
type GetByPlaceholderOptions = PlaywrightGetByPlaceholderOptions;
type FrameOptions = { name?: string; url?: string | RegExp };
```
