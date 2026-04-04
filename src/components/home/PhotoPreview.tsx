import Image from "next/image";
import Link from "next/link";
import { featuredImages } from "@/data/images";

export function PhotoPreview() {
  const previewImages = featuredImages.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Take a Tour
          </h2>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Explore our beautifully furnished Caribbean home, from the spacious
            living areas to the comfortable bedrooms.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {previewImages.map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2 h-64 sm:h-96" : "h-40 sm:h-48"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={
                  i === 0
                    ? "(max-width: 768px) 100vw, 66vw"
                    : "(max-width: 768px) 50vw, 33vw"
                }
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3 bg-warm-800 text-white font-semibold rounded-lg hover:bg-warm-900 transition-colors"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
