import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KGM Soins | Soins à domicile à Montréal",
  description:
    "Soins infirmiers et accompagnement à domicile pour personnes âgées, personnes en perte d’autonomie, proches aidants et convalescence a Montréal.",
  metadataBase: new URL("https://kgmsoins.com"),
  keywords: [
    "soins à domicile Montréal",
    "infirmière à domicile Montréal",
    "maintien à domicile",
    "proche aidant",
    "convalescence",
    "soins aux personnes âgées",
  ],
  openGraph: {
    title: "KGM Soins | Des soins professionnels, une présence humaine",
    description:
      "Accompagnement et soins infirmiers à domicile pour favoriser le maintien à domicile en toute sécurité.",
    type: "website",
    locale: "fr_CA",
    siteName: "KGM Soins",
    images: [{ url: "/assets/kgm-hero-home-care.png", width: 1792, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KGM Soins",
    description: "Soins à domicile et accompagnement humain a Montréal.",
    images: ["/assets/kgm-hero-home-care.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBFCFA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr-CA" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
