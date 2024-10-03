import { LitElement } from 'lit';

interface ReusableComponentOptions {
  tag: string;
}

export function ReusableComponent<T extends { new (...args: any[]): LitElement }>(
  options: ReusableComponentOptions
) {
  return function (target: T) {
    if (!(target.prototype instanceof LitElement)) {
      Object.setPrototypeOf(target.prototype, LitElement.prototype);
    }

    target.prototype.createRenderRoot = function () {
      return this;
    };

    const connectedCallback = target.prototype.connectedCallback;
    target.prototype.connectedCallback = function () {
      connectedCallback && connectedCallback.call(this);
    };

    if (!customElements.get(options.tag)) {
      customElements.define(options.tag, target);
    }

    return target;
  };
}
