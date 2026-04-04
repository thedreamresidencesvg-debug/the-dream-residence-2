import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "New York, USA",
    text: "An absolutely stunning property! The house was immaculate, the kitchen was fully equipped, and the beds were incredibly comfortable. We loved every minute of our stay in St. Vincent.",
    rating: 5,
  },
  {
    name: "James & Keisha T.",
    location: "London, UK",
    text: "The Dream Residence truly lives up to its name. The outdoor patio was our favorite spot for morning coffee. The owner was responsive and made check-in seamless. Will definitely return!",
    rating: 5,
  },
  {
    name: "David R.",
    location: "Toronto, Canada",
    text: "Perfect for our family vacation. Having the full house to ourselves gave us so much space. The AC in every room was a lifesaver, and the kitchen made cooking local dishes a joy.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-purple-600">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold text-white mb-4">
            What Our Guests Say
          </h2>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Hear from travelers who have experienced the magic of The Dream
            Residence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((review) => (
            <div
              key={review.name}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-caribbean-400 fill-caribbean-400"
                  />
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p className="text-white font-semibold text-sm">
                  {review.name}
                </p>
                <p className="text-purple-300 text-xs">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
