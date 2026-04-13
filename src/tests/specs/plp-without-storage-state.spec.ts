/**
 * PLP Validation — WITHOUT Storage State
 *
 * Performs full UI login in beforeEach for every test.
 * This is the traditional approach — slower but doesn't depend on saved auth.
 * Use this when you need to test the actual login flow or when storage state is unavailable.
 */
import * as LandingPage from '#pages/landing-page';
import * as LoginPage from '#pages/login-page';
import * as MyAccountPage from '#pages/my-account-page';
import * as ProductSearchPage from '#pages/product-search-page';
import * as ProductPage from '#pages/product-page';
import { test } from '#pagesetup';

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

  test('Verify that user is able to search for products', async () => {
    await MyAccountPage.searchForProduct('Mac book');
    await ProductSearchPage.verifyProductResultsAreDisplayed();
  });

  test('Verify that user is able to filter for products', async () => {
    await MyAccountPage.searchForProduct('Mac book');
    await ProductSearchPage.verifyProductResultsAreDisplayed();
    await ProductSearchPage.selectSortOption('Price (Low > High)');
    await ProductSearchPage.verifySortOptionIsSelected('Price (Low > High)');
  });

  test('Verify that user can filter in stock products and view product details', async () => {
    await MyAccountPage.searchForProduct('Mac book');
    await ProductSearchPage.verifyProductResultsAreDisplayed();
    await ProductSearchPage.filterByInStock();
    await ProductSearchPage.clickProduct();
    await ProductPage.verifyProductPageIsDisplayed();
    await ProductPage.verifyAddToCartIsEnabled();
  });
});
