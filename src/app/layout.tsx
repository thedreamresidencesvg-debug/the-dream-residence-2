import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thedreamresidencesvg.com"),
  title: {
    default: "The Dream Residence | Caribbean Vacation Rental in St. Vincent",
    template: "%s | The Dream Residence",
  },
  description:
    "Your Caribbean escape in Saint Vincent and the Grenadines. Book your stay at our stunning vacation rental with flexible options for every traveler.",
  keywords: [
    "vacation rental",
    "Saint Vincent",
    "Grenadines",
    "Caribbean",
    "holiday home",
    "airbnb",
    "beach house",
    "SVG",
  ],
  openGraph: {
    title: "The Dream Residence | Caribbean Vacation Rental",
    description:
      "Stunning vacation rental in Saint Vincent and the Grenadines. 3 booking options from $150/night.",
    type: "website",
    locale: "en_US",
    url: "https://thedreamresidencesvg.com",
    siteName: "The Dream Residence",
    images: ["/images/exterior/exterior-front-full.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-warm-50 text-warm-900 font-[family-name:var(--font-body)] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
