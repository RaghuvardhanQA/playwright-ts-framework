import { click, clickAndNavigate, selectByText } from "#utils/action-utils";
import { getLocator, getLocatorByLabel, waitForElementToBeVisible } from "#utils/element-utils";
import { expectPageToContainURL, expectElementToBeVisible } from "#utils/expect-utils";

// --- Locators ---
const PLP_HDR             = "//h1[contains(normalize-space(),'Search')]";
const PRODUCT_CARDS       = ".product-thumb";
const PRODUCT_LINK        = ".product-thumb h4 a";
const NO_RESULTS_MSG      = "//p[contains(text(),'There is no product that matches')]";
const RESULTS_COUNT       = "div.col-sm-6.text-right";

export async function verifySearchResultsPageIsDisplayed(): Promise<void> {
    await expectPageToContainURL('route=product/search');
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

export async function filterByInStock(): Promise<void> {
    const countTextBefore = await getLocator(RESULTS_COUNT).innerText();
    await click(getLocator("label.custom-control-label", { hasText: 'In stock' }).last());
    await getLocator(RESULTS_COUNT).filter({ hasNotText: countTextBefore }).waitFor({ state: 'visible' });
    await waitForElementToBeVisible(getLocator(PRODUCT_CARDS).first());
}

export async function clickProduct(): Promise<void> {
    await clickAndNavigate(getLocator(PRODUCT_LINK).first());
}
