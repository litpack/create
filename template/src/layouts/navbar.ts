import { html, css, LitElement } from "lit";
import { PageComponent } from "@/decorators/page-component";

@PageComponent({ tag: "navbar-layout" })
export default class NotFound extends LitElement {
  static styles = css``;

  render() {
    return html`
      <nav class="p-4 bg-gray-800 text-white">
        <a href="/" class="mr-4">Home</a>
        <a href="/about">About</a>
      </nav>
    `;
  }
}
