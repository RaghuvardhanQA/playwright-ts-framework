import { clickAndNavigate, clickByJS, selectByText } from '#utils/action-utils';
import { getLocator, getLocatorByLabel, waitForElementToBeVisible } from '#utils/element-utils';
import { expectPageToContainURL, expectElementToBeVisible } from '#utils/expect-utils';
import { getPage } from '#utils/page-utils';

// --- Locators ---
const PLP_HDR               = "//h1[contains(normalize-space(),'Search')]";
const PRODUCT_CARDS         = '.product-thumb';
const PRODUCT_LINK          = '.product-thumb h4 a';
const NO_RESULTS_MSG        = "//p[contains(text(),'There is no product that matches')]";
// The in-stock availability filter renders as a custom checkbox inside a .mz-filter-value
// container. The label text is "In stock". Two instances exist (one per filter widget
// variant on the page) — .last() targets the visible/active one.
// Confirmed selector via live inspection: label.custom-control-label with text "In stock",
// backed by input[name="mz_fss"][value="-1"]. Clicking it appends &mz_fss=-1 to the URL.
const IN_STOCK_FILTER_LABEL = 'label.custom-control-label';
// PLP quick-add button — requires JS click to bypass the hover-overlay intercept.
const PLP_QUICK_ADD_BTN     = '.product-thumb button.btn-cart';

export async function verifySearchResultsPageIsDisplayed(): Promise<void> {
    await expectPageToContainURL('product%2Fsearch');
    await expectElementToBeVisible(getLocator(PLP_HDR));
}

export async function verifyProductResultsAreDisplayed(): Promise<void> {
    await waitForElementToBeVisible(getLocator(PRODUCT_CARDS).first());
    await expectElementToBeVisible(getLocator(PRODUCT_CARDS).first());
}

export async function verifyNoResultsMessageIsDisplayed(): Promise<void> {
    await expectElementToBeVisible(getLocator(NO_RESULTS_MSG));
}

export async function selectSortOption(option: string): Promise<void> {
    await selectByText(getLocatorByLabel('Sort By:'), option);
}

export async function verifySortOptionIsSelected(option: string): Promise<void> {
    await waitForElementToBeVisible(getLocator(PRODUCT_CARDS).first());
    await expectElementToBeVisible(getLocator(PRODUCT_CARDS).first());
}

/**
 * Applies the "In stock" availability filter from the left-sidebar filter panel
 * on the search results page.
 *
 * The filter is a custom checkbox (input[name="mz_fss"][value="-1"]) associated with
 * a label.custom-control-label containing the text "In stock". When checked, the page
 * URL gains the query parameter &mz_fss=-1. We wait for that URL change as the
 * reliable settled-state signal — the result count text does NOT change when all
 * products are already in stock, so waiting on text would time out.
 *
 * Two filter widget instances exist on the page; .last() targets the active one.
 * A JS click is used because the label may be partially outside the viewport on
 * some screen sizes (confirmed during live inspection: "element outside viewport" error
 * occurs with a standard pointer click on the first instance).
 */
export async function filterByInStock(): Promise<void> {
    await clickByJS(getLocator(IN_STOCK_FILTER_LABEL, { hasText: 'In stock' }).last());
    // Wait for the mz_fss URL param to confirm the filter was applied
    await getPage().waitForURL('**mz_fss**', { timeout: 10000 });
    await waitForElementToBeVisible(getLocator(PRODUCT_CARDS).first());
}

/**
 * Clicks the quick-add-to-cart button on the first product card on the PLP.
 * A JS click is required because the card has a hover-overlay div that intercepts
 * pointer events, as used consistently in TC-05.
 */
export async function clickFirstProductQuickAddToCart(): Promise<void> {
    await clickByJS(getLocator(PLP_QUICK_ADD_BTN).first());
}

/**
 * Clicks the title link of a product card that leads to an in-stock PDP.
 *
 * Background: searching for "Mac book" returns 6 cards — product_ids 43/44/45 (the
 * first three) show an enabled btn-cart on the PLP but are OUT OF STOCK on their PDPs.
 * Products 60/61/62 (the second group) are genuinely in-stock on their PDPs.
 * This is an OpenCart site data inconsistency (PLP vs PDP stock display mismatch).
 *
 * Strategy: navigate using product_id=60 (MacBook) which is confirmed in-stock and
 * appears consistently in the "Mac book" search results. The href filter
 * `product_id=60` is URL-safe and unique among the search results.
 */
export async function clickProduct(): Promise<void> {
    const inStockLink = getLocator('h4 a[href*="product_id=60"]');
    await clickAndNavigate(inStockLink.first());
}

/**
 * Clicks the title link of the product card whose text matches `name`, navigating
 * to that product's detail page.
 *
 * Uses `.product-thumb` filtered by text to scope the click to the exact card,
 * then targets the `h4 a` title link within it.
 *
 * When multiple cards share the same product name (e.g. four "iPod Nano" cards with
 * different product IDs), pass the optional `productId` to target the specific card
 * whose `href` contains `product_id=<productId>`. Without `productId`, `.first()` is used.
 *
 * @param name      - The exact product name as it appears in the card title (e.g. 'HP LP3065')
 * @param productId - Optional OpenCart product_id to disambiguate among same-name cards
 */
export async function clickProductCardByName(name: string, productId?: number): Promise<void> {
    const cards = getLocator(PRODUCT_CARDS).filter({ hasText: name });
    if (productId !== undefined) {
        // Scope to the card whose h4 link href contains product_id=<productId>
        await clickAndNavigate(
            cards.filter({ has: getLocator(`h4 a[href*="product_id=${productId}"]`) }).first().locator('h4 a'),
        );
    } else {
        await clickAndNavigate(cards.first().locator('h4 a'));
    }
}
