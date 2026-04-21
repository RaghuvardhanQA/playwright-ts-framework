import { click, clickAndNavigate, clickByJS, fill } from '#utils/action-utils';
import { getLocator, getInputValue, getText, waitForElementToBeVisible } from '#utils/element-utils';
import {
    expectElementToBeVisible,
    expectElementToContainText,
    expectElementToHaveText,
    expectElementToHaveValue,
    expectPageToContainURL,
} from '#utils/expect-utils';
import { waitForPageLoadState } from '#utils/page-utils';

// --- Locators ---
const CART_PAGE_HEADING  = '#content h1';
// Two table.table-bordered exist on the cart page (line items + totals); .first() = line items.
const CART_TABLE         = 'table.table-bordered';
const CART_PRODUCT_NAME  = 'td.text-left a';
const CART_QTY_INPUT     = 'input[name*="quantity"]';
// nth-child indices are 1-based in CSS; column 5 = unit price, column 6 = row total
const CART_UNIT_PRICE    = 'table.table-bordered td.text-right:nth-child(5)';
const CART_UPDATE_BTN    = 'button[title="Update"]';
const CART_REMOVE_BTN    = 'button[title="Remove"]';
const CART_TOTAL_ROW     = "//tr[td[contains(text(),'Total:')]]";
const CART_TOTAL_VALUE   = "//td[contains(text(),'Total:')]/following-sibling::td";
// Two checkout links exist on the cart page; target the primary lg button to avoid strict mode.
const CHECKOUT_BTN       = 'a.btn-primary[href*="checkout/checkout"]';
const EMPTY_CART_MSG     = '#content p';
const CART_ICON_BADGE    = '.cart-icon';
// Header cart icon toggle — opens the cart drawer (#cart-total-drawer).
// Confirmed via live inspection: <a class="cart ..." href="#cart-total-drawer">.
// The cart icon is always visible in the site header on all pages.
const HEADER_CART_TOGGLE = 'a.cart[href="#cart-total-drawer"]';
// "Edit cart" link inside the cart drawer — navigates to the cart page.
// It only becomes visible after the drawer is opened via HEADER_CART_TOGGLE.
const DRAWER_EDIT_CART   = '#cart-total-drawer a[href*="checkout/cart"]';

// ── Navigation ─────────────────────────────────────────────────────────────────

/**
 * Navigates to the shopping cart page via the header cart drawer.
 *
 * Flow:
 *   1. Click the header cart icon (`.cart[href="#cart-total-drawer"]`) to open the drawer.
 *   2. Wait for the drawer's "Edit cart" link to become visible.
 *   3. Click "Edit cart" to navigate to the cart page.
 *
 * This is the UI-based approach — no `navigateToURL` with a route parameter.
 * Confirmed via live inspection: the "Edit cart" link is only present in the DOM
 * after the drawer is opened; clicking the cart icon is the correct trigger.
 */
export async function openCart(): Promise<void> {
    // Step 1: Open the cart drawer — use JS click to bypass any visible toast overlay
    // that can intercept pointer events and block the cart icon click.
    await clickByJS(getLocator(HEADER_CART_TOGGLE).first());
    // Step 2: Wait for the "Edit cart" link to become visible inside the drawer
    await waitForElementToBeVisible(getLocator(DRAWER_EDIT_CART));
    // Step 3: Click "Edit cart" to navigate to the cart page
    await clickAndNavigate(getLocator(DRAWER_EDIT_CART));
    await expectPageToContainURL('route=checkout/cart');
}

// ── Page-level assertions ──────────────────────────────────────────────────────

export async function verifyCartPageIsDisplayed(): Promise<void> {
    await expectPageToContainURL('route=checkout/cart');
    await expectElementToContainText(getLocator(CART_PAGE_HEADING), 'Shopping Cart');
}

// ── Product-in-cart assertions ─────────────────────────────────────────────────

/**
 * Waits for the cart table to be visible, then asserts the first product name matches.
 */
export async function verifyProductInCart(productName: string): Promise<void> {
    await waitForElementToBeVisible(getLocator(CART_TABLE).first());
    await expectElementToHaveText(getLocator(CART_PRODUCT_NAME).first(), productName);
}

/**
 * Asserts the quantity input of the first cart row equals `expectedQty`.
 */
export async function verifyCartQuantity(expectedQty: string): Promise<void> {
    await expectElementToHaveValue(getLocator(CART_QTY_INPUT).first(), expectedQty);
}

/**
 * Asserts the unit price cell of the first cart row contains `expectedPrice`.
 * The unit price column (5th td.text-right) matches the PDP price before tax.
 */
export async function verifyCartUnitPrice(expectedPrice: string): Promise<void> {
    await expectElementToContainText(getLocator(CART_UNIT_PRICE).first(), expectedPrice);
}

/**
 * Asserts the Total row exists and is visible.
 * We do not pin the exact total because the site applies Eco Tax and VAT on top.
 */
export async function verifyCartTotalNotZero(): Promise<void> {
    await expectElementToBeVisible(getLocator(CART_TOTAL_ROW).first());
    const totalText = await getText(getLocator(CART_TOTAL_VALUE).first());
    // Verify the total is a non-empty dollar amount (e.g. "$146.40")
    const isNonZero = totalText.trim().length > 0 && totalText !== '$0.00';
    if (!isNonZero) {
        throw new Error(`Cart total appears to be zero or empty: "${totalText}"`);
    }
}

// ── Cart manipulation ──────────────────────────────────────────────────────────

/**
 * Updates the quantity of the first cart row to `qty` and clicks Update.
 * Waits for the page to settle before returning.
 */
export async function updateQuantity(qty: string): Promise<void> {
    await fill(getLocator(CART_QTY_INPUT).first(), qty);
    await click(getLocator(CART_UPDATE_BTN).first());
    await waitForPageLoadState({ waitUntil: 'domcontentloaded' });
    // Wait for the table to re-render after the update
    await waitForElementToBeVisible(getLocator(CART_TABLE).first());
}

/**
 * Clicks the Remove button on the first cart row and waits for the page to reload.
 */
export async function removeProductFromCart(): Promise<void> {
    await click(getLocator(CART_REMOVE_BTN).first());
    await waitForPageLoadState({ waitUntil: 'domcontentloaded' });
}

// ── Empty cart assertions ──────────────────────────────────────────────────────

export async function verifyCartIsEmpty(): Promise<void> {
    await expectElementToContainText(getLocator(EMPTY_CART_MSG).first(), 'Your shopping cart is empty!');
}

export async function verifyCartBadgeCount(expectedCount: string): Promise<void> {
    await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), expectedCount);
}

// ── Checkout ───────────────────────────────────────────────────────────────────

export async function verifyCheckoutButtonIsVisible(): Promise<void> {
    await expectElementToBeVisible(getLocator(CHECKOUT_BTN));
}

/**
 * Returns the raw text of the cart total value cell, useful for before/after comparisons.
 */
export async function getCartTotalText(): Promise<string> {
    return getText(getLocator(CART_TOTAL_VALUE).first());
}
