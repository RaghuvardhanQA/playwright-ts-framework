import { getPage } from '#utils/page-utils';
import { APIRequestContext, APIResponse } from '@playwright/test';

export function getAPIRequestContext(): APIRequestContext {
  return getPage().request;
}

export async function getRequest(url: string, options?: Parameters<APIRequestContext['get']>[1]): Promise<APIResponse> {
  return await getAPIRequestContext().get(url, options);
}

export async function postRequest(
  url: string,
  options?: Parameters<APIRequestContext['post']>[1],
): Promise<APIResponse> {
  return await getAPIRequestContext().post(url, options);
}

export async function putRequest(url: string, options?: Parameters<APIRequestContext['put']>[1]): Promise<APIResponse> {
  return await getAPIRequestContext().put(url, options);
}

export async function deleteRequest(
  url: string,
  options?: Parameters<APIRequestContext['delete']>[1],
): Promise<APIResponse> {
  return await getAPIRequestContext().delete(url, options);
}
