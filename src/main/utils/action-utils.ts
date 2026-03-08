import test, { Locator } from "@playwright/test";
import { ActionOptions, CheckOptions, ClickOptions, ClearOptions, DragOptions, DoubleClickOptions, FillOptions, HoverOptions, PressSequentiallyOptions, SelectOptions, TimeoutOption, UploadOptions, UploadValues, VisibilityOption } from "../resources/parameters/optional-parameters";
import { getLocator, getVisibleLocator, waitForElementToBeStabled } from "./element-utils";
import { getDefaultLoadState, getPage } from "./page-utils";
import { DEFAULT_TIMEOUT, SMALL_TIMEOUT } from "../resources/constants/timeouts";

async function getLocatorWithStableAndVisibleOptions(
  input: string | Locator,
  options?: ActionOptions,
): Promise<Locator> {
  const locator = getVisibleLocator(input, options);
  if (options?.stable) await waitForElementToBeStabled(input, options);
  return locator;
}

export async function click(input: string | Locator, options?: ClickOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.click(options);
}

export async function clickAndNavigate(input: string | Locator, options?: ClickOptions): Promise<void> {
  const timeout = options?.timeout || DEFAULT_TIMEOUT;
  const elementHandle = await getLocator(input).elementHandle(options);
  try {
    await Promise.all([click(input, options), getPage().waitForEvent('framenavigated', { timeout: timeout + 100 })]);
    await getPage().waitForLoadState(options?.loadState || getDefaultLoadState(), {
      timeout: timeout,
    });
    await test.step(
      'Wait for element to be stale/hidden after navigation and ignore any errors in this step',
      async () => {
        await elementHandle?.waitForElementState('hidden', { timeout });
      },
      { box: true },
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError' && error.message.includes('framenavigated')) {
      throw new Error(`After the click action, the page did not navigate to a new page\n ${error.message}`);
    } else if (error instanceof Error && !error.message.includes('elementHandle.waitForElementState')) {
      throw error;
    }
  }
}

export async function fill(input: string | Locator, value: string, options?: FillOptions): Promise<void> {
  const locator = getVisibleLocator(input, options);
  await locator.fill(value, options);
}

export async function fillAndEnter(input: string | Locator, value: string, options?: FillOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.fill(value, options);
  await locator.press('Enter');
}

export async function fillAndTab(input: string | Locator, value: string, options?: FillOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.fill(value, options);
  await locator.press('Tab');
}

export async function pressSequentially(
  input: string | Locator,
  value: string,
  options?: PressSequentiallyOptions,
): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.pressSequentially(value, options);
}

export async function pressPageKeyboard(key: string, options?: PressSequentiallyOptions): Promise<void> {
  await getPage().keyboard.press(key, options);
}

export async function pressLocatorKeyboard(
  input: string | Locator,
  key: string,
  options?: PressSequentiallyOptions,
): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.press(key, options);
}

export async function clear(input: string | Locator, options?: ClearOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.clear(options);
}

export async function check(input: string | Locator, options?: CheckOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.check(options);
}

export async function uncheck(input: string | Locator, options?: CheckOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.uncheck(options);
}

export async function selectByValue(input: string | Locator, value: string, options?: SelectOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.selectOption({ value: value }, options);
}


export async function selectByValues(
  input: string | Locator,
  value: Array<string>,
  options?: SelectOptions,
): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.selectOption(value, options);
}

export async function selectByText(input: string | Locator, text: string, options?: SelectOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.selectOption({ label: text }, options);
}

export async function selectByIndex(input: string | Locator, index: number, options?: SelectOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.selectOption({ index: index }, options);
}

export async function acceptAlert(
  input: string | Locator,
  options?: { promptText?: string } & TimeoutOption,
): Promise<string> {
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;
  const locator = getLocator(input);
  let dialogMessage = '';

  const dialogPromise = getPage()
    .waitForEvent('dialog', { timeout: timeoutInMs })
    .then(async dialog => {
      dialogMessage = dialog.message();
      return await dialog.accept(options?.promptText);
    })
    .catch(() => {
      throw new Error(`No dialog appeared after waiting for ${timeoutInMs} ms.`);
    });

  await locator.click();
  await dialogPromise;
  return dialogMessage;
}

export async function dismissAlert(input: string | Locator, options?: TimeoutOption): Promise<string> {
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;
  const locator = getLocator(input);
  let dialogMessage = '';

  const dialogPromise = getPage()
    .waitForEvent('dialog', { timeout: timeoutInMs })
    .then(async dialog => {
      dialogMessage = dialog.message();
      return await dialog.dismiss();
    })
    .catch(() => {
      throw new Error(`No dialog appeared after waiting for ${timeoutInMs} ms.`);
    });

  await locator.click();
  await dialogPromise;
  return dialogMessage;
}

export async function getAlertText(input: string | Locator, options?: TimeoutOption): Promise<string> {
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;
  const locator = getLocator(input);
  let dialogMessage = '';

  const dialogPromise = getPage()
    .waitForEvent('dialog', { timeout: timeoutInMs })
    .then(async dialog => {
      dialogMessage = dialog.message();
      return await dialog.dismiss();
    })
    .catch(() => {
      throw new Error(`No dialog appeared after waiting for ${timeoutInMs} ms.`);
    });

  await locator.click();
  await dialogPromise;
  return dialogMessage;
}

export async function hover(input: string | Locator, options?: HoverOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.hover(options);
}

export async function focus(
  input: string | Locator,
  options?: TimeoutOption & VisibilityOption & VisibilityOption,
): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input);
  await locator.focus(options);
}


export async function dragAndDrop(
  input: string | Locator,
  dest: string | Locator,
  options?: DragOptions,
): Promise<void> {
  const drag = await getLocatorWithStableAndVisibleOptions(input, options);
  const drop = await getLocatorWithStableAndVisibleOptions(dest, options);
  await drag.dragTo(drop, options);
}

export async function doubleClick(input: string | Locator, options?: DoubleClickOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.dblclick(options);
}


export async function downloadFile(input: string | Locator, path: string, options?: ClickOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  const downloadPromise = getPage().waitForEvent('download');
  await click(locator, options);
  const download = await downloadPromise;
  // Wait for the download process to complete
  console.log(await download.path());
  // Save downloaded file somewhere
  await download.saveAs(path);
}

export async function uploadFiles(input: string | Locator, path: UploadValues, options?: UploadOptions): Promise<void> {
  const locator = await getLocatorWithStableAndVisibleOptions(input, options);
  await locator.setInputFiles(path, options);
}

export async function scrollLocatorIntoView(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.scrollIntoViewIfNeeded(options);
}

export async function clickByJS(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.evaluate((el: HTMLElement) => el.click(), options);
}

export async function clearByJS(input: string | Locator, options?: TimeoutOption): Promise<void> {
  const locator = getLocator(input);
  await locator.evaluate(element => {
    (element as HTMLInputElement).value = '';
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, options);
}
