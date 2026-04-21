import { click, clickAndNavigate } from '#utils/action-utils';
import { getLocator, getVisibleLocator, getText, waitForElementToBeVisible } from '#utils/element-utils';
import { expectElementToBeVisible, expectElementToBeEnabled, expectElementToContainText, expectPageToContainURL } from '#utils/expect-utils';
import { navigateToURL } from '#utils/page-utils';
import * as MyAccountPage from '#pages/my-account-page';
import * as ProductSearchPage from '#pages/product-search-page';

// --- Locators ---
const PRODUCT_TITLE         = 'h1.h3';
const ADD_TO_CART_BTN       = 'button.btn-cart';
// #content does not exist on this OpenCart theme; getVisibleLocator (applied by click/stable)
// already scopes to :visible, so there is exactly one match — the primary PDP button.
const ADD_TO_CART_BTN_VIS   = 'button.btn-cart';
const QUANTITY_INPUT        = 'input[name="quantity"]';
const PRICE_NEW             = '.price-new';
const PRICE_FALLBACK        = '.price';
// .alert.alert-info.m-0 is the minimum-quantity notice on PDPs with min qty restrictions.
// Plain .alert.alert-info matches a page placeholder element first on many PDPs.
const MIN_QTY_ALERT         = '.alert.alert-info.m-0';

const TOAST_CONTAINER       = '#notification-box-top .toast.show';
const TOAST_BODY_MSG        = '#notification-box-top .toast-body p';
const TOAST_HEADER_SUMMARY  = '#notification-box-top .toast-header .mr-auto';
// "View Cart" link inside the success toast — navigates to checkout/cart
const TOAST_VIEW_CART_BTN   = '#notification-box-top .toast-body a.btn-primary';
const CART_ICON_BADGE       = '.cart-icon';

// ── Existing functions ─────────────────────────────────────────────────────────

export async function verifyProductPageIsDisplayed(): Promise<void> {
    await expectElementToBeVisible(getLocator(PRODUCT_TITLE));
}

export async function verifyAddToCartIsEnabled(): Promise<void> {
    // Use :not([disabled]) to target only the enabled add-to-cart button.
    // Out-of-stock PDPs render button.btn-cart with the disabled attribute set —
    // this selector ignores those and asserts the enabled button is present.
    await expectElementToBeEnabled(getLocator('button.btn-cart:not([disabled])').first());
}

// ── Add-to-cart interactions ───────────────────────────────────────────────────

/**
 * Clicks the primary add-to-cart button on the product detail page.
 * Uses `#content button.btn-cart` to avoid matching related-product carousel buttons.
 * `{ stable: true, loadState: 'domcontentloaded' as const }` waits for any animation on the button to settle before clicking.
 */
export async function clickAddToCart(): Promise<void> {
    // Use getVisibleLocator so the :visible filter is already baked into the locator before
    // it is passed to waitForElementToBeStabled (which calls boundingBox() internally).
    // Without onlyVisible, .first() would resolve to the hidden mobile-sticky button (bb=null)
    // and waitForElementToBeStabled would time out.
    await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });
}

/**
 * Reaches a product detail page by searching via the header search box and clicking
 * the matching product card on the results page, then adds it to the cart.
 *
 * Flow: `/` → header search → PLP (click card by name) → PDP → add-to-cart → toast.
 *
 * This is the preferred composite for tests that need a product in the cart as a
 * precondition without caring about intermediate state. It replaces the former
 * `addProductToCartById` which deep-linked directly to the PDP via product_id.
 *
 * When multiple search results share the same product name (e.g. "iPod Nano" returns
 * 4 variants), pass `productId` to target the correct card. Without `productId`,
 * the first matching card is clicked.
 *
 * @param productName - The exact display name of the product (e.g. 'HP LP3065').
 * @param productId   - Optional OpenCart product_id to disambiguate same-name search results.
 */
export async function addProductToCart(productName: string, productId?: number): Promise<void> {
    await navigateToURL('/');
    await MyAccountPage.searchForProduct(productName);
    await ProductSearchPage.clickProductCardByName(productName, productId);
    await clickAddToCart();
    await waitForSuccessToast();
}

// ── Toast assertions ───────────────────────────────────────────────────────────

export async function waitForSuccessToast(): Promise<void> {
    await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));
}

export async function verifySuccessToastMessage(productName: string): Promise<void> {
    await waitForSuccessToast();
    await expectElementToContainText(getLocator(TOAST_BODY_MSG), `You have added ${productName}`);
}

export async function verifyToastItemCount(count: number): Promise<void> {
    await waitForSuccessToast();
    await expectElementToContainText(getLocator(TOAST_HEADER_SUMMARY), `${count} item(s)`);
}

// ── Cart badge ─────────────────────────────────────────────────────────────────

/**
 * Returns the text of the first visible cart icon badge (e.g. "0", "1").
 */
export async function getCartBadgeCount(): Promise<string> {
    return getText(getLocator(CART_ICON_BADGE).first());
}

// ── "View Cart" link in toast ──────────────────────────────────────────────────

/**
 * Clicks the "View Cart" button inside the success toast to navigate to the cart page.
 * The toast must already be visible before calling this function.
 */
export async function clickViewCartInToast(): Promise<void> {
    await waitForSuccessToast();
    await clickAndNavigate(getLocator(TOAST_VIEW_CART_BTN));
    await expectPageToContainURL('route=checkout/cart');
}

// ── Price retrieval ────────────────────────────────────────────────────────────

/**
 * Returns the displayed unit price from the PDP.
 * Prefers `.price-new` (sale price) and falls back to `.price`.
 */
export async function getProductPrice(): Promise<string> {
    const priceNewLocator = getLocator(PRICE_NEW);
    const count = await priceNewLocator.count();
    if (count > 0) {
        return getText(priceNewLocator.first());
    }
    return getText(getLocator(PRICE_FALLBACK).first());
}

// ── Minimum-quantity alert ─────────────────────────────────────────────────────

export async function verifyMinQtyAlertIsVisible(): Promise<void> {
    await expectElementToBeVisible(getLocator(MIN_QTY_ALERT).first());
}

export async function verifyMinQtyAlertContainsText(text: string): Promise<void> {
    await expectElementToContainText(getLocator(MIN_QTY_ALERT).first(), text);
}
