import {Locator} from '@playwright/test';
import { Page } from '@playwright/test';

// Navigation Options
export type GoToOptions = Parameters<Page['goto']>[1];
export type NavigationOptions = Parameters<Page['reload']>[0];
export type WaitForLoadStateOptions = Parameters<Page['waitForLoadState']>[0];

export type VisibilityOption = { onlyVisible: boolean };
export type stabilityOptions = { stable: boolean };
export type LoadstateOptions = { loadState: WaitForLoadStateOptions };

// Action Options
export type ClickOptions = Parameters<Locator['click']>[0] & VisibilityOption & stabilityOptions & LoadstateOptions;
export type HoverOptions = Parameters<Locator['hover']>[0] & VisibilityOption & stabilityOptions;
export type FillOptions = Parameters<Locator['fill']>[1] & VisibilityOption & stabilityOptions;
export type PressSequentiallyOptions = Parameters<Locator['press']>[1] & VisibilityOption & stabilityOptions;
export type ClearOptions = Parameters<Locator['clear']>[0] & VisibilityOption & stabilityOptions;
export type SelectOptions = Parameters<Locator['selectOption']>[1] & VisibilityOption & stabilityOptions;
export type CheckOptions = Parameters<Locator['check']>[0] & VisibilityOption & stabilityOptions;
export type UploadOptions = Parameters<Locator['setInputFiles']>[1] & VisibilityOption & stabilityOptions;
export type DoubleClickOptions = Parameters<Locator['dblclick']>[0] & VisibilityOption & stabilityOptions & LoadstateOptions;
export type ActionOptions = ClickOptions | HoverOptions | FillOptions | PressSequentiallyOptions | ClearOptions | SelectOptions | CheckOptions | UploadOptions | DoubleClickOptions;
export type DragOptions = Parameters<Locator['dragTo']>[1] & VisibilityOption & stabilityOptions;
export type UploadValues = Parameters<Locator['setInputFiles']>[0] & VisibilityOption;

// Expectation Options
export type TimeoutOption = { timeout?: number };
export type SoftOption = { soft?: boolean };
export type MessageOrOptions = string | { message?: string };
export type ExpectOptions = TimeoutOption & SoftOption & MessageOrOptions;
export type ExpectTextOptions = {
  ignoreCase?: boolean;
  useInnerText?: boolean;
};

export type SwitchPageOptions = {
  loadState?: 'load' | 'domcontentloaded' | 'networkidle';
  timeout?: number;
};

export type LocatorOptions = Parameters<Page['locator']>[1] & VisibilityOption;
export type LocatorWaitOptions = { waitForLocator?: boolean } & TimeoutOption;
export type GetByTextOptions = Parameters<Locator['getByText']>[1] & VisibilityOption;
export type GetByRoleTypes = Parameters<Locator['getByRole']>[0] & VisibilityOption;
export type GetByRoleOptions = Parameters<Locator['getByRole']>[1] & VisibilityOption;
export type GetByLabelOptions = Parameters<Locator['getByLabel']>[1] & VisibilityOption;
export type GetByPlaceholderOptions = Parameters<Locator['getByPlaceholder']>[1] & VisibilityOption;

export type FrameOptions = Parameters<Page['frame']>[0];
