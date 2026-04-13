import { Expect, expect, Locator, TestInfo } from "@playwright/test";
import { ExpectOptions, ExpectTextOptions, SoftOption, TimeoutOption } from "#resources/parameters/optional-parameters";
import { getLocator } from "#utils/element-utils";
import { getAllPages, getPage } from "#utils/page-utils";
import { getAlertText } from "#utils/action-utils";


function getExpectWithSoftOption(options?: SoftOption): Expect {
  return expect.configure({ soft: options?.soft });
}

function getLocatorAndAssert(input: string | Locator, options?: SoftOption): { locator: Locator; assert: Expect } {
  const locator = getLocator(input);
  const assert = getExpectWithSoftOption(options);
  return { locator, assert };
}

export function assertAllSoftAssertions(testInfo: TestInfo): void {
  expect(testInfo.errors).toHaveLength(0);
}

export async function expectElementToBeHidden(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeHidden(options);
}

export async function expectElementToBeVisible(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeVisible(options);
}

export async function expectElementToBeAttached(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeAttached(options);
}

export async function expectElementToBeInViewport(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeInViewport(options);
}

export async function expectElementNotToBeInViewport(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toBeInViewport(options);
}

export async function expectElementToBeChecked(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeChecked(options);
}

export async function expectElementNotToBeChecked(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toBeChecked(options);
}

export async function expectElementToBeDisabled(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeDisabled(options);
}

export async function expectElementToBeEnabled(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeEnabled(options);
}

export async function expectElementToBeEditable(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeEditable(options);
}

export async function expectElementToHaveText(
  input: string | Locator,
  text: string | RegExp | Array<string | RegExp>,
  options?: ExpectOptions & ExpectTextOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveText(text, options);
}

export async function expectElementNotToHaveText(
  input: string | Locator,
  text: string | RegExp | Array<string | RegExp>,
  options?: ExpectOptions & ExpectTextOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toHaveText(text, options);
}

export async function expectElementToContainText(
  input: string | Locator,
  text: string | RegExp | Array<string | RegExp>,
  options?: ExpectOptions & ExpectTextOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toContainText(text, options);
}

export async function expectElementNotToContainText(
  input: string | Locator,
  text: string | RegExp | Array<string | RegExp>,
  options?: ExpectOptions & ExpectTextOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toContainText(text, options);
}

export async function expectElementToHaveValue(
  input: string | Locator,
  text: string | RegExp,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveValue(text, options);
}

export async function expectElementToHaveValues(
  input: string | Locator,
  text: Array<string | RegExp>,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveValues(text, options);
}


export async function expectElementValueToBeEmpty(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toBeEmpty(options);
}

export async function expectElementValueNotToBeEmpty(input: string | Locator, options?: ExpectOptions): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).not.toBeEmpty(options);
}

/**
 * Asserts that an element has an attribute with the given value.
 * @param {string | Locator} input - Either a string (selector) or a Locator object.
 * @param {string} attribute - The attribute to check for.
 * @param {string | RegExp} value - The value to match against the attribute.
 * @param {ExpectOptions} options - The options to pass to the expect function.
 */
export async function expectElementToHaveAttribute(
  input: string | Locator,
  attribute: string,
  value: string | RegExp,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveAttribute(attribute, value, options);
}

export async function expectElementToContainAttribute(
  input: string | Locator,
  attribute: string,
  value: string | RegExp,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveAttribute(attribute, new RegExp(value), options);
}

export async function expectElementToHaveCount(
  input: string | Locator,
  count: number,
  options?: ExpectOptions,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  await assert(locator, options).toHaveCount(count, options);
}

export async function expectPageToHaveURL(urlOrRegExp: string | RegExp, options?: ExpectOptions): Promise<void> {
  const assert = getExpectWithSoftOption(options);
  await assert(getPage()).toHaveURL(urlOrRegExp, options);
}

export async function expectPageToContainURL(url: string, options?: ExpectOptions): Promise<void> {
  const assert = getExpectWithSoftOption(options);
  await assert(getPage()).toHaveURL(new RegExp(url), options);
}

export async function expectPageToHaveTitle(titleOrRegExp: string | RegExp, options?: ExpectOptions): Promise<void> {
  const assert = getExpectWithSoftOption(options);
  await assert(getPage()).toHaveTitle(titleOrRegExp);
}

export function expectPageSizeToBeEqualTo(numberOfPages: number, options?: SoftOption): void {
  const assert = getExpectWithSoftOption(options);
  assert(getAllPages().length).toEqual(numberOfPages);
}

export async function expectAlertToHaveText(
  input: string | Locator,
  text: string,
  options?: ExpectOptions & TimeoutOption,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  assert(await getAlertText(locator, options)).toBe(text);
}

export async function expectAlertToMatchText(
  input: string | Locator,
  text: string | RegExp,
  options?: ExpectOptions & TimeoutOption,
): Promise<void> {
  const { locator, assert } = getLocatorAndAssert(input, options);
  assert(await getAlertText(locator, options)).toMatch(text);
}
