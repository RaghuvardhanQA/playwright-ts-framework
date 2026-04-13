/**
 * PLP Validation — Uses Storage State with auto-login fallback
 *
 * Attempts to use saved auth state. If the server-side session has expired,
 * falls back to a fresh UI login within the same browser context.
 */
import * as LoginPage from '#pages/login-page';
import * as MyAccountPage from '#pages/my-account-page';
import * as ProductSearchPage from '#pages/product-search-page';
import * as ProductPage from '#pages/product-page';
import { test } from '#pagesetup';
import { navigateToURL, getPage, saveStorageState } from '#utils/page-utils';
import { getUserAuthPath } from '#storage-setup/cookie-utils';

const defaultUser = { username: 'default' };
const storagePath = getUserAuthPath(defaultUser);

test.describe('Sample tests for automationexercise page @smoke', () => {

  test.beforeEach('Navigate to My Account with auto-login fallback', async () => {
    await navigateToURL('/index.php?route=account/account');

    // If session expired and redirected to login, perform fresh login
    if (getPage().url().includes('account/login')) {
      await LoginPage.login();
      await saveStorageState(storagePath);
    }
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
