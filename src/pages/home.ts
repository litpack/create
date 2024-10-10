import { html, LitElement, PropertyValues } from "lit";
import "@/components/sample-image";
import { PageComponent } from "@/decorators/page-component";
import { signal, computed, effect } from "@lit-labs/preact-signals";

@PageComponent({ tag: "home-page" })
export default class Home extends LitElement {
  count = signal(0);
  name = signal("Jane");
  surname = signal("Doe");

  fullName = computed(() => `${this.name.value} ${this.surname.value}`);

  private nameEffectCleanup?: () => void;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("Component added to the DOM");

    this.nameEffectCleanup = effect(() => {
      console.log(`Full name: ${this.fullName.value}`);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log("Component removed from the DOM");

    if (this.nameEffectCleanup) {
      this.nameEffectCleanup();
    }
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    console.log("Component updated!");
  }

  willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);
    console.log("The component is about to update");
  }

  firstUpdated() {
    console.log("First update and render done!");
  }

  increment() {
    this.count.value++;
  }

  changeName(newName: string) {
    this.name.value = newName;
  }

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
          <p class="text-2xl font-semibold text-blue-600">
            ${this.count.value}
          </p>
          <button
            @click="${this.increment}"
            class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
          >
            Increment
          </button>
        </div>

        <div class="text-center mb-6">
          <h2 class="text-xl text-gray-800">Full Name:</h2>
          <p class="text-2xl font-semibold text-blue-600">
            ${this.fullName.value}
          </p>
          <button
            @click="${() => this.changeName("John")}"
            class="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-all"
          >
            Change Name to John
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
}
