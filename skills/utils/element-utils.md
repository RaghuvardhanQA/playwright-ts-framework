# ElementUtils — Locators & Waits

Import: `import * as ElementUtils from '@src/main/utils/element-utils';`

## Getting Locators

```typescript
const loc = await ElementUtils.getLocator('//xpath or css');
const loc = await ElementUtils.getLocator('css', { hasText: 'label text' });
const loc = await ElementUtils.getVisibleLocator('css');           // Filters to visible only
const loc = await ElementUtils.getLocatorByText('Submit');
const loc = await ElementUtils.getLocatorByRole('button', { name: 'Add' });
const loc = await ElementUtils.getLocatorByLabel('Email');
const loc = await ElementUtils.getLocatorByPlaceholder('Enter email');
const loc = await ElementUtils.getLocatorByTestId('submit-btn');
```

## Text Extraction

```typescript
const text  = await ElementUtils.getText(locator);
const texts = await ElementUtils.getAllTexts(locator);            // Returns string[]
const val   = await ElementUtils.getInputValue(locator);
const attr  = await ElementUtils.getAttribute(locator, 'href');
```

## State Checks (return boolean)

```typescript
const visible  = await ElementUtils.isElementVisible(locator);
const hidden   = await ElementUtils.isElementHidden(locator);
const checked  = await ElementUtils.isElementChecked(locator);
const attached = await ElementUtils.isElementAttached(locator);
```

## Waits

```typescript
await ElementUtils.waitForElementToBeVisible(locator);
await ElementUtils.waitForElementToBeHidden(locator);
await ElementUtils.waitForElementToBeStabled(locator);           // Waits for position to stop moving
```

## Frames / iframes

```typescript
const frame    = await ElementUtils.getFrame('frame-name');
const frameLoc = await ElementUtils.getFrameLocator('iframe#id');
const locInFrame = await ElementUtils.getLocatorInFrame('iframe#id', 'button.submit');
```

## Count

```typescript
const count = await ElementUtils.getLocatorCount(locator);
```
