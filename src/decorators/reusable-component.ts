import { SignalWatcher } from '@lit-labs/preact-signals';
import { LitElement } from 'lit';

interface ReusableComponentOptions {
  tag: string;
  observedAttributes?: string[];
}

export function ReusableComponent<T extends { new (...args: any[]): LitElement }>(
  options: ReusableComponentOptions
) {
  return function (target: T) {
    if (!(target.prototype instanceof LitElement)) {
      Object.setPrototypeOf(target.prototype, LitElement.prototype);
    }

    const OriginalClass = SignalWatcher(target);

    const customElementName = options.tag.toLowerCase();
    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, OriginalClass);
    }

    Object.defineProperty(OriginalClass, 'observedAttributes', {
      value: options.observedAttributes || [],
      writable: false,
      configurable: false,
    });

    OriginalClass.prototype.attributeChangedCallback = function (
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      this.handleAttributeChange(name, oldValue, newValue);
    };

    return OriginalClass;
  };
}
