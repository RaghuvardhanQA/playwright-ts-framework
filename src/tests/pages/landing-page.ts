import { DEFAULT_TIMEOUT } from "../../main/resources/constants/timeouts";
import { clickAndNavigate, hover } from "../../main/utils/action-utils";
import { expectPageToHaveTitle } from "../../main/utils/expect-utils";
import { navigateToURL, waitForPageLoadState } from "../../main/utils/page-utils";

// --- Locators ---
const MY_ACCOUNT_BTN  = "//*[@role='button'][contains(@href,'account')]";
const LOGIN_LINK      = "//a[contains(@href,'account/login')]";

export async function navigateToLandingPage() {
    await navigateToURL('/');
}

export async function verifyLandingPage() {
    await waitForPageLoadState({ waitUntil: 'domcontentloaded', timeout: DEFAULT_TIMEOUT });
    await expectPageToHaveTitle('Your Store');
}

export async function clickLogin(){
    await hover(MY_ACCOUNT_BTN);
    await clickAndNavigate(LOGIN_LINK);
}
