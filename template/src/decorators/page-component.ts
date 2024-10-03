import { LitElement } from 'lit';

interface PageComponentOptions {
  name: string;
}

export function PageComponent(options: PageComponentOptions) {
  return function <T extends { new (...args: any[]): LitElement }>(target: T) {
    if (!(target.prototype instanceof LitElement)) {
      Object.setPrototypeOf(target.prototype, LitElement.prototype);
    }

    target.prototype.createRenderRoot = function () {
      return this;
    };

    const originalConnectedCallback = target.prototype.connectedCallback;
    target.prototype.connectedCallback = function () {
      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    };

    const originalDisconnectedCallback = target.prototype.disconnectedCallback;
    target.prototype.disconnectedCallback = function () {
      if (originalDisconnectedCallback) {
        originalDisconnectedCallback.call(this);
      }
    };

    const customElementName = options.name.toLowerCase();

    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, target);
    }

    return target;
  };
}
