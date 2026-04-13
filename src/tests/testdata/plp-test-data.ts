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
