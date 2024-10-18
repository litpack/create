import { BaseComponent, ReusableComponentOptions } from "@/utils/base-component";
import { LitElement } from "lit";

export function ReusableComponent(options: ReusableComponentOptions) {
  return function <T extends { new (...args: any[]): LitElement }>(target: T) {
    return BaseComponent({ tag: options.tag, observedAttributes: options.observedAttributes }, target);
  };
}
