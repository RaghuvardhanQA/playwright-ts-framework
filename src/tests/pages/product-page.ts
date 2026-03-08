import { getLocator } from "../../main/utils/element-utils";
import { expectPageToContainURL, expectElementToBeVisible, expectElementToBeEnabled } from "../../main/utils/expect-utils";

// --- Locators ---
const PRODUCT_TITLE   = 'h1.h3';
const ADD_TO_CART_BTN = 'button.btn-cart';

export async function verifyProductPageIsDisplayed(): Promise<void> {
    await expectPageToContainURL('route=product/product');
    await expectElementToBeVisible(getLocator(PRODUCT_TITLE));
}

export async function verifyAddToCartIsEnabled(): Promise<void> {
    await expectElementToBeVisible(getLocator(ADD_TO_CART_BTN).last());
    await expectElementToBeEnabled(getLocator(ADD_TO_CART_BTN).last());
}
