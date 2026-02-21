import { BrowserContext, expect, Response,Page } from "@playwright/test";
import { NavigationOptions, SwitchPageOptions, WaitForLoadStateOptions, GoToOptions } from "../resources/parameters/optional-parameters";
import { SMALL_TIMEOUT } from "../resources/constants/timeouts";

let page: Page;

let defaultLoadState: WaitForLoadStateOptions = 'domcontentloaded';

export function getDefaultLoadState(): WaitForLoadStateOptions {
  return defaultLoadState;
}

export function setDefaultLoadState(value: WaitForLoadStateOptions): void {
  defaultLoadState = value;
}

export const defaultVisibleOnlyOption = { onlyVisible: true };


export function setDefaultLocatorFilterVisibility(value: boolean): void {
  defaultVisibleOnlyOption.onlyVisible = value;
}

export function getPage(): Page {
  return page;
}

export function getContext(): BrowserContext {
  return page.context();
}

export function setPage(pageInstance: Page): void {
  page = pageInstance;
}

export function getAllPages(): Page[] {
  return page.context().pages();
}

export async function switchPage(winNum: number, options?: SwitchPageOptions): Promise<void> {
  const startTime = Date.now();
  const timeoutInMs = options?.timeout || SMALL_TIMEOUT;
  while (getAllPages().length < winNum && Date.now() - startTime < timeoutInMs) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  expect(getAllPages().length, `Page number ${winNum} not found after ${timeoutInMs} seconds`).toBeGreaterThanOrEqual(
    winNum,
  );
  const pageInstance = getAllPages()[winNum - 1];
  await pageInstance.waitForLoadState(options?.loadState || 'load');
  setPage(pageInstance);
}

export async function switchToDefaultPage(): Promise<void> {
  const allPages = getAllPages();
  const noOfWindows = allPages.length;
  if (noOfWindows > 0) {
    const pageInstance = allPages[0];
    await pageInstance.bringToFront();
    setPage(pageInstance);
  }
}

export async function closePage(winNum?: number): Promise<void> {
  if (!winNum) {
    await page.close();
    await switchToDefaultPage();
    return;
  }
  
  expect(winNum, 'Window number should be Valid').toBeGreaterThan(0);
  const allPages = getAllPages();
  const noOfWindows = allPages.length;
  if (noOfWindows >= 1) {
    const pageInstance = allPages[winNum - 1];
    await pageInstance.close();
  }
  await switchToDefaultPage();
}

export async function navigateToURL(
  path: string,
  options: GoToOptions = { waitUntil: getDefaultLoadState() },
): Promise<null | Response> {
  return await getPage().goto(path, options);
}

export async function getURL(options: NavigationOptions = { waitUntil: 'load' }): Promise<string> {
  try {
    await waitForPageLoadState(options);
    return getPage().url();
  } catch (error) {
    console.log(`getURL- ${error instanceof Error ? error.message : String(error)}`);
    return '';
  }
}

export async function waitForPageLoadState(options?: NavigationOptions): Promise<void> {
  let waitUntil: WaitForLoadStateOptions = getDefaultLoadState();

  if (options?.waitUntil && options.waitUntil !== 'commit') {
    waitUntil = options.waitUntil;
  }

  await getPage().waitForLoadState(waitUntil);
}

export async function reloadPage(options?: NavigationOptions): Promise<void> {
  await Promise.all([getPage().reload(options), getPage().waitForEvent('framenavigated')]);
  await waitForPageLoadState(options);
}

export async function goBack(options?: NavigationOptions): Promise<void> {
  await Promise.all([getPage().goBack(options), getPage().waitForEvent('framenavigated')]);
  await waitForPageLoadState(options);
}

export async function wait(ms: number): Promise<void> {
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await getPage().waitForTimeout(ms);
}

export async function getWindowSize(): Promise<{ width: number; height: number }> {
  return await getPage().evaluate(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });
}

export async function saveStorageState(path?: string): Promise<ReturnType<BrowserContext['storageState']>> {
  return await getPage().context().storageState({ path: path });
}
