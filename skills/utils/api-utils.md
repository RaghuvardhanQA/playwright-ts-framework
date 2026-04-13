# API Utils Reference

Source: `src/main/utils/api-utils.ts`

## Overview

API utils provide HTTP request functions using Playwright's built-in `page.request` context. Requests share the browser's cookies and auth state — no extra HTTP client needed.

## Getting the Context

### `getAPIRequestContext(): APIRequestContext`

Returns the Playwright `APIRequestContext` from the current page. All request functions use this internally.

## Request Methods

### `getRequest(url: string, options?): Promise<APIResponse>`

Sends a GET request.

```typescript
const response = await getRequest('/api/products');
const response = await getRequest('/api/user', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### `postRequest(url: string, options?): Promise<APIResponse>`

Sends a POST request.

```typescript
const response = await postRequest('/api/login', {
  data: { email: 'user@test.com', password: 'secret' }
});
```

### `putRequest(url: string, options?): Promise<APIResponse>`

Sends a PUT request.

```typescript
const response = await putRequest('/api/user/1', {
  data: { name: 'Updated Name' }
});
```

### `deleteRequest(url: string, options?): Promise<APIResponse>`

Sends a DELETE request.

```typescript
const response = await deleteRequest('/api/cart/item/5');
```

## Working with Responses

```typescript
const status = response.status();               // e.g. 200
const body   = await response.json();           // Parse JSON body
const text   = await response.text();           // Raw text body
const ok     = response.ok();                   // true if status 200-299
```

## Common Use Cases

```typescript
// Seed data before a test via API
test.beforeEach(async () => {
  const res = await postRequest('/api/cart/clear', {
    data: { userId: process.env.USER_ID }
  });
  expect(res.ok()).toBeTruthy();
});

// Verify backend state after UI action
test('Adding to cart updates cart API', async () => {
  await CartPage.clickAddToCart();
  const res  = await getRequest('/api/cart');
  const cart = await res.json();
  expect(cart.items.length).toBe(1);
});
```

## Option Types

All options match Playwright's native `APIRequestContext` method signatures:

```typescript
type GetOptions = Parameters<APIRequestContext['get']>[1];
type PostOptions = Parameters<APIRequestContext['post']>[1];
type PutOptions = Parameters<APIRequestContext['put']>[1];
type DeleteOptions = Parameters<APIRequestContext['delete']>[1];
```

Common option fields: `data`, `headers`, `params`, `form`, `multipart`, `timeout`.
