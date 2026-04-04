import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <Image
        src="/images/exterior/exterior-front-full.jpg"
        alt="The Dream Residence - Caribbean vacation rental"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <p className="text-caribbean-300 font-medium text-sm sm:text-base tracking-widest uppercase mb-4">
          Saint Vincent and the Grenadines
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-6 leading-tight">
          The Dream{" "}
          <span className="text-caribbean-400">Residence</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your Caribbean escape awaits. A stunning vacation home with modern
          comforts, breathtaking views, and authentic island charm.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/booking"
            className="px-8 py-4 bg-caribbean-400 text-warm-900 font-bold rounded-lg hover:bg-caribbean-500 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Book Your Stay
          </Link>
          <Link
            href="/rooms"
            className="px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/25 transition-all border border-white/30 text-lg"
          >
            Explore Rooms
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
