import { html, LitElement } from "lit";
import "../components/sample-image";
import { PageComponent } from "../decorators/page-component";

@PageComponent({ name: "home-page" })
export default class Home extends LitElement {
  createRenderRoot() {
    return this;
  }

  private count = 0;

  render() {
    return html`
      <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold text-center text-green-700 mb-4">
          Welcome to the Home Page
        </h1>

        <p class="text-lg text-gray-700 mb-6">
          This is a simple frontend framework project built with Lit,
          TailwindCSS, and custom routing. It demonstrates how to structure a
          simple web application using Web Components.
        </p>

        <div class="text-center mb-6">
          <h2 class="text-xl text-gray-800">Click the button to increment:</h2>
          <p class="text-2xl font-semibold text-blue-600">${this.count}</p>
          <button
            @click="${this.increment}"
            class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            Increment
          </button>
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

  increment() {
    this.count += 1;
    this.requestUpdate();
  }
}
