
import * as LandingPage from "../pages/landing-page";
import * as ProductPage from "../pages/products-page";
import { test } from "../../main/resources/setup/page-setup";
import { getPage } from "../../main/utils/page-utils";

test.describe('Sample tests for automationexercise page @smoke', () => {
  test.beforeEach('Navigating to automationexercise page', async () => {
    await LandingPage.navigateToLandingPage();
  });

    test('Verify that user is able to navigate to products page by clicking on products link', async () => {
        await LandingPage.verifyLandingPage();
        await LandingPage.clickProducts();
        await ProductPage.verifyProductsIsDisplayed();
    });
});