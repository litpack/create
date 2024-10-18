import { BaseComponent, LayoutComponentOptions } from "@/utils/base-component";
import { LitElement } from "lit";

export function LayoutComponent(options: LayoutComponentOptions) {
  return function <T extends { new (...args: any[]): LitElement }>(target: T) {
    return BaseComponent({ ...options }, target);
  };
}