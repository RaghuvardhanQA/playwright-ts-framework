/**
 * PLP Validation — WITHOUT Storage State
 *
 * Performs full UI login in beforeEach for every test.
 * This is the traditional approach — slower but doesn't depend on saved auth.
 * Tests are parameterised using product test data for broader coverage.
 */
import * as LandingPage from '#pages/landing-page';
import * as LoginPage from '#pages/login-page';
import * as MyAccountPage from '#pages/my-account-page';
import * as ProductSearchPage from '#pages/product-search-page';
import * as ProductPage from '#pages/product-page';
import { test } from '#pagesetup';
import { validProducts, invalidProducts, sortOptions } from '#testdata/plp-test-data';

test.describe.configure({ mode: 'parallel' });

test.describe('PLP Validation — Without Storage State (Full UI Login) @regression', () => {
  // No storageState — clear any inherited state to ensure fresh login
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach('Navigate and login via UI', async () => {
    await LandingPage.navigateToLandingPage();
    await LandingPage.verifyLandingPage();
    await LandingPage.clickLogin();
    await LoginPage.verifyLoginPage();
    await LoginPage.login();
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
