# PageUtils — Navigation & Page State

Import: `import * as PageUtils from '@src/main/utils/page-utils';`

## Navigation

```typescript
await PageUtils.navigateToURL('/path');                  // Relative to BASE_URL
await PageUtils.reloadPage();
await PageUtils.goBack();
const url = await PageUtils.getURL();
```

## Multi-Tab

```typescript
await PageUtils.switchPage(1);                           // Switch to tab index
await PageUtils.switchToDefaultPage();                   // Back to first tab
await PageUtils.closePage();
```

## Wait / State

```typescript
await PageUtils.wait(2000);                              // Wait ms
await PageUtils.waitForPageLoadState('networkidle');
await PageUtils.saveStorageState('auth.json');           // Save cookies/localStorage
```

## Settings

```typescript
PageUtils.setDefaultLoadState('domcontentloaded');
PageUtils.setDefaultLocatorFilterVisibility(true);       // Only interact with visible elements
```
