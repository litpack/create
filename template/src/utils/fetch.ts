import "reflect-metadata";
import { injectable, inject } from "inversify";
import { MyHttpInterceptor } from "@/utils/http-interceptor";

@injectable()
export class FetchService {
  constructor(
    @inject(MyHttpInterceptor) private interceptor: MyHttpInterceptor
  ) { }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    options?: RequestInit,
    body?: any
  ): Promise<T> {
    const modifiedOptions = this.interceptor.interceptRequest(url, {
      method,
      ...options,
      ...(body && {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      }),
    });

    try {
      const response = await fetch(url, modifiedOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.interceptor.interceptResponse(data);
    } catch (error: unknown) {
      console.error(`${method} request to ${url} failed:`, error);
      return Promise.reject(error);
    }
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>("GET", url, options);
  }

  async post<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>("POST", url, options, body);
  }

  async put<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>("PUT", url, options, body);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", url, options);
  }

  async patch<T>(url: string, body: any, options?: RequestInit): Promise<T> {
    return this.request<T>("PATCH", url, options, body);
  }
}
