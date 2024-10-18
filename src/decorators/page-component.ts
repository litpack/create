import { BaseComponent, PageComponentOptions } from "@/utils/base-component";
import { LitElement } from "lit";

export function PageComponent(options: PageComponentOptions) {
  return function <T extends { new (...args: any[]): LitElement }>(target: T) {
    return BaseComponent({ tag: options.tag }, target);
  };
}
