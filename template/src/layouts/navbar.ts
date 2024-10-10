import { LayoutComponent } from "@/decorators/layout-component";
import { css, html, LitElement } from "lit";

@LayoutComponent({ tag: 'navbar-layout' })
export default class Navbar extends LitElement {
  static styles = css``;

  render() {
    return html`
      <nav class="p-4 bg-gray-800 text-white">
        <a href="/" class="mr-4">Home</a>
        <a href="/about" class="mr-4">About</a>
        <a href="/gallery" class="mr-4">Image Gallery</a>
      </nav>
    `;
  }
}
