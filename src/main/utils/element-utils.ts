import { test, Frame, FrameLocator, Locator, selectors } from "@playwright/test";
import { FrameOptions, GetByPlaceholderOptions, GetByRoleOptions, GetByRoleTypes, GetByTextOptions, LocatorOptions, LocatorWaitOptions, TimeoutOption } from "#resources/parameters/optional-parameters";
import { defaultVisibleOnlyOption, getPage, wait } from "#utils/page-utils";
import { SMALL_TIMEOUT } from "#constants/timeouts";
import { logger } from "#setup/custom-logger";

export function getLocator(input: string | Locator, options?: LocatorOptions): Locator {
  const locator = typeof input === 'string' ? getPage().locator(input, options) : input;
  return options?.onlyVisible ? locator.and(getPage().locator(':visible')) : locator;
}

export function getVisibleLocator(input: string | Locator, options?: LocatorOptions): Locator {
  return getLocator(input, { ...defaultVisibleOnlyOption, ...options });
}

export function getLocatorByTestId(testId: string | RegExp, attributeName?: string): Locator {
  if (attributeName) {
    selectors.setTestIdAttribute(attributeName);
  }
  return getPage().getByTestId(testId);
}

export function getLocatorByText(text: string | RegExp, options?: GetByTextOptions): Locator {
  return getPage().getByText(text, options);
}

export function getLocatorByRole(role: GetByRoleTypes, options?: GetByRoleOptions): Locator {
  return getPage().getByRole(role, options);
}

export function getLocatorByLabel(text: string | RegExp, options?: GetByRoleOptions): Locator {
  return getPage().getByLabel(text, options);
}

export function getLocatorByPlaceholder(text: string | RegExp, options?: GetByPlaceholderOptions): Locator {
  return getPage().getByPlaceholder(text, options);
}

export async function getAllLocators(
  input: string | Locator,
  options?: LocatorOptions & LocatorWaitOptions,
): Promise<Locator[]> {
  await waitForFirstElementToBeAttached(input, options);
  return typeof input === 'string' ? await getPage().locator(input, options).all() : await input.all();
}

export function getFrame(frameSelector: FrameOptions, options = { force: false }): null | Frame {
  const frame = getPage().frame(frameSelector);
  if (options.force) return frame;
  if (!frame) {
    throw new Error(`Frame not found with selector: ${JSON.stringify(frameSelector)}`);
  }
  return frame;
}

export function getFrameLocator(frameInput: string | FrameLocator): FrameLocator {
  return typeof frameInput === 'string' ? getPage().frameLocator(frameInput) : frameInput;
}

export function getLocatorInFrame(frameInput: string | FrameLocator, input: string | Locator): Locator {
  return getFrameLocator(frameInput).locator(input);
}


export async function getText(input: string | Locator, options?: TimeoutOption): Promise<string> {
  const locator = getLocator(input);
  return (await locator.innerText(options)).trim();
}

export async function getAllTexts(input: string | Locator, options?: LocatorWaitOptions): Promise<Array<string>> {
  await waitForFirstElementToBeAttached(input, options);
  const locator = getLocator(input);
  return (await locator.allInnerTexts()).map(text => text.trim());
}

export async function getInputValue(input: string | Locator, options?: TimeoutOption): Promise<string> {
  const locator = getLocator(input);
  return (await locator.inputValue(options)).trim();
}

export async function getAllInputValues(input: string | Locator, options?: TimeoutOption): Promise<Array<string>> {
  const locators = await getAllLocators(input);
  return Promise.all(locators.map(locator => getInputValue(locator, options)));
}

export async function getAttribute(
  input: string | Locator,
  attributeName: string,
  options?: TimeoutOption,
): Promise<null | string> {
  const locator = getLocator(input);
  return (await locator.getAttribute(attributeName, options))?.trim() || null;
}

export async function waitForElementToBeStabled(input: string | Locator, options?: TimeoutOption): Promise<boolean> {
  let result = false;
  await test.step('waitForElementToBeStable', async () => {
    const locator = getLocator(input);
    const maxWaitTime = options?.timeout || SMALL_TIMEOUT;
    let stableCounter = 0;

    const initialBoundingBox = await locator.boundingBox();
    let lastX: number | null = initialBoundingBox?.x || null;
    let lastY: number | null = initialBoundingBox?.y || null;

    const startTime = Date.now();
    await wait(200);

    while (Date.now() - startTime < maxWaitTime) {
      const { x, y } = (await locator.boundingBox()) || { x: null, y: null };

      if (x === lastX && y === lastY) {
        stableCounter++;
        if (stableCounter >= 3) {
          result = true;
          break;
        }
        await wait(100);
      } else {
        // stableCounter = 0;
        await wait(200);
      }

      lastX = x;
      lastY = y;
    }

    if (!result) {
      logger.error('Max wait time exceeded. Element is not stable.');
    }
  });
  return result;
}

export async function isElementAttached(input: string | Locator, options?: TimeoutOption): Promise<boolean> {
  const locator = getLocator(input); // Assuming getLocator returns a Playwright Locator
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;

  try {
    await locator.waitFor({ state: 'attached', timeout: timeoutInMs });
    return true;
  } catch (error) {
    console.log(`isElementAttached- ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

export async function getLocatorCount(input: string | Locator, options?: LocatorWaitOptions): Promise<number> {
  try {
    return (await getAllLocators(input)).length;
  } catch (error) {
    console.log(`getLocatorCount- ${error instanceof Error ? error.message : String(error)}`);
  }
  return 0;
}

export async function isElementVisible(input: string | Locator, options?: TimeoutOption): Promise<boolean> {
  const locator = getLocator(input);
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;
  const startTime = Date.now();
  try {
    while (Date.now() - startTime < timeoutInMs) {
      if (await locator.isVisible(options)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.log(`isElementVisible- ${error instanceof Error ? error.message : String(error)}`);
  }
  return false;
}


export async function isElementHidden(input: string | Locator, options?: TimeoutOption): Promise<boolean> {
  const locator = getLocator(input);
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;
  const startTime = Date.now();
  try {
    while (Date.now() - startTime < timeoutInMs) {
      if (await locator.isHidden(options)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.log(`isElementHidden- ${error instanceof Error ? error.message : String(error)}`);
  }
  return false;
}

export async function isElementChecked(input: string | Locator, options?: TimeoutOption): Promise<boolean> {
  try {
    if (await isElementVisible(input, options)) {
      return await getLocator(input).isChecked(options);
    }
  } catch (error) {
    console.log(`isElementChecked- ${error instanceof Error ? error.message : String(error)}`);
  }
  return false;
}


export async function waitForElementToBeVisible(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.waitFor({ state: 'visible', timeout: options?.timeout || SMALL_TIMEOUT });
}


export async function waitForElementToBeHidden(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.waitFor({ state: 'hidden', timeout: options?.timeout || SMALL_TIMEOUT });
}


export async function waitForElementToBeAttached(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.waitFor({ state: 'attached', timeout: options?.timeout || SMALL_TIMEOUT });
}

export async function waitForFirstElementToBeAttached(
  input: string | Locator,
  options?: LocatorWaitOptions,
): Promise<void> {
  const locator = getLocator(input);
  const waitForLocator = options?.waitForLocator ?? true;
  // If waitForLocator is true, wait for the element to be attached before returning the locators
  if (waitForLocator) {
    await waitForElementToBeAttached(locator.first(), options);
  }
}

export async function waitForElementToBeDetached(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.waitFor({ state: 'detached', timeout: options?.timeout || SMALL_TIMEOUT });
}
