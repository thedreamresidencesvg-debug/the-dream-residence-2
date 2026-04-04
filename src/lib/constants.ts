export const SITE_NAME = "The Dream Residence";
export const SITE_DESCRIPTION =
  "Your Caribbean escape in Saint Vincent and the Grenadines. Book your stay at our stunning vacation rental with flexible options for every traveler.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const OWNER_EMAIL = "bookings@thedreamresidencesvg.com";
export const WHATSAPP_NUMBER = "17844977361";
export const PHONE_NUMBER = "+1 (784) 497-7361";

export const MIN_NIGHTS = 1;
export const MAX_SHARED_GUESTS = 6;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Pricing" },
  { href: "/gallery", label: "Gallery" },
  { href: "/booking", label: "Book Now" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
