# ExpectUtils — Assertions

Import: `import * as ExpectUtils from '@src/main/utils/expect-utils';`

## Visibility

```typescript
await ExpectUtils.expectElementToBeVisible(locator);
await ExpectUtils.expectElementToBeHidden(locator);
await ExpectUtils.expectElementToBeInViewport(locator);
```

## State

```typescript
await ExpectUtils.expectElementToBeChecked(locator);
await ExpectUtils.expectElementToBeDisabled(locator);
await ExpectUtils.expectElementToBeEditable(locator);
await ExpectUtils.expectElementToBeAttached(locator);
```

## Content

```typescript
await ExpectUtils.expectElementToHaveText(locator, 'exact text');
await ExpectUtils.expectElementToContainText(locator, 'partial');
await ExpectUtils.expectElementToHaveValue(locator, 'input value');
await ExpectUtils.expectElementToHaveAttribute(locator, 'attr', 'value');
```

## Page-Level

```typescript
await ExpectUtils.expectPageToHaveURL('/path');
await ExpectUtils.expectPageToContainURL('partial-path');
await ExpectUtils.expectPageToHaveTitle('Page Title');
```

## Dialogs

```typescript
await ExpectUtils.expectAlertToHaveText('Alert message');
```

## Soft Assertions

Non-blocking — test continues on failure. Pass `{ soft: true }` to any assertion:

```typescript
await ExpectUtils.expectElementToBeVisible(locator, { soft: true });
await ExpectUtils.expectElementToContainText(locator, 'text', { soft: true });
```
