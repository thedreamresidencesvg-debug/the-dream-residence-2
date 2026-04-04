import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Bed, Bath, Users } from "lucide-react";
import { tiers } from "@/data/tiers";
import { formatCurrency } from "@/lib/utils";
import { images } from "@/data/images";

export const metadata: Metadata = {
  title: "Rooms & Pricing",
  description:
    "Choose from three booking options at The Dream Residence. Private Suite from $200/night, Full House from $300/night, or Shared Space from $150/night.",
};

const tierImages: Record<string, string[]> = {
  "private-suite": [
    "/images/bedrooms/bedroom-master-wide.jpg",
    "/images/living-room/living-room-tv.jpg",
    "/images/kitchen/kitchen-full.jpg",
    "/images/bathrooms/bathroom-full.jpg",
  ],
  "full-house": [
    "/images/exterior/exterior-front-full.jpg",
    "/images/bedrooms/bedroom-white-wide.jpg",
    "/images/bedrooms/bedroom-purple.jpg",
    "/images/kitchen/kitchen-full.jpg",
    "/images/living-room/living-room-wide.jpg",
    "/images/bathrooms/bathroom-vanity.jpg",
  ],
  "shared-space": [
    "/images/bedrooms/bedroom-white-angle.jpg",
    "/images/living-room/living-room-angle.jpg",
    "/images/kitchen/kitchen-dining-wide.jpg",
    "/images/dining/dining-outdoor-patio.jpg",
  ],
};

export default function RoomsPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Rooms & Pricing
          </h1>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Three flexible options designed for every type of traveler. All
            prices are per night in USD.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-24">
          {tiers.map((tier, index) => (
            <section
              key={tier.id}
              id={tier.id}
              className={`flex flex-col ${
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-8 lg:gap-12`}
            >
              {/* Images */}
              <div className="lg:w-1/2">
                <div className="grid grid-cols-2 gap-3">
                  {tierImages[tier.id].slice(0, 4).map((src, i) => (
                    <div
                      key={src}
                      className={`relative rounded-xl overflow-hidden ${
                        i === 0 ? "col-span-2 h-48 sm:h-64" : "h-32 sm:h-40"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${tier.name} - ${
                          images.find((img) => img.src === src)?.alt || ""
                        }`}
                        fill
                        className="object-cover"
                        sizes={
                          i === 0
                            ? "(max-width: 1024px) 100vw, 50vw"
                            : "(max-width: 1024px) 50vw, 25vw"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                {tier.popular && (
                  <span className="inline-flex items-center self-start bg-caribbean-400 text-warm-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Most Popular
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-2">
                  {tier.name}
                </h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-caribbean-600">
                    {formatCurrency(tier.price)}
                  </span>
                  <span className="text-warm-500">USD / night</span>
                </div>

                <p className="text-warm-600 leading-relaxed mb-6">
                  {tier.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-warm-600">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-purple-600" />
                    {tier.bedrooms} Bedroom{tier.bedrooms > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-purple-600" />
                    {tier.bathrooms} Bathroom{tier.bathrooms > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    Up to {tier.maxGuests} guests
                  </span>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-warm-700"
                    >
                      <Check className="w-5 h-5 text-caribbean-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/booking?tier=${tier.id}`}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-all shadow-md hover:shadow-lg text-lg self-start"
                >
                  Book {tier.name}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
