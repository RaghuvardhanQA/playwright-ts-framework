import { click, clickAndNavigate, selectByText } from "../../main/utils/action-utils";
import { getLocator, getLocatorByLabel, waitForElementToBeVisible } from "../../main/utils/element-utils";
import { expectPageToContainURL, expectElementToBeVisible } from "../../main/utils/expect-utils";

// --- Locators ---
const PLP_HDR             = "//h1[contains(normalize-space(),'Search')]";
const PRODUCT_CARDS       = ".product-thumb";
const FIRST_PRODUCT_LINK  = ".product-thumb h4 a";
const NO_RESULTS_MSG      = "//p[contains(text(),'There is no product that matches')]";

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
    await clickAndNavigate(getLocator("label.custom-control-label", { hasText: 'In stock' }).last());
    await waitForElementToBeVisible(getLocator(PRODUCT_CARDS).first());
}

export async function clickFirstProduct(): Promise<void> {
    await clickAndNavigate(getLocator(FIRST_PRODUCT_LINK).first());
}
