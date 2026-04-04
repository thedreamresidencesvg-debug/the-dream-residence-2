import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photos of The Dream Residence - a stunning Caribbean vacation rental in Saint Vincent and the Grenadines.",
};

export default function GalleryPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Photo Gallery
          </h1>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Take a virtual tour of The Dream Residence. Click any photo to view
            it in full size.
          </p>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
}
