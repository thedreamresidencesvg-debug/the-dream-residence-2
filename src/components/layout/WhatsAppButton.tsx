import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function WhatsAppButton() {
  const url = getWhatsAppUrl(
    WHATSAPP_NUMBER,
    "Hi! I'm interested in booking The Dream Residence."
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}
