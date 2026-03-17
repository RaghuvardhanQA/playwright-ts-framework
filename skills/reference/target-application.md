# Target Application Reference

**Site**: [LambdaTest Ecommerce Playground](https://ecommerce-playground.lambdatest.com)
**Type**: OpenCart-based e-commerce platform
**Base URL**: `https://ecommerce-playground.lambdatest.com`

## URL Routes

| Page              | URL / Route                                                  |
|-------------------|--------------------------------------------------------------|
| Home              | `/`                                                          |
| Login             | `/index.php?route=account/login`                             |
| Register          | `/index.php?route=account/register`                          |
| My Account        | `/index.php?route=account/account`                           |
| Logout            | `/index.php?route=account/logout`                            |
| Search Results    | `/index.php?route=product/search&search=<term>`              |
| Product Category  | `/index.php?route=product/category&path=<id>`                |
| Product Detail    | `/index.php?route=product/product&product_id=<id>`           |
| Shopping Cart     | `/index.php?route=checkout/cart`                             |
| Checkout          | `/index.php?route=checkout/checkout`                         |
| Order Success     | `/index.php?route=checkout/success`                          |
| Order History     | `/index.php?route=account/order`                             |
| Wishlist          | `/index.php?route=account/wishlist`                          |
| Compare           | `/index.php?route=product/compare`                           |
| Contact Us        | `/index.php?route=information/contact`                       |

## Key User Flows

1. **User Registration** — Register with name, email, password, confirm password
2. **User Login / Logout** — Login with credentials, verify account dashboard, logout
3. **Product Search** — Search by keyword, verify results, filter/sort
4. **Browse by Category** — Navigate categories from top nav
5. **Product Detail** — View product, select options (size/color/qty), add to cart
6. **Shopping Cart** — Add/remove items, update quantities, verify totals
7. **Checkout Flow** — Guest or logged-in checkout, fill address, select shipping/payment, place order
8. **Wishlist** — Add product to wishlist, verify, remove
9. **Product Compare** — Add products to compare, view comparison table
10. **My Account** — Update profile, manage addresses, view order history

## Common Selectors

```typescript
// Navigation
const SEARCH_INPUT       = 'input[name="search"]';
const SEARCH_BTN         = '.btn.btn-default.btn-lg';
const NAV_MENU           = '#narbar-menu';
const CART_BTN           = '#cart > button';
const MY_ACCOUNT_LINK    = '//span[text()="My account"]';

// Auth pages
const EMAIL_INPUT        = '#input-email';
const PASSWORD_INPUT     = '#input-password';
const LOGIN_BTN          = '//input[@value="Login"]';
const REGISTER_LINK      = '//a[normalize-space()="Register"]';
const FIRSTNAME_INPUT    = '#input-firstname';
const LASTNAME_INPUT     = '#input-lastname';
const CONFIRM_PWD_INPUT  = '#input-confirm';
const AGREE_CHECKBOX     = 'input[name="agree"]';
const CONTINUE_BTN       = '//input[@value="Continue"]';

// Product listing
const PRODUCT_CARDS      = '.product-thumb';
const PRODUCT_NAME       = '.product-thumb h4 a';
const ADD_TO_CART_BTN    = '//button[@title="Add to Cart"]';
const ADD_TO_WISHLIST_BTN = '//button[@title="Add to Wish List"]';
const ADD_TO_COMPARE_BTN = '//button[@title="Compare this Product"]';

// Product detail
const PRODUCT_TITLE      = '//h1[contains(@class,"product-title") or @itemprop="name"]';
const QUANTITY_INPUT     = '#input-quantity';
const CART_ADD_BTN       = '#button-cart';

// Cart
const CART_TABLE         = '#shopping-cart';
const CART_TOTAL         = '.table-bordered tfoot';
const REMOVE_ITEM_BTN    = '.btn-danger';
const CHECKOUT_BTN       = '//a[normalize-space()="Checkout"]';

// Checkout
const BILLING_FIRSTNAME  = '#input-payment-firstname';
const BILLING_LASTNAME   = '#input-payment-lastname';
const BILLING_ADDRESS    = '#input-payment-address-1';
const BILLING_CITY       = '#input-payment-city';
const BILLING_POSTCODE   = '#input-payment-postcode';
const BILLING_COUNTRY    = '#input-payment-country';
const BILLING_STATE      = '#input-payment-zone';
const CONFIRM_ORDER_BTN  = '#button-confirm';
```
