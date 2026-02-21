import { DEFAULT_TIMEOUT } from "../../main/resources/constants/timeouts";
import { click } from "../../main/utils/action-utils";
import { waitForElementToBeVisible } from "../../main/utils/element-utils";
import { expectPageToHaveTitle } from "../../main/utils/expect-utils";
import { navigateToURL, waitForPageLoadState } from "../../main/utils/page-utils";

export async function navigateToLandingPage() {
    await navigateToURL('https://automationexercise.com/');
}

export async function verifyLandingPage() {
    await waitForPageLoadState({ waitUntil: 'domcontentloaded', timeout: DEFAULT_TIMEOUT });
    await expectPageToHaveTitle('Automation Exercise');
}

export async function clickProducts() {
    await click("//a[@href='/products']");
}
