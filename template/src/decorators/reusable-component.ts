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

    const customElementName = options.tag.toLowerCase();
    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, target);
    }

    Object.defineProperty(target, 'observedAttributes', {
      value: options.observedAttributes || [],
      writable: false,
      configurable: false,
    });

    target.prototype.attributeChangedCallback = function (
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      this.handleAttributeChange(name, oldValue, newValue);
    };

    return target;
  };
}
