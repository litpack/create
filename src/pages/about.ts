import { html, css, LitElement } from "lit";
import { PageComponent } from "@/decorators/page-component";
import "@/components/sample-image";

@PageComponent({ tag: "about-page" })
export default class About extends LitElement {


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
      <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center mb-4">About Us</h1>

        <p class="text-lg text-gray-700 mb-6">
          This is a simple page created using LitElement. It demonstrates how to
          create reusable components and integrate them into a larger web
          application.
        </p>

        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Why LitElement?</h2>
          <p class="text-lg text-gray-600 mt-2">
            LitElement is a simple base class for building fast, lightweight web
            components. It enables developers to create components with a clean
            and minimalistic API, while still providing powerful reactive
            features.
          </p>
        </div>

        <div class="text-center">
          <reusable-image
            src="https://via.placeholder.com/300"
            alt="Sample Image"
          ></reusable-image>
        </div>
      </div>
    `;
  }
}
