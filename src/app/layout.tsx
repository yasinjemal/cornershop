import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Providers from "@/components/Providers";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menscorner.co.za";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1D23",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mens Corner — Premium Men's Fashion",
    template: "%s | Mens Corner",
  },
  description:
    "Premium men's suits, formal wear, and accessories for the modern South African man. Free delivery over R1,500.",
  keywords: [
    "mens fashion",
    "suits",
    "formal wear",
    "South Africa",
    "menswear",
    "Johannesburg",
    "wholesale",
    "mens corner",
  ],
  authors: [{ name: "Mens Corner" }],
  creator: "Mens Corner",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Mens Corner",
    title: "Mens Corner — Premium Men's Fashion",
    description:
      "Premium men's suits, formal wear, and accessories for the modern South African man.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mens Corner — Premium Men's Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mens Corner — Premium Men's Fashion",
    description:
      "Premium men's suits, formal wear, and accessories for the modern South African man.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
