import { SignalWatcher } from '@lit-labs/preact-signals';
import { LitElement } from 'lit';

interface PageComponentOptions {
  tag: string;
}

export function PageComponent(options: PageComponentOptions) {
  return function <T extends { new (...args: any[]): LitElement }>(target: T) {
    if (!(target.prototype instanceof LitElement)) {
      Object.setPrototypeOf(target.prototype, LitElement.prototype);
    }

    const OriginalClass = SignalWatcher(target);

    OriginalClass.prototype.createRenderRoot = function () {
      return this;
    };

    const originalConnectedCallback = OriginalClass.prototype.connectedCallback;
    OriginalClass.prototype.connectedCallback = function () {
      if (originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    };

    const originalDisconnectedCallback = OriginalClass.prototype.disconnectedCallback;
    OriginalClass.prototype.disconnectedCallback = function () {
      if (originalDisconnectedCallback) {
        originalDisconnectedCallback.call(this);
      }
    };

    const customElementName = options.tag.toLowerCase();

    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, OriginalClass);
    }

    return OriginalClass;
  };
}
