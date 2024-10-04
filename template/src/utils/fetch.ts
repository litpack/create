import "reflect-metadata";
import { injectable, inject } from "inversify";
import ky, { Options as KyOptions } from "ky";
import { HttpInterceptor } from "./http-interceptor";

@injectable()
export class FetchService {
  constructor(@inject("HttpInterceptor") private interceptor: HttpInterceptor) {}

  private async request<T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    options?: KyOptions,
    body?: any
  ): Promise<T> {
    const modifiedOptions = this.interceptor.interceptRequest(url, {
      ...options,
      ...(body && { json: body }),
    });

    try {
      const response = await ky[method](url, modifiedOptions).json<T>();
      return this.interceptor.interceptResponse(response); // Ensure this returns type T
    } catch (error: unknown) {
      console.error(`${method.toUpperCase()} request to ${url} failed:`, error);
      return Promise.reject(error);
    }
  }

  async get<T>(url: string, options?: KyOptions): Promise<T> {
    return this.request<T>("get", url, options);
  }

  async post<T>(url: string, body: any, options?: KyOptions): Promise<T> {
    return this.request<T>("post", url, options, body);
  }

  async put<T>(url: string, body: any, options?: KyOptions): Promise<T> {
    return this.request<T>("put", url, options, body);
  }

  async delete<T>(url: string, options?: KyOptions): Promise<T> {
    return this.request<T>("delete", url, options);
  }

  async patch<T>(url: string, body: any, options?: KyOptions): Promise<T> {
    return this.request<T>("patch", url, options, body);
  }
}
