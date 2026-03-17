# ActionUtils — User Interactions

Import: `import * as ActionUtils from '@src/main/utils/action-utils';`

## Clicking

```typescript
await ActionUtils.click(locator);                        // Standard click
await ActionUtils.clickAndNavigate(locator);             // Click + wait for navigation
await ActionUtils.clickByJS(locator);                    // JS click (bypass overlays)
await ActionUtils.doubleClick(locator);
await ActionUtils.hover(locator);
```

## Typing

```typescript
await ActionUtils.fill(locator, 'text');                 // Clear + type
await ActionUtils.fillAndEnter(locator, 'text');         // Fill + press Enter
await ActionUtils.fillAndTab(locator, 'text');           // Fill + press Tab
await ActionUtils.pressSequentially(locator, 'text');    // Type char by char
```

## Dropdowns

```typescript
await ActionUtils.selectByValue(locator, 'value');
await ActionUtils.selectByText(locator, 'visible text');
await ActionUtils.selectByIndex(locator, 0);
```

## Checkboxes / Radio

```typescript
await ActionUtils.check(locator);
await ActionUtils.uncheck(locator);
```

## File Upload

```typescript
await ActionUtils.uploadFiles(locator, ['path/to/file']);
```

## Dialogs

```typescript
await ActionUtils.acceptAlert();
await ActionUtils.dismissAlert();
const msg = await ActionUtils.getAlertText();
```

## Stability Option

```typescript
// Waits for element to stop moving before acting
await ActionUtils.click(locator, { stable: true });
```
