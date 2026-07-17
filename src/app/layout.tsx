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
  title: "KGM Soins | Soins a domicile a Montreal",
  description:
    "Soins infirmiers et accompagnement a domicile pour personnes agees, personnes en perte d'autonomie, proches aidants et convalescence a Montreal.",
  metadataBase: new URL("https://kgmsoins.com"),
  keywords: [
    "soins a domicile Montreal",
    "infirmiere a domicile Montreal",
    "maintien a domicile",
    "proche aidant",
    "convalescence",
    "soins aux personnes agees",
  ],
  openGraph: {
    title: "KGM Soins | Des soins professionnels, une presence humaine",
    description:
      "Accompagnement et soins infirmiers a domicile pour favoriser le maintien a domicile en toute securite.",
    type: "website",
    locale: "fr_CA",
    siteName: "KGM Soins",
    images: [{ url: "/assets/kgm-hero-home-care.png", width: 1792, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KGM Soins",
    description: "Soins a domicile et accompagnement humain a Montreal.",
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
