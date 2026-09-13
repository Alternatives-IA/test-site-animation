import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { BRAND } from "@/lib/brand";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({
  variable: "--font-mono-local",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#00060f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://reflexrent.fr"),
  title:
    "ReflexRent — Location Voiture de Luxe · Ferrari, Lamborghini, Mercedes · Paris",
  description:
    "Ferrari, Lamborghini, Range Rover, Mercedes G, Maybach, Porsche… Plus de 50 véhicules d'exception en location courte ou longue durée à Paris. Livraison à domicile, chauffeur sur demande, réservation WhatsApp 7j/7. L'art de rouler autrement.",
  keywords: [
    "ReflexRent",
    "reflex rent",
    "location voiture de luxe Paris",
    "location Ferrari Paris",
    "location Lamborghini Paris",
    "location supercar Paris",
    "location Mercedes Classe G",
    "location Range Rover Paris",
    "location voiture haut de gamme",
    "location voiture sportive",
    "location voiture mariage Paris",
    "location voiture longue durée",
    "chauffeur privé Paris",
    "location véhicule prestige Paris 16",
  ],
  robots: { index: true, follow: true },
  category: "Vehicle rental",
  openGraph: {
    title: "ReflexRent — Location de Véhicules d'Exception · Paris",
    description: "L'art de rouler autrement.",
    siteName: "ReflexRent",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ReflexRent — Location de véhicules d'exception",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReflexRent — Location voiture de luxe Paris",
    description: "L'art de rouler autrement.",
    images: ["/og-image.png"],
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  name: BRAND.name,
  alternateName: ["Reflex Rent", "ReflexRent Paris"],
  url: "https://reflexrent.fr",
  logo: "https://reflexrent.fr/icon.png",
  image: "https://reflexrent.fr/og-image.png",
  description:
    "Location de voitures de luxe et de véhicules d'exception à Paris. Ferrari, Lamborghini, Range Rover, Mercedes-Maybach, Porsche.",
  priceRange: "€€€",
  foundingDate: String(BRAND.foundedYear),
  telephone: `+${BRAND.whatsapp.e164}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: BRAND.address.street,
    addressLocality: "Paris",
    postalCode: "75016",
    addressCountry: "FR",
  },
  areaServed: { "@type": "Country", name: "France" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "09:00",
    closes: "20:00",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${mono.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <div className="bg-orbs" aria-hidden />
        <Nav />
        <main className="relative z-10">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
