import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { property } from "@/data/property";

export function Footer() {
  return (
    <footer className="bg-warm-800 text-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-[family-name:var(--font-heading)] font-bold text-white mb-3">
              The Dream Residence
            </h3>
            <p className="text-warm-400 text-sm leading-relaxed">
              Your Caribbean escape in Saint Vincent and the Grenadines.
              Experience island living at its finest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/rooms", label: "Rooms & Pricing" },
                { href: "/gallery", label: "Gallery" },
                { href: "/booking", label: "Book Now" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-400 hover:text-caribbean-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-caribbean-400 shrink-0" />
                <a
                  href={`mailto:${property.contact.email}`}
                  className="text-warm-400 hover:text-caribbean-400 transition-colors text-sm break-all"
                >
                  {property.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-caribbean-400 shrink-0" />
                <a
                  href={`tel:${property.contact.phone}`}
                  className="text-warm-400 hover:text-caribbean-400 transition-colors text-sm"
                >
                  {property.contact.phoneFormatted}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-caribbean-400 shrink-0" />
                <span className="text-warm-400 text-sm">
                  Saint Vincent and the Grenadines
                </span>
              </li>
            </ul>
          </div>

          {/* Booking Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Booking Info
            </h4>
            <ul className="space-y-2 text-sm text-warm-400">
              <li>Check-in: {property.checkIn}</li>
              <li>Check-out: {property.checkOut}</li>
              <li>From $150 USD / night</li>
            </ul>
            <Link
              href="/booking"
              className="inline-block mt-4 px-5 py-2 bg-caribbean-400 text-warm-900 font-semibold rounded-lg hover:bg-caribbean-500 transition-colors text-sm"
            >
              Book Your Stay
            </Link>
          </div>
        </div>

        <div className="border-t border-warm-700 mt-10 pt-6 text-center text-warm-500 text-sm space-y-1">
          <p>
            &copy; {new Date().getFullYear()} The Dream Residence. All rights
            reserved.
          </p>
          <p>
            Designed by Ryan NovaSoMean McKie / Higandei Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}
