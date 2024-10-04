import { html, css, LitElement } from "lit";
import { PageComponent } from "../decorators/page-component";
import "../components/sample-image";

@PageComponent({ tag: "notfound-page" })
export default class NotFound extends LitElement {
  static styles = css`
    h1 {
      background-color: #16a34a;
      color: white;
    }
    p {
      color: #374151;
    }
  `;

  render() {
    return html`
      <h1>404, Not found :(</h1>
    `;
  }
}
