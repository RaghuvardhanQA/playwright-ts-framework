/**
 * Add to Cart — End-to-End Test Suite
 *
 * Site: https://ecommerce-playground.lambdatest.io
 * Covers: PDP add-to-cart, PLP quick-add, cart page verification,
 *         quantity update, remove item, empty cart, and negative cases.
 *
 * All tests run in a clean guest context (no stored auth, blank cart).
 * See test-plans/add-to-cart-plan.md for full scenario specification.
 *
 * Navigation rule: every test enters the site at `/` and reaches all subsequent
 * pages via real UI interactions (header search → product card → PDP → toast links
 * / header cart link). No `navigateToURL('/index.php?route=...')` deep-links are used.
 */

import { test } from '#pagesetup';
import * as ProductPage from '#pages/product-page';
import * as ProductSearchPage from '#pages/product-search-page';
import * as CartPage from '#pages/cart-page';
import * as MyAccountPage from '#pages/my-account-page';
import { click, clickByJS, fill } from '#utils/action-utils';
import { getLocator, getVisibleLocator, getInputValue, waitForElementToBeVisible } from '#utils/element-utils';
import {
    expectElementToBeVisible,
    expectElementToContainText,
    expectElementToHaveText,
    expectElementToHaveValue,
    expectPageToContainURL,
} from '#utils/expect-utils';
import { navigateToURL, waitForPageLoadState } from '#utils/page-utils';
import { cartProducts } from '#testdata/plp-test-data';

// Selector constants referenced directly in specs where no page-object wrapper exists
const TOAST_CONTAINER       = '#notification-box-top .toast.show';
const TOAST_BODY_MSG        = '#notification-box-top .toast-body p';
const TOAST_HEADER_SUMMARY  = '#notification-box-top .toast-header .mr-auto';
// #content does not exist on this OpenCart theme; getVisibleLocator (stable option) resolves
// exactly one match — the visible PDP button. No #content scoping needed.
const ADD_TO_CART_BTN_VIS   = 'button.btn-cart';
const CART_ICON_BADGE       = '.cart-icon';
const CART_TABLE            = 'table.table-bordered';
const CART_PRODUCT_NAME     = 'td.text-left a';
const CART_QTY_INPUT        = 'input[name*="quantity"]';
const CART_UNIT_PRICE_COL   = 'table.table-bordered td.text-right:nth-child(5)';
const CART_TOTAL_VALUE      = "//td[contains(text(),'Total:')]/following-sibling::td";
const CART_TOTAL_ROW        = "//tr[td[contains(text(),'Total:')]]";
const CART_UPDATE_BTN       = 'button[title="Update"]';
const CART_REMOVE_BTN       = 'button[title="Remove"]';
const PRODUCT_CARDS         = '.product-thumb';
const PLP_QUICK_ADD_BTN     = '.product-thumb button.btn-cart';
const EMPTY_CART_MSG        = '#content p';
// .alert.alert-info.m-0 is the min-qty notice; plain .alert.alert-info matches a page
// placeholder element first which contains "Place here any module..." text instead.
const MIN_QTY_ALERT         = '.alert.alert-info.m-0';
const QUANTITY_INPUT        = 'input[name="quantity"]';

// =============================================================================
test.describe('Add to Cart @smoke @regression', () => {
    // Every test in this suite gets a clean, unauthenticated browser context.
    // This guarantees an empty cart and prevents cross-test state leakage.
    test.use({ storageState: { cookies: [], origins: [] } });

    // ── TC-01 ──────────────────────────────────────────────────────────────────
    test('TC-01: Add single product from PDP — verify toast message and cart badge @smoke @regression', async () => {
        // 1. Land on the home page
        await navigateToURL('/');

        // 2. Search for HP LP3065 via header search
        await MyAccountPage.searchForProduct('HP LP3065');

        // 3. Click the HP LP3065 product card to navigate to PDP
        await ProductSearchPage.clickProductCardByName('HP LP3065');

        // 4. Verify the product title is visible on PDP
        await expectElementToBeVisible(getLocator('h1.h3'));

        // 5. Verify cart badge starts at 0
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '0');

        // 6. Click add-to-cart on PDP
        await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });

        // 7. Wait for the success toast to appear
        await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

        // 8. Verify the toast body contains the correct product name
        await expectElementToContainText(
            getLocator(TOAST_BODY_MSG),
            'Success: You have added HP LP3065 to your shopping cart!',
        );

        // 9. Verify the toast header shows "1 item(s)"
        await expectElementToContainText(getLocator(TOAST_HEADER_SUMMARY), '1 item(s)');

        // 10. Verify the cart badge has incremented to 1
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '1');
    });

    // ── TC-02 ──────────────────────────────────────────────────────────────────
    test('TC-02: Add product from PDP — verify cart page contains correct product details @smoke @regression', async () => {
        // 1. Add HP LP3065 to cart via the header search → PLP → PDP flow
        await ProductPage.addProductToCart('HP LP3065');

        // 2. Navigate to cart via the header "Edit cart" link
        await CartPage.openCart();

        // 3. Confirm we are on the cart page
        await expectPageToContainURL('route=checkout/cart');

        // 4. Cart heading should contain "Shopping Cart"
        await expectElementToContainText(getLocator('#content h1'), 'Shopping Cart');

        // 5. Cart table must be present
        await expectElementToBeVisible(getLocator(CART_TABLE).first());

        // 6. First product name link should match
        await expectElementToHaveText(getLocator(CART_PRODUCT_NAME).first(), 'HP LP3065');

        // 7. Quantity should be 1
        await expectElementToHaveValue(getLocator(CART_QTY_INPUT).first(), '1');

        // 8. Unit price should match PDP price ($122.00)
        await expectElementToContainText(getLocator(CART_UNIT_PRICE_COL).first(), '$122.00');

        // 9. Total row must be visible
        await expectElementToBeVisible(getLocator(CART_TOTAL_ROW).first());

        // 10. Checkout button must be visible (use btn-primary to avoid strict mode — two checkout links exist)
        await expectElementToBeVisible(getLocator('a.btn-primary[href*="checkout/checkout"]'));
    });

    // ── TC-03 ──────────────────────────────────────────────────────────────────
    test('TC-03: Navigate to cart via "View Cart" link in toast @smoke', async () => {
        // 1. Land on the home page
        await navigateToURL('/');

        // 2. Search for HP LP3065 and navigate to PDP
        await MyAccountPage.searchForProduct('HP LP3065');
        await ProductSearchPage.clickProductCardByName('HP LP3065');

        // 3. Click add-to-cart on PDP
        await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });

        // 4. Wait for toast to appear
        await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

        // 5. "View Cart" button must be present in toast
        await expectElementToBeVisible(getLocator('#notification-box-top .toast-body a.btn-primary'));

        // 6. Click "View Cart" via the page-object helper — triggers navigation to cart
        await ProductPage.clickViewCartInToast();

        // 7. Confirm cart page URL
        await expectPageToContainURL('route=checkout/cart');

        // 8. Correct product must appear in cart
        await expectElementToHaveText(getLocator(CART_PRODUCT_NAME).first(), 'HP LP3065');
    });

    // ── TC-04 — Parameterised ─────────────────────────────────────────────────
    for (const product of cartProducts) {
        test(`TC-04: Add "${product.name}" from PDP and verify in cart @regression`, async () => {
            // 1. Land on home, search for the product, click its card to reach PDP
            await navigateToURL('/');
            await MyAccountPage.searchForProduct(product.name);
            await ProductSearchPage.clickProductCardByName(product.name, product.productId);

            // 2. Click add-to-cart on PDP
            await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });

            // 3. Wait for success toast
            await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

            // 4. Toast body must mention the correct product name
            await expectElementToContainText(
                getLocator(TOAST_BODY_MSG),
                `You have added ${product.name}`,
            );

            // 5. Navigate to cart via the header "Edit cart" link
            await CartPage.openCart();

            // 6. Product name in cart matches
            await expectElementToHaveText(getLocator(CART_PRODUCT_NAME).first(), product.name);

            // 7. Unit price in cart matches PDP price
            await expectElementToContainText(
                getLocator(CART_UNIT_PRICE_COL).first(),
                product.expectedPrice,
            );
        });
    }

    // ── TC-05 ──────────────────────────────────────────────────────────────────
    test('TC-05: Add product via PLP quick-add button — verify toast and badge @regression', async () => {
        // 1. Land on home page and search for HP LP3065 via header search
        await navigateToURL('/');
        await MyAccountPage.searchForProduct('HP LP3065');

        // 2. Wait for product cards to appear
        await waitForElementToBeVisible(getLocator(PRODUCT_CARDS).first());

        // 3. Confirm badge starts at 0
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '0');

        // 4. Click the quick-add button on the first product card.
        //    The PLP card has a hover overlay div that intercepts pointer events,
        //    so a JS click is required to bypass it.
        await clickByJS(getLocator(PLP_QUICK_ADD_BTN).first());

        // 5. Wait for the success toast
        await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

        // 6. Toast body must show the generic success text
        await expectElementToContainText(getLocator(TOAST_BODY_MSG), 'You have added');

        // 7. Cart badge must show 1
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '1');
    });

    // ── TC-06 ──────────────────────────────────────────────────────────────────
    test('TC-06: Update quantity in cart from 1 to 2 — verify total updates @regression', async () => {
        // 1. Add HP LP3065 to cart via the header search → PLP → PDP flow
        await ProductPage.addProductToCart('HP LP3065');

        // 2. Navigate to cart via the header "Edit cart" link
        await CartPage.openCart();

        // 3. Capture the current total before update
        const totalBefore = await getLocator(CART_TOTAL_VALUE).first().innerText();

        // 4. Change quantity input to 2
        await fill(getLocator(CART_QTY_INPUT).first(), '2');

        // 5. Click Update
        await click(getLocator(CART_UPDATE_BTN).first());

        // 6. Wait for the page to reload after the update
        await waitForPageLoadState({ waitUntil: 'domcontentloaded' });
        await waitForElementToBeVisible(getLocator(CART_TABLE).first());

        // 7. Quantity input should now show 2
        await expectElementToHaveValue(getLocator(CART_QTY_INPUT).first(), '2');

        // 8. Total row must still be present (we validate existence, not exact value,
        //    because the site adds Eco Tax and VAT which can vary)
        await expectElementToBeVisible(getLocator(CART_TOTAL_ROW).first());

        // 9. Total value must not be zero and must differ from the original
        const totalAfter = await getLocator(CART_TOTAL_VALUE).first().innerText();
        if (totalAfter.trim() === '$0.00' || totalAfter.trim().length === 0) {
            throw new Error(`Cart total after quantity update is unexpectedly zero or empty: "${totalAfter}"`);
        }
        // The total for qty=2 should differ from qty=1
        if (totalAfter.trim() === totalBefore.trim()) {
            throw new Error(`Cart total did not change after quantity update: before="${totalBefore}" after="${totalAfter}"`);
        }
    });

    // ── TC-07 ──────────────────────────────────────────────────────────────────
    test('TC-07: Remove product from cart — verify cart becomes empty @regression', async () => {
        // 1. Add HP LP3065 to cart via the header search → PLP → PDP flow
        await ProductPage.addProductToCart('HP LP3065');

        // 2. Navigate to cart via the header "Edit cart" link
        await CartPage.openCart();

        // 3. Cart table must be present before removal
        await expectElementToBeVisible(getLocator(CART_TABLE).first());

        // 4. Click Remove on the first cart row
        await click(getLocator(CART_REMOVE_BTN).first());

        // 5. Wait for the page to reload
        await waitForPageLoadState({ waitUntil: 'domcontentloaded' });

        // 6. Empty cart message must be shown
        await expectElementToContainText(
            getLocator(EMPTY_CART_MSG).first(),
            'Your shopping cart is empty!',
        );

        // 7. Cart badge must reset to 0
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '0');
    });

    // ── TC-09 ──────────────────────────────────────────────────────────────────
    test('TC-09: Empty cart page shows correct message for guest user @smoke', async () => {
        // 1. Land on the home page — cart is guaranteed empty (clean context)
        await navigateToURL('/');

        // 2. Navigate to cart via the header "Edit cart" link
        await CartPage.openCart();

        // 3. Empty cart message must be visible
        await expectElementToContainText(
            getLocator(EMPTY_CART_MSG).first(),
            'Your shopping cart is empty!',
        );

        // 4. Cart badge must show 0
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '0');
    });

    // ── TC-10 ──────────────────────────────────────────────────────────────────
    test('TC-10: Add same product twice — quantity merges to 2 in cart @regression', async () => {
        // 1. First add — land on home, search for HP LP3065, navigate to PDP, add to cart
        await navigateToURL('/');
        await MyAccountPage.searchForProduct('HP LP3065');
        await ProductSearchPage.clickProductCardByName('HP LP3065');
        await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });
        await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

        // 2. Toast header must show "1 item(s)" after first add
        await expectElementToContainText(getLocator(TOAST_HEADER_SUMMARY), '1 item(s)');

        // 3. Search again for the same product to navigate back to PDP
        await MyAccountPage.searchForProduct('HP LP3065');
        await ProductSearchPage.clickProductCardByName('HP LP3065');

        // 4. Second add — click add-to-cart again
        await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });
        await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

        // 5. Toast header must now show "2 item(s)"
        await expectElementToContainText(getLocator(TOAST_HEADER_SUMMARY), '2 item(s)');

        // 6. Cart badge must show 2
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '2');

        // 7. Navigate to cart via the header "Edit cart" link
        await CartPage.openCart();

        // 8. The single cart row must have quantity 2 (OpenCart merges duplicates)
        await expectElementToHaveValue(getLocator(CART_QTY_INPUT).first(), '2');
    });

    // ── TC-11 ──────────────────────────────────────────────────────────────────
    test('TC-11: Search → apply In Stock filter → quick-add first result → verify cart @smoke @regression', async () => {
        // 1. Land on home page and search for "HP" via header search
        await navigateToURL('/');
        await MyAccountPage.searchForProduct('HP');

        // 2. Verify the search results page is displayed
        await ProductSearchPage.verifySearchResultsPageIsDisplayed();

        // 3. Verify products are shown before filtering
        await ProductSearchPage.verifyProductResultsAreDisplayed();

        // 4. Verify the cart badge starts at 0
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '0');

        // 5. Apply the In Stock availability filter from the left sidebar.
        //    The filter uses a custom checkbox (input[name="mz_fss"][value="-1"]).
        //    Clicking it appends &mz_fss=-1 to the URL. We wait on URL change as
        //    the settled-state signal (result count stays the same because all HP
        //    products are already in stock).
        await ProductSearchPage.filterByInStock();

        // 6. Verify the URL now includes the in-stock filter parameter
        await expectPageToContainURL('mz_fss');

        // 7. Verify products are still displayed after the filter is applied
        await ProductSearchPage.verifyProductResultsAreDisplayed();

        // 8. Click the quick-add button on the first product card.
        //    Uses JS click to bypass the hover-overlay intercept (same pattern as TC-05).
        await ProductSearchPage.clickFirstProductQuickAddToCart();

        // 9. Wait for the success toast to confirm the item was added
        await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

        // 10. Toast body must contain the generic success text
        await expectElementToContainText(getLocator(TOAST_BODY_MSG), 'You have added');

        // 11. Cart badge must have incremented to 1
        await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '1');

        // 12. Navigate to the cart page via the header "Edit cart" link and verify
        await CartPage.openCart();
        await CartPage.verifyCartPageIsDisplayed();

        // 13. The cart must contain at least one product row (table is present)
        await expectElementToBeVisible(getLocator(CART_TABLE).first());

        // 14. The first product name in the cart must be non-empty
        await expectElementToBeVisible(getLocator(CART_PRODUCT_NAME).first());

        // 15. Cart total row must be visible (product was successfully added)
        await expectElementToBeVisible(getLocator(CART_TOTAL_ROW).first());
    });

    // ── Negative cases ─────────────────────────────────────────────────────────
    test.describe('Negative cases', () => {
        // ── TC-08 ────────────────────────────────────────────────────────────
        test.fixme('TC-08: Product with minimum-quantity restriction — toast warns about minimum qty @regression', async () => {
            // 1. Land on home, search for "Apple Cinema 30"" and navigate to its PDP.
            //    (product_id=42, requires minimum qty=2; product_id=40 is iPhone, no min-qty)
            await navigateToURL('/');
            await MyAccountPage.searchForProduct('Apple Cinema 30"');
            await ProductSearchPage.clickProductCardByName('Apple Cinema 30"');

            // 2. Minimum-quantity informational alert must be visible
            await expectElementToBeVisible(getLocator(MIN_QTY_ALERT).first());

            // 3. Alert must mention "minimum quantity"
            await expectElementToContainText(
                getLocator(MIN_QTY_ALERT).first(),
                'minimum quantity of',
            );

            // 4. Default quantity in the input reflects the minimum (e.g. "2")
            const defaultQty = await getInputValue(getLocator(QUANTITY_INPUT).first());
            if (parseInt(defaultQty, 10) < 2) {
                throw new Error(
                    `Expected default quantity to be >= 2 for min-qty product, got: "${defaultQty}"`,
                );
            }

            // 5. Override quantity to 1 (below the minimum)
            await fill(getLocator(QUANTITY_INPUT).first(), '1');

            // 6. Attempt to add to cart
            await click(getVisibleLocator(ADD_TO_CART_BTN_VIS).first(), { stable: true, loadState: 'domcontentloaded' as const });

            // 7. A toast must appear (either success with min-qty warning, or error)
            await waitForElementToBeVisible(getLocator(TOAST_CONTAINER));

            // 8. Toast body must warn about the minimum quantity requirement
            await expectElementToContainText(
                getLocator(TOAST_BODY_MSG),
                'minimum quantity',
            );

            // 9. Cart badge must remain at 0 (item was not added at invalid qty)
            await expectElementToContainText(getLocator(CART_ICON_BADGE).first(), '0');
        });
    });
});
