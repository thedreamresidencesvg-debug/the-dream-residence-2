import { Hero } from "@/components/home/Hero";
import { BookingTierCards } from "@/components/home/BookingTierCards";
import { PhotoPreview } from "@/components/home/PhotoPreview";
import { AmenitiesGrid } from "@/components/home/AmenitiesGrid";
import { LocationSection } from "@/components/home/LocationSection";
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BookingTierCards />
      <PhotoPreview />
      <AmenitiesGrid />
      <Testimonials />
      <LocationSection />
    </>
  );
}
