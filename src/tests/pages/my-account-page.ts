import { fill, clickAndNavigate } from "#utils/action-utils";
import { getLocator, getVisibleLocator, waitForElementToBeHidden } from "#utils/element-utils";
import { expectPageToHaveTitle } from "#utils/expect-utils";

// --- Locators ---
const SEARCH_INPUT  = "input[name='search']";
// Scoped to the header search submit button. getVisibleLocator ensures we only match
// the visible header search button and never the hidden "Send message" button on PDPs.
const SEARCH_SUBMIT = 'form[action*="search"] button[type="submit"]';
// Success toast container — may be visible and cover the SEARCH button (at y≈25) when
// a product has just been added to cart. We wait for it to be hidden before searching.
const TOAST_CONTAINER = '#notification-box-top .toast.show';
// Maximum wait for the toast to auto-dismiss (ms). The site's toast lives ~10 s.
const TOAST_DISMISS_TIMEOUT = 12000;

export async function validateMyAccountPage() {
    expectPageToHaveTitle("My Account");
}

/**
 * Types a keyword into the header search box and clicks the SEARCH submit button.
 *
 * Implementation notes:
 * - Enter key on the search input navigates to home instead of submitting the form
 *   on this OpenCart theme — the submit button must be clicked.
 * - The success toast sits at y≈14 (width 350px), overlapping the SEARCH button at
 *   x=873,y=25. When a product was just added to the cart, calling this immediately
 *   would time out with "pointer events intercepted by toast". We wait for any visible
 *   toast to dismiss first (the site auto-dismisses after ~10 s).
 * - getVisibleLocator is used on SEARCH_SUBMIT so only the visible header search button
 *   is matched, never the hidden "Send message" button on PDPs.
 *
 * @param keyword - Text to search for (e.g. 'HP LP3065', 'iPod Nano')
 */
export async function searchForProduct(keyword: string): Promise<void> {
    // If a success toast is blocking the search area, wait for it to dismiss.
    const toastLocator = getLocator(TOAST_CONTAINER);
    const toastCount = await toastLocator.count();
    if (toastCount > 0 && await toastLocator.isVisible()) {
        await waitForElementToBeHidden(toastLocator, { timeout: TOAST_DISMISS_TIMEOUT });
    }
    await fill(SEARCH_INPUT, keyword);
    await clickAndNavigate(getVisibleLocator(SEARCH_SUBMIT).first());
}
