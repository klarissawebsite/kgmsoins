import { COMPANY, FAQ_ITEMS, SERVICES, SITE_URL } from "@/lib/config";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY.name,
    url: SITE_URL,
    areaServed: COMPANY.region,
    openingHours: "Mo-Su 00:00-23:59",
    image: `${SITE_URL}/assets/kgm-hero-home-care.png`,
    description:
      "Soins infirmiers et accompagnement à domicile pour personnes âgées, proches aidants, personnes en perte d’autonomie et convalescence a Montréal.",
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Soins à domicile Montréal",
    provider: { "@type": "LocalBusiness", name: COMPANY.name, url: SITE_URL },
    areaServed: COMPANY.region,
    serviceType: "Soins infirmiers à domicile, maintien à domicile, accompagnement et convalescence",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services KGM Soins",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        name: service.title,
        description: service.copy,
      })),
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPâge",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
