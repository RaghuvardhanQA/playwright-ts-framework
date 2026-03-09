import { fill, fillAndEnter } from "../../main/utils/action-utils";
import { expectPageToHaveTitle } from "../../main/utils/expect-utils";

// --- Locators ---
const SEARCH_INPUT = "input[name='search']";

export async function validateMyAccountPage() {
    expectPageToHaveTitle("My Account");
}

export async function searchForProduct(keyword: string): Promise<void> {
    await fill(SEARCH_INPUT, keyword);
    await fillAndEnter(SEARCH_INPUT, keyword);
}