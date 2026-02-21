import { SMALL_TIMEOUT } from "../../main/resources/constants/timeouts";
import { expectElementToBeVisible } from "../../main/utils/expect-utils";

export async function verifyProductsIsDisplayed(){
    await expectElementToBeVisible("//h2[contains(text(),'All Products')]", { timeout: SMALL_TIMEOUT });
}