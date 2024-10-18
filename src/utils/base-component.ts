import { SignalWatcher } from '@lit-labs/preact-signals';
import { LitElement } from 'lit';
export interface LayoutComponentOptions {
    tag: string;
    properties?: Record<string, any>;
    events?: Record<string, (event: Event) => void>;
}

export interface PageComponentOptions {
    tag: string;
}

export interface ReusableComponentOptions {
    tag: string;
    observedAttributes?: string[];
}

export interface BaseComponentOptions {
    tag: string;
    properties?: Record<string, any>;
    events?: Record<string, (event: Event) => void>;
    observedAttributes?: string[];
}

export function BaseComponent<T extends { new(...args: any[]): LitElement }>(
    options: BaseComponentOptions,
    target: T
) {
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

    if (options.observedAttributes) {
        Object.defineProperty(OriginalClass, 'observedAttributes', {
            value: options.observedAttributes,
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
    }

    return OriginalClass;
}

