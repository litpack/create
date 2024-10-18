import { PageComponent } from "@/decorators/page-component";
import { html, LitElement } from "lit";
import { signal } from "@lit-labs/preact-signals";
import '@/components/sample-image';

@PageComponent({ tag: "image-gallery" })
export default class ImageGallery extends LitElement {
  private images = signal<{ src: string; alt: string }[]>([
    { src: "https://picsum.photos/300/200?random=1", alt: "Random Image 1" },
    { src: "https://picsum.photos/300/200?random=2", alt: "Random Image 2" },
    { src: "https://picsum.photos/300/200?random=3", alt: "Random Image 3" },
    { src: "https://picsum.photos/300/200?random=4", alt: "Random Image 4" },
    { src: "https://picsum.photos/300/200?random=5", alt: "Random Image 5" },
    { src: "https://picsum.photos/300/200?random=6", alt: "Random Image 6" },
  ]);

  render() {
    return html`
      <div class="p-6 max-w-[60rem] mx-auto bg-white rounded-lg shadow-2xl">
        <h1 class="text-3xl font-bold text-center mb-4">Our Image Gallery</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${this.images.value.map(
            (image) => html`
              <reusable-image src="${image.src}" alt="${image.alt}" class="w-full h-auto rounded-md shadow-md"></reusable-image>
            `
          )}
        </div>
      </div>
    `;
  }
}
