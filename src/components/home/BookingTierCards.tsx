import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { tiers } from "@/data/tiers";
import { formatCurrency } from "@/lib/utils";

export function BookingTierCards() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Choose Your Stay
          </h2>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Three flexible options to fit every traveler. From a private suite
            to the full house, find the perfect arrangement for your Caribbean
            getaway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl overflow-hidden border transition-shadow hover:shadow-xl ${
                tier.popular
                  ? "border-caribbean-400 shadow-lg ring-2 ring-caribbean-400/20"
                  : "border-warm-200 shadow-md"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-caribbean-400 text-warm-900 text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="relative h-48 sm:h-56">
                <Image
                  src={tier.image}
                  alt={tier.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-1">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-caribbean-600">
                    {formatCurrency(tier.price)}
                  </span>
                  <span className="text-warm-500 text-sm">USD / night</span>
                </div>
                <p className="text-warm-500 text-sm mb-5 leading-relaxed">
                  {tier.shortDescription}
                </p>

                <ul className="space-y-2 mb-6">
                  {tier.features.slice(0, 5).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-warm-700"
                    >
                      <Check className="w-4 h-4 text-caribbean-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/booking?tier=${tier.id}`}
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                    tier.popular
                      ? "bg-caribbean-400 text-warm-900 hover:bg-caribbean-500 shadow-md"
                      : "bg-warm-100 text-warm-800 hover:bg-warm-200"
                  }`}
                >
                  Book {tier.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
