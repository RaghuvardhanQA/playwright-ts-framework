import { env } from "node:process";
import { click, fill } from "../../main/utils/action-utils";
import { expectPageToHaveTitle } from "../../main/utils/expect-utils";
import { waitForElementToBeVisible } from "../../main/utils/element-utils";
import { SMALL_TIMEOUT } from "../../main/resources/constants/timeouts";
import { getPage, waitForPageLoadState } from "../../main/utils/page-utils";

export async function verifyLoginPage() {
    await expectPageToHaveTitle("Account Login");
}

export async function login() {
    await waitForPageLoadState({ waitUntil: 'domcontentloaded', timeout: SMALL_TIMEOUT });
    await fill("input[name='email']", process.env.USER_EMAIL!);
    await fill("input[name='password']", process.env.USER_PASSWORD!);
    await click("input[type='submit'][value='Login']");
}


