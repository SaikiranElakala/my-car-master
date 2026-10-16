import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { client } from "@/config/client";

export const metadata: Metadata = {
  metadataBase: new URL(client.siteUrl),
  title: { default: "My Car Master | Used Car Inspection & New Car PDI", template: "%s | My Car Master" },
  description:
    "My Car Master offers used car evaluation, new car PDI, roadside assistance, used car finance and car insurance enquiries.",
  openGraph: {
    title: "My Car Master",
    description: "Send a vehicle inspection or service request. The My Car Master team will confirm availability and next steps.",
    url: client.siteUrl,
    siteName: "My Car Master",
    type: "website",
    images: [{ url: "/images/cars/webfrontpage.webp", width: 1600, height: 900, alt: "My Car Master vehicle inspection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Car Master",
    description: "Send a vehicle inspection or service request. The team will confirm availability and next steps.",
    images: ["/images/cars/webfrontpage.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#16171A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="pb-[56px] md:pb-0">{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
