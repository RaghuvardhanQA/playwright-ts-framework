import { env } from "node:process";
import { clickAndNavigate, fill } from "../../main/utils/action-utils";
import { expectPageToHaveTitle } from "../../main/utils/expect-utils";
import { waitForElementToBeVisible } from "../../main/utils/element-utils";
import { SMALL_TIMEOUT } from "../../main/resources/constants/timeouts";
import { getPage, waitForPageLoadState } from "../../main/utils/page-utils";

// --- Locators ---
const EMAIL_INPUT    = "input[name='email']";
const PASSWORD_INPUT = "input[name='password']";
const LOGIN_BTN      = "input[type='submit'][value='Login']";

export async function verifyLoginPage() {
    await expectPageToHaveTitle("Account Login");
}

export async function login() {
    await waitForPageLoadState({ waitUntil: 'domcontentloaded', timeout: SMALL_TIMEOUT });
    await fill(EMAIL_INPUT, process.env.USER_EMAIL!);
    await fill(PASSWORD_INPUT, process.env.USER_PASSWORD!);
    await clickAndNavigate(LOGIN_BTN);
}


