# ApiUtils — HTTP Requests

Import: `import * as ApiUtils from '@src/main/utils/api-utils';`

Uses Playwright's built-in `page.request` context — no extra HTTP client needed. Requests share the browser's cookies and auth state.

## Methods

```typescript
// GET
const response = await ApiUtils.getRequest('/api/products');
const response = await ApiUtils.getRequest('/api/user', {
  headers: { Authorization: `Bearer ${token}` }
});

// POST
const response = await ApiUtils.postRequest('/api/login', {
  data: { email: 'user@test.com', password: 'secret' }
});

// PUT
const response = await ApiUtils.putRequest('/api/user/1', {
  data: { name: 'Updated Name' }
});

// DELETE
const response = await ApiUtils.deleteRequest('/api/cart/item/5');
```

## Working with Responses

```typescript
const status = response.status();                        // e.g. 200
const body   = await response.json();                    // Parse JSON body
const text   = await response.text();                    // Raw text body
const ok     = response.ok();                            // true if status 200-299
```

## Getting the Raw Context

```typescript
const context = ApiUtils.getAPIRequestContext();         // APIRequestContext
```

## Common Use Cases

```typescript
// Seed data before a test via API
test.beforeEach(async () => {
  const res = await ApiUtils.postRequest('/api/cart/clear', {
    data: { userId: process.env.USER_ID }
  });
  expect(res.ok()).toBeTruthy();
});

// Verify backend state after UI action
test('Adding to cart updates cart API', async () => {
  await CartPage.clickAddToCart();
  const res  = await ApiUtils.getRequest('/api/cart');
  const cart = await res.json();
  expect(cart.items.length).toBe(1);
});
```
