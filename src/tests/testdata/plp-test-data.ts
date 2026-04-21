/**
 * Test data for PLP (Product Listing Page) validation tests.
 *
 * Each product entry represents a search term and the expected behaviour
 * when that term is used on the LambdaTest Ecommerce Playground.
 *
 * Usage in specs:
 *   import { searchProducts, sortOptions, Product } from '#testdata/plp-test-data';
 *   for (const product of searchProducts) { ... }
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Product {
  /** Name used for the test title */
  name: string;
  /** The keyword typed into the search box */
  searchTerm: string;
  /** Whether the search is expected to return results */
  expectResults: boolean;
}

export interface SortOption {
  /** Display label shown in the Sort-By dropdown */
  label: string;
}

export interface User {
  /** Identifier used in storage-state file paths */
  username: string;
}

/**
 * Represents a product used in add-to-cart test scenarios.
 * Only products with no minimum-quantity restriction and confirmed in-stock
 * status should appear in this array.
 */
export interface CartProduct {
  /** Display name as it appears on the site (used in toast and cart assertions) */
  name: string;
  /** OpenCart product_id query parameter value */
  productId: number;
  /** Unit price as shown on the PDP and in the cart unit-price column (pre-tax) */
  expectedPrice: string;
  /** Search term used when testing add-from-PLP quick-add button */
  searchTerm: string;
}

// ── Product search data ────────────────────────────────────────────────────────

export const macBook: Product = {
  name: 'MacBook',
  searchTerm: 'Mac book',
  expectResults: true,
};

export const iPhone: Product = {
  name: 'iPhone',
  searchTerm: 'iPhone',
  expectResults: true,
};

export const samsung: Product = {
  name: 'Samsung',
  searchTerm: 'Samsung',
  expectResults: true,
};

export const htcTouch: Product = {
  name: 'HTC Touch',
  searchTerm: 'HTC',
  expectResults: true,
};

export const palm: Product = {
  name: 'Palm Treo Pro',
  searchTerm: 'Palm',
  expectResults: true,
};

export const invalidProduct: Product = {
  name: 'Non-existent product',
  searchTerm: 'xyznonexistent12345',
  expectResults: false,
};

/** Products expected to return search results — used for parameterised positive tests */
export const validProducts: Product[] = [macBook, iPhone, samsung, htcTouch, palm];

/** Products expected to return no results — used for negative tests */
export const invalidProducts: Product[] = [invalidProduct];

/** All products combined */
export const allProducts: Product[] = [...validProducts, ...invalidProducts];

// ── Sort options ───────────────────────────────────────────────────────────────

export const sortOptions: SortOption[] = [
  { label: 'Price (Low > High)' },
  { label: 'Price (High > Low)' },
  { label: 'Name (A - Z)' },
  { label: 'Name (Z - A)' },
  { label: 'Rating (Highest)' },
  { label: 'Rating (Lowest)' },
];

// ── User data ──────────────────────────────────────────────────────────────────

export const defaultUser: User = {
  username: 'default',
};

// ── Cart products ──────────────────────────────────────────────────────────────
// Only products with no minimum-quantity restriction and confirmed in-stock status.
// product_id=47 (HP LP3065) and product_id=30 (Canon EOS 5D) both have qty default=1
// and no min-qty restriction. Products 40–43 require minimum quantity=2 and must NOT
// appear here — they belong to the negative test data only.

export const cartProducts: CartProduct[] = [
  {
    name: 'HP LP3065',
    productId: 47,
    expectedPrice: '$122.00',
    searchTerm: 'HP LP3065',
  },
  {
    // Canon EOS 5D (product_id=30) requires mandatory "Size" option selection before
    // add-to-cart, so it cannot be added without UI option interaction.
    // iPod Nano (product_id=57) has no options, is in stock, and adds cleanly.
    name: 'iPod Nano',
    productId: 57,
    expectedPrice: '$122.00',
    searchTerm: 'iPod Nano',
  },
];
