/**
 * PLP Validation — Uses Storage State with auto-login fallback
 *
 * Attempts to use saved auth state. If the server-side session has expired,
 * falls back to a fresh UI login within the same browser context.
 * Tests are parameterised using product test data for broader coverage.
 */
import * as LoginPage from '#pages/login-page';
import * as MyAccountPage from '#pages/my-account-page';
import * as ProductSearchPage from '#pages/product-search-page';
import * as ProductPage from '#pages/product-page';
import { test } from '#pagesetup';
import { navigateToURL, getPage, saveStorageState } from '#utils/page-utils';
import { getUserAuthPath } from '#storage-setup/cookie-utils';
import { defaultUser, validProducts, invalidProducts, sortOptions } from '#testdata/plp-test-data';

const storagePath = getUserAuthPath(defaultUser);

test.describe('PLP Validation — Parameterised Product Tests @smoke', () => {

  test.beforeEach('Navigate to My Account with auto-login fallback', async () => {
    await navigateToURL('/index.php?route=account/account');

    // If session expired and redirected to login, perform fresh login
    if (getPage().url().includes('account/login')) {
      await LoginPage.login();
      await saveStorageState(storagePath);
    }
    await MyAccountPage.validateMyAccountPage();
  });

  // ── Parameterised product search tests ─────────────────────────────────────
  for (const product of validProducts) {
    test(`Verify search results are displayed for "${product.name}"`, async () => {
      await MyAccountPage.searchForProduct(product.searchTerm);
      await ProductSearchPage.verifyProductResultsAreDisplayed();
    });
  }

  // ── Parameterised negative search tests ────────────────────────────────────
  for (const product of invalidProducts) {
    test(`Verify no results message for "${product.name}"`, async () => {
      await MyAccountPage.searchForProduct(product.searchTerm);
      await ProductSearchPage.verifyNoResultsMessageIsDisplayed();
    });
  }

  // ── Parameterised sort option tests ────────────────────────────────────────
  for (const option of sortOptions) {
    test(`Verify sort option "${option.label}" works correctly`, async () => {
      await MyAccountPage.searchForProduct(validProducts[0].searchTerm);
      await ProductSearchPage.verifyProductResultsAreDisplayed();
      await ProductSearchPage.selectSortOption(option.label);
      await ProductSearchPage.verifySortOptionIsSelected(option.label);
    });
  }

  test('Verify user can filter in-stock products and view product details', async () => {
    await MyAccountPage.searchForProduct(validProducts[0].searchTerm);
    await ProductSearchPage.verifyProductResultsAreDisplayed();
    await ProductSearchPage.filterByInStock();
    await ProductSearchPage.clickProduct();
    await ProductPage.verifyProductPageIsDisplayed();
    await ProductPage.verifyAddToCartIsEnabled();
  });
});
