import * as env from 'util/envVariables';
import { createUrlSearchParams } from 'util/createUrlSearchParams';
import {
  API_VERSION,
  HOTEL_API_URL,
  HOTEL_API_VERSION,
  OLD_API_URL,
  PACKAGE_API_URL,
  PACKAGE_API_VERSION,
  UNIVERSAL_API_URL,
  UNIVERSAL_API_VERSION,
} from 'util/envVariables';

export const API_URL_HOTEL = `${HOTEL_API_URL}/${HOTEL_API_VERSION}/`;
export const API_URL_LOCAL = '';
export const API_URL_PACKAGE = `${PACKAGE_API_URL}/${PACKAGE_API_VERSION}/`;
export const API_URL_PHP = `${OLD_API_URL}/${API_VERSION}/`;
export const API_URL_SONATA = `${OLD_API_URL}/${API_VERSION}/static-content/`;
export const API_URL_UNIVERSAL = `${UNIVERSAL_API_URL}/${UNIVERSAL_API_VERSION}/`;

export type GetParams = Record<string, any>;
export type PostParams = Record<string, any>;
export type API = typeof API_URL_PHP | typeof API_URL_PACKAGE;

export class HttpService {
  private runningCalls: { [key: string]: AbortController } = {};

  public async get(
    api: API,
    path: string,
    params: GetParams = {},
    options?: Partial<Request>,
  ): Promise<Response> {
    const url = this.createUrl(params, api, path);
    const headers = this.prepareHeaders(api, options);

    this.abortRunningCalls(path);
    const signal = this.addAbortController(path);

    return await fetch(url, {
      ...options,
      headers,
      signal,
    })
      .catch((err: string) => {
        throw new Error(err);
      })
      .finally(() => delete this.runningCalls[path]);
  }

  public async getJson<T>(
    api: API,
    path: string,
    params: GetParams = {},
    options?: Request,
  ): Promise<T> {
    const response = await this.get(api, path, params, options);
    return response.json();
  }

  //use this get for JAVA APIs, because our java API's wrap return values into an objects called data
  public async getJsonData<T>(
    api: API,
    path: string,
    params: GetParams = {},
    options?: Request,
  ): Promise<T> {
    const response = await this.getJson<{ data: T }>(
      api,
      path,
      params,
      options,
    );
    return response.data;
  }

  public async post(
    api: API,
    path: string,
    params: PostParams = {},
    options?: Partial<Request>,
  ): Promise<Response> {
    const url = this.createUrl(null, api, path);
    const headers = this.prepareHeaders(api, options);

    this.abortRunningCalls(path);
    const signal = this.addAbortController(path);
    const body = JSON.stringify(params);

    return await fetch(url, {
      ...options,
      headers,
      signal,
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      body,
    })
      .catch((err: string) => {
        throw new Error(err);
      })
      .finally(() => delete this.runningCalls[path]);
  }

  private addAbortController(path: string) {
    const controller = new AbortController();
    const signal = controller.signal;
    this.runningCalls[path] = controller;
    return signal;
  }

  private createUrl(params: Record<string, any>, api: string, path: string) {
    const queryString = createUrlSearchParams(params);
    return `${api}${path}${queryString}`;
  }

  private abortRunningCalls(path: string) {
    if (this.runningCalls[path]) {
      this.runningCalls[path].abort();
      delete this.runningCalls[path];
    }
  }

  private prepareHeaders(api: string, options?: Partial<Request>) {
    const headers = options ? options.headers : new Headers();
    headers.append('Content-Type', 'application/json');
    if (api === API_URL_PHP) {
      headers.append(
        'Authorization',
        `Basic ${btoa(env.API_USERNAME + ':' + env.API_PASSWORD)}`,
      );
    }
    return headers;
  }
}

export const httpService = new HttpService();
