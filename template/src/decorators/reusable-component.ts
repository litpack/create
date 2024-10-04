import { SignalWatcher } from '@lit-labs/preact-signals';
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

    if (!customElements.get(options.tag)) {
      customElements.define(options.tag, OriginalClass);
    }

    return OriginalClass;
  };
}
