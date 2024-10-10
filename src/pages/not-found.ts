import { html, css, LitElement } from "lit";
import { PageComponent } from "@/decorators/page-component";
import "@/components/sample-image";

@PageComponent({ tag: "notfound-page" })
export default class NotFound extends LitElement {
  static styles = css`
  `;

  render() {
    return html`
      <h1>404, Not found :(</h1>
    `;
  }
}
