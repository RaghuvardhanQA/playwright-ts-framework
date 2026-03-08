import { DEFAULT_TIMEOUT } from "../../main/resources/constants/timeouts";
import { click, hover } from "../../main/utils/action-utils";
import { expectPageToHaveTitle } from "../../main/utils/expect-utils";
import { navigateToURL, waitForPageLoadState } from "../../main/utils/page-utils";

export async function navigateToLandingPage() {
    await navigateToURL('/');
}

export async function verifyLandingPage() {
    await waitForPageLoadState({ waitUntil: 'domcontentloaded', timeout: DEFAULT_TIMEOUT });
    await expectPageToHaveTitle('Your Store');
}

export async function clickLogin(){
    await hover("//*[@role='button'][contains(@href,'account')]");
    await click("//a[contains(@href,'account/login')]");
}
