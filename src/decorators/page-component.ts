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

    const customElementName = options.tag.toLowerCase();
    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, OriginalClass);
    }

    return OriginalClass;
  };
}
