export const COMPANY = {
  name: "KGM Soins",
  shortName: "KGM",
  domain: "kgmsoins.com",
  email: "",
  phone: "",
  region: "Montréal et environs",
  hours: "Ouvert 24 heures, 7 jours sur 7",
};

export const SITE_URL = `https://${COMPANY.domain}`;

export function bookingUrl(content: string): string {
  return `#evaluation?source=${encodeURIComponent(content)}`;
}

export const HERO_COPY = {
  eyebrow: "Soins à domicile a Montréal",
  title: "Des soins professionnels, une présence humaine.",
  text:
    "KGM Soins offre des soins infirmiers et un accompagnement à domicile personnalisés pour les personnes âgées, les personnes en perte d’autonomie et les personnes en convalescence. Notre mission est de favoriser le maintien à domicile grace a des services sécuritaires, humains et adaptés aux besoins de chaque personne.",
};

export type Service = {
  id: string;
  title: string;
  label: string;
  copy: string;
  points: string[];
};

export const SERVICES: Service[] = [
  {
    id: "soins-infirmiers",
    label: "À partir de 60 $",
    title: "Soins infirmiers à domicile",
    copy:
      "Des interventions professionnelles realisees dans le confort du domicile, avec attention, discretion et respect.",
    points: [
      "Administration d'injections",
      "Changement de pansement avec prescription lorsque requise",
      "Retour securitaire à domicile",
    ],
  },
  {
    id: "sante-bien-être",
    label: "Évaluation gratuite",
    title: "Santé et bien-être",
    copy:
      "Un regard clinique et humain pour prevenir les risques, adaptér l'accompagnement et soutenir le maintien à domicile.",
    points: [
      "Évaluation des besoins",
      "Visites de prevention",
      "Conseils pour la sécurité et l'autonomie",
    ],
  },
  {
    id: "accompagnement",
    label: "À partir de 40 $/heure",
    title: "Accompagnement et soutien",
    copy:
      "Une présence rassurante pour les rendez-vous, les soins d'hygiene et les moments ou la famille a besoin de relais.",
    points: [
      "Accompagnement aux rendez-vous",
      "Repit pour proches aidants",
      "Assistance aux soins d'hygiene",
    ],
  },
  {
    id: "retour-domicile",
    label: "Selon les besoins",
    title: "Retour à domicile",
    copy:
      "Un soutien apres une hospitalisation ou une chirurgie pour revenir chez soi avec plus de confiance.",
    points: [
      "Surveillance de l'etat general",
      "Conseils apres hospitalisation",
      "Soutien a la convalescence",
    ],
  },
];

export const WHY_POINTS = [
  "Respect de la dignité et du rythme de chaque personne",
  "Approche rassurante pour les familles et les proches aidants",
  "Services adaptés au maintien à domicile, pas a une grille unique",
  "Interventions realisees avec professionnalisme, empathie et discretion",
];

export const SEO_TERMS = [
  "soins à domicile Montréal",
  "infirmière à domicile Montréal",
  "maintien à domicile",
  "proche aidant",
  "convalescence",
  "soins aux personnes âgées",
];

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Est-ce que l'évaluation des besoins est gratuite ?",
    a:
      "Oui. Une évaluation telephonique gratuite permet de comprendre la situation et de vous orienter vers le service le plus adapté.",
  },
  {
    q: "Quels sont les tarifs de depart ?",
    a:
      "Les services d'accompagnement commencent a partir de 40 $/heure et les soins infirmiers a partir de 60 $. Les tarifs varient selon les besoins.",
  },
  {
    q: "Est-ce qu'une ordonnance est toujours necessaire ?",
    a:
      "Certaines interventions infirmières peuvent exiger une prescription. Le formulaire et l'évaluation permettent de clarifier ce point avant la visite.",
  },
  {
    q: "Aidez-vous apres une hospitalisation ou une chirurgie ?",
    a:
      "Oui. KGM Soins accompagne le retour à domicile avec de la surveillance, des conseils et du soutien pour la convalescence.",
  },
];

export const FORM_NEEDS = [
  "Soins infirmiers à domicile",
  "Accompagnement aux rendez-vous",
  "Repit pour proche aidant",
  "Assistance aux soins d'hygiene",
  "Retour à domicile apres hospitalisation",
  "Maintien à domicile / prevention",
  "Autre situation",
];

export const STARTER_QUESTIONS = [
  "Quels services offrez-vous ?",
  "Combien coûtent les soins ?",
  "Puis-je demander une évaluation ?",
  "Aidez-vous apres une hospitalisation ?",
];

export const KNOWLEDGE_BASE = [
  {
    topic: "mission",
    answer:
      "KGM Soins accompagne les personnes âgées, les personnes a mobilite reduite et les personnes en convalescence afin de favoriser le maintien à domicile en toute sécurité.",
  },
  {
    topic: "services",
    answer:
      "Les services incluent les soins infirmiers à domicile, la sante et le bien-être, l'accompagnement et soutien, ainsi que le retour à domicile apres hospitalisation.",
  },
  {
    topic: "tarifs",
    answer:
      "Les services d'accompagnement sont a partir de 40 $/heure. Les soins infirmiers sont a partir de 60 $. Les tarifs varient selon les besoins.",
  },
  {
    topic: "évaluation",
    answer:
      "Une évaluation telephonique gratuite permet de comprendre la situation et de proposer le service le plus adapté.",
  },
];

// Compatibility exports kept for copied components that may be reused later.
export const BOOKING_URL = "#evaluation";
export const FEATURES = SERVICES.map((service, index) => ({
  id: service.id,
  label: `${String(index + 1).padStart(2, "0")} - ${service.label}`,
  title: service.title,
  copy: service.copy,
}));
export const STEPS = [
  { n: "01", title: "Ecoûte", time: "Évaluation gratuite", copy: "On comprend vos besoins." },
  { n: "02", title: "Orientation", time: "Service adapté", copy: "On propose le bon niveau d'aide." },
  { n: "03", title: "Suivi", time: "À domicile", copy: "On accompagne avec respect." },
];
export const INDUSTRIES = FORM_NEEDS;
export const STATS = [
  { value: 24, suffix: "/7", label: "Disponibilité indiquee publiquement" },
  { value: 4, suffix: "", label: "Catégories de services" },
  { value: 1, suffix: "", label: "Évaluation telephonique gratuite" },
];
export const PLANS = SERVICES.map((service) => ({
  id: service.id,
  name: service.title,
  price: service.id === "accompagnement" ? 40 : 60,
  tagline: service.label,
  features: service.points,
}));
export const PRICING_NOTES = [
  "Les tarifs varient selon les besoins.",
  "Une évaluation telephonique gratuite permet de vous orienter.",
  "Forfaits personnalisés bientot disponibles.",
];
