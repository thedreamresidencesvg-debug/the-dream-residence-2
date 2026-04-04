import { MapPin, Plane, Ship } from "lucide-react";
import { property } from "@/data/property";

export function LocationSection() {
  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Discover St. Vincent
          </h2>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            An unspoiled Caribbean paradise waiting to be explored. From lush
            rainforests to pristine beaches, adventure is always nearby.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-80 lg:h-full min-h-[320px] bg-warm-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248366.97058381!2d-61.37!3d13.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c43bb0f40c34979%3A0x5c0a5b5e75d3a1f0!2sSaint%20Vincent%20and%20the%20Grenadines!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Dream Residence location"
            />
          </div>

          {/* Nearby attractions */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-caribbean-100 rounded-lg">
                <Plane className="w-5 h-5 text-caribbean-600" />
              </div>
              <div>
                <h3 className="font-semibold text-warm-900">
                  {property.gettingThere.airport}
                </h3>
                <p className="text-sm text-warm-500">International Airport</p>
              </div>
            </div>

            <h3 className="text-lg font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
              Nearby Attractions
            </h3>

            <div className="space-y-4">
              {property.nearbyAttractions.map((attraction) => (
                <div
                  key={attraction.name}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white border border-warm-200 hover:border-caribbean-300 transition-colors"
                >
                  <div className="p-1.5 bg-purple-50 rounded-lg shrink-0 mt-0.5">
                    {attraction.distance.includes("ferry") ? (
                      <Ship className="w-4 h-4 text-purple-600" />
                    ) : (
                      <MapPin className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-warm-900 text-sm">
                      {attraction.name}
                    </h4>
                    <p className="text-warm-500 text-sm">
                      {attraction.description}
                    </p>
                    <span className="text-caribbean-600 text-xs font-medium mt-1 inline-block">
                      {attraction.distance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
