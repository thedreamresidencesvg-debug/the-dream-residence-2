import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plane, Clock, MapPin, ShieldCheck } from "lucide-react";
import { property } from "@/data/property";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about The Dream Residence, a Caribbean vacation rental in Saint Vincent and the Grenadines. House rules, getting there, and nearby attractions.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            About The Dream Residence
          </h1>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            A home away from home in the heart of the Caribbean.
          </p>
        </div>

        {/* Hero image + description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="relative h-72 sm:h-96 lg:h-full min-h-[300px] rounded-2xl overflow-hidden">
            <Image
              src="/images/exterior/exterior-front-full.jpg"
              alt="The Dream Residence exterior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
              Welcome to Paradise
            </h2>
            <p className="text-warm-600 leading-relaxed mb-4">
              {property.description}
            </p>
            <p className="text-warm-600 leading-relaxed mb-6">
              Whether you&apos;re seeking a romantic getaway, a family vacation,
              or a budget-friendly adventure with fellow travelers, The Dream
              Residence has the perfect accommodation for you. Choose from our
              Private Suite, Full House, or Shared Space options and make
              unforgettable Caribbean memories.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center self-start px-6 py-3 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-colors"
            >
              Book Your Stay
            </Link>
          </div>
        </div>

        {/* Getting There */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-warm-200 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-caribbean-100 rounded-xl">
              <Plane className="w-6 h-6 text-caribbean-600" />
            </div>
            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
              Getting There
            </h2>
          </div>
          <p className="text-warm-600 leading-relaxed mb-3">
            <strong className="text-warm-900">
              {property.gettingThere.airport}
            </strong>{" "}
            is the main international gateway to Saint Vincent.
          </p>
          <p className="text-warm-600 leading-relaxed">
            {property.gettingThere.description}
          </p>
        </div>

        {/* Check-in/out + House Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-warm-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
                Check-in & Check-out
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-warm-100">
                <span className="text-warm-600">Check-in</span>
                <span className="font-semibold text-warm-900">
                  {property.checkIn}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-warm-600">Check-out</span>
                <span className="font-semibold text-warm-900">
                  {property.checkOut}
                </span>
              </div>
            </div>
            <p className="text-warm-500 text-sm mt-4">
              Early check-in or late check-out may be available upon request.
              Please contact us in advance.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-warm-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
                House Rules
              </h2>
            </div>
            <ul className="space-y-3">
              {property.houseRules.map((rule) => (
                <li
                  key={rule}
                  className="flex items-start gap-2.5 text-warm-600 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nearby Attractions */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-warm-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-caribbean-100 rounded-xl">
              <MapPin className="w-6 h-6 text-caribbean-600" />
            </div>
            <h2 className="text-2xl font-[family-name:var(--font-heading)] font-bold text-warm-900">
              Nearby Attractions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.nearbyAttractions.map((attraction) => (
              <div
                key={attraction.name}
                className="p-5 rounded-xl bg-warm-50 hover:bg-caribbean-50 transition-colors"
              >
                <h3 className="font-semibold text-warm-900 mb-1">
                  {attraction.name}
                </h3>
                <p className="text-warm-500 text-sm mb-2">
                  {attraction.description}
                </p>
                <span className="text-caribbean-600 text-xs font-medium">
                  {attraction.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
