import {
  Snowflake,
  Wifi,
  Tv,
  CookingPot,
  Car,
  WashingMachine,
  ShowerHead,
  TreePalm,
  Lock,
  Mountain,
  Utensils,
  BedDouble,
} from "lucide-react";
import { amenities } from "@/data/amenities";

const iconMap: Record<string, React.ElementType> = {
  Snowflake,
  Wifi,
  Tv,
  CookingPot,
  Car,
  WashingMachine,
  ShowerHead,
  TreePalm,
  Lock,
  Mountain,
  Utensils,
  BedDouble,
};

export function AmenitiesGrid() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Modern amenities and Caribbean charm come together to make your stay
            comfortable and memorable.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {amenities.map((amenity) => {
            const Icon = iconMap[amenity.icon];
            return (
              <div
                key={amenity.label}
                className="flex flex-col items-center gap-3 p-5 rounded-xl bg-warm-50 hover:bg-caribbean-50 transition-colors group"
              >
                {Icon && (
                  <Icon className="w-7 h-7 text-purple-600 group-hover:text-caribbean-500 transition-colors" />
                )}
                <span className="text-sm font-medium text-warm-700 text-center">
                  {amenity.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
