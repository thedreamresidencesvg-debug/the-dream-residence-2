import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { property } from "@/data/property";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with The Dream Residence. Send us an inquiry, ask about availability, or book your Caribbean vacation.",
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-bold text-warm-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto">
            Have a question or want to learn more? We&apos;d love to hear from
            you. Reach out and we&apos;ll respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-warm-200">
            <ContactForm />
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-200">
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-warm-900 text-lg mb-4">
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-caribbean-100 rounded-lg shrink-0">
                    <Mail className="w-4 h-4 text-caribbean-600" />
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Email</p>
                    <a
                      href={`mailto:${property.contact.email}`}
                      className="text-warm-900 font-medium hover:text-caribbean-600 transition-colors text-sm break-all"
                    >
                      {property.contact.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-caribbean-100 rounded-lg shrink-0">
                    <Phone className="w-4 h-4 text-caribbean-600" />
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Phone</p>
                    <a
                      href={`tel:${property.contact.phone}`}
                      className="text-warm-900 font-medium hover:text-caribbean-600 transition-colors text-sm"
                    >
                      {property.contact.phoneFormatted}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-caribbean-100 rounded-lg shrink-0">
                    <MapPin className="w-4 h-4 text-caribbean-600" />
                  </div>
                  <div>
                    <p className="text-sm text-warm-500">Location</p>
                    <p className="text-warm-900 font-medium text-sm">
                      Saint Vincent and the Grenadines
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <a
              href={getWhatsAppUrl(
                property.contact.whatsapp,
                "Hi! I have a question about The Dream Residence."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-6 bg-green-50 rounded-2xl border border-green-200 hover:bg-green-100 transition-colors group"
            >
              <div className="p-3 bg-green-500 rounded-xl">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">
                  Chat on WhatsApp
                </p>
                <p className="text-green-700 text-sm">
                  Get a quick response anytime
                </p>
              </div>
            </a>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">
                Response Time
              </h3>
              <p className="text-purple-700 text-sm">
                We typically respond within <strong>2-4 hours</strong> during
                Caribbean business hours (8 AM - 8 PM AST). WhatsApp messages
                get the fastest response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
