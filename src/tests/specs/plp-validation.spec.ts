
import * as LandingPage from "../pages/landing-page";
import * as LoginPage from "../pages/login-page";
import * as MyAccountPage from "../pages/my-account-page";
import * as ProductSearchPage from "../pages/product-search-page"
import * as ProductPage from "../pages/product-page";
import { test } from "../../main/resources/setup/page-setup";

test.describe('Sample tests for automationexercise page @smoke', () => {
  test.beforeEach('Navigating to automationexercise page', async () => {
    await LandingPage.navigateToLandingPage();
    await LandingPage.verifyLandingPage();
    await LandingPage.clickLogin();
    await LoginPage.verifyLoginPage();
    await LoginPage.login();
    await MyAccountPage.validateMyAccountPage();
  });

    test('Verify that user is able to search for products', async () => {
        await MyAccountPage.searchForProduct("Mac book");
        await ProductSearchPage.verifyProductResultsAreDisplayed();
    });

    test('Verify that user is able to filter for products', async () => {
        await MyAccountPage.searchForProduct("Mac book");
        await ProductSearchPage.verifyProductResultsAreDisplayed();
        await ProductSearchPage.selectSortOption("Price (Low > High)");
        await ProductSearchPage.verifySortOptionIsSelected("Price (Low > High)");
    });

    test('Verify that user can filter in stock products and view product details', async () => {
        await MyAccountPage.searchForProduct("Mac book");
        await ProductSearchPage.verifyProductResultsAreDisplayed();
        await ProductSearchPage.filterByInStock();
        await ProductSearchPage.verifyProductResultsAreDisplayed();
        await ProductSearchPage.clickFirstProduct();
        await ProductPage.verifyProductPageIsDisplayed();
        await ProductPage.verifyAddToCartIsEnabled();
    });
});