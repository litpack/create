import { SignalWatcher } from '@lit-labs/preact-signals';
import { LitElement } from 'lit';

interface LayoutComponentOptions {
  tag: string;
  properties?: Record<string, any>;
  events?: Record<string, (event: Event) => void>;
}

export function LayoutComponent(options: LayoutComponentOptions) {
  return function <T extends { new (...args: any[]): LitElement }>(target: T) {
    if (!(target.prototype instanceof LitElement)) {
      Object.setPrototypeOf(target.prototype, LitElement.prototype);
    }

    const OriginalClass = SignalWatcher(target);

    OriginalClass.prototype.createRenderRoot = function () {
      return this;
    };

    if (options.properties) {
      for (const [key, value] of Object.entries(options.properties)) {
        OriginalClass.prototype[key] = value;
      }
    }

    if (options.events) {
      for (const [eventName, handler] of Object.entries(options.events)) {
        OriginalClass.prototype[`on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`] = handler;
      }
    }

    const customElementName = options.tag.toLowerCase();
    if (!customElements.get(customElementName)) {
      customElements.define(customElementName, OriginalClass);
    }

    return OriginalClass;
  };
}
