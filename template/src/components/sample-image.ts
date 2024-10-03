import { html, LitElement, css } from 'lit';
import { ReusableComponent } from '../decorators/reusable-component';
import { property } from 'lit/decorators.js';

@ReusableComponent({ tag: 'reusable-image' })
export class SampleImage extends LitElement {
  static styles = css`
    .image-container {
      text-align: center;
    }
    img {
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `;

  private _src: string = '';
  private _alt: string = 'Reusable image';

  @property({ type: String })
  get src(): string {
    return this._src;
  }

  set src(value: string) {
    const oldValue = this._src;
    if (oldValue !== value) {
      this._src = value;
      this.requestUpdate('src', oldValue);
    }
  }

  @property({ type: String })
  get alt(): string {
    return this._alt;
  }

  set alt(value: string) {
    const oldValue = this._alt;
    if (oldValue !== value) {
      this._alt = value;
      this.requestUpdate('alt', oldValue);
    }
  }

  render() {
    return html`
      <div class="image-container">
        <img src="${this.src}" alt="${this.alt}" />
      </div>
    `;
  }
}
