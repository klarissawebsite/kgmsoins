export const COMPANY = {
  name: "KGM Soins",
  shortName: "KGM",
  domain: "kgmsoins.com",
  email: "",
  phone: "",
  region: "Montreal et environs",
  hours: "Ouvert 24 heures, 7 jours sur 7",
};

export const SITE_URL = `https://${COMPANY.domain}`;

export function bookingUrl(content: string): string {
  return `#evaluation?source=${encodeURIComponent(content)}`;
}

export const HERO_COPY = {
  eyebrow: "Soins a domicile a Montreal",
  title: "Des soins professionnels, une presence humaine.",
  text:
    "KGM Soins offre des soins infirmiers et un accompagnement a domicile personnalises pour les personnes agees, les personnes en perte d'autonomie et les personnes en convalescence. Notre mission est de favoriser le maintien a domicile grace a des services securitaires, humains et adaptes aux besoins de chaque personne.",
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
    label: "A partir de 60 $",
    title: "Soins infirmiers a domicile",
    copy:
      "Des interventions professionnelles realisees dans le confort du domicile, avec attention, discretion et respect.",
    points: [
      "Administration d'injections",
      "Changement de pansement avec prescription lorsque requise",
      "Retour securitaire a domicile",
    ],
  },
  {
    id: "sante-bien-etre",
    label: "Evaluation gratuite",
    title: "Sante et bien-etre",
    copy:
      "Un regard clinique et humain pour prevenir les risques, adapter l'accompagnement et soutenir le maintien a domicile.",
    points: [
      "Evaluation des besoins",
      "Visites de prevention",
      "Conseils pour la securite et l'autonomie",
    ],
  },
  {
    id: "accompagnement",
    label: "A partir de 40 $/heure",
    title: "Accompagnement et soutien",
    copy:
      "Une presence rassurante pour les rendez-vous, les soins d'hygiene et les moments ou la famille a besoin de relais.",
    points: [
      "Accompagnement aux rendez-vous",
      "Repit pour proches aidants",
      "Assistance aux soins d'hygiene",
    ],
  },
  {
    id: "retour-domicile",
    label: "Selon les besoins",
    title: "Retour a domicile",
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
  "Respect de la dignite et du rythme de chaque personne",
  "Approche rassurante pour les familles et les proches aidants",
  "Services adaptes au maintien a domicile, pas a une grille unique",
  "Interventions realisees avec professionnalisme, empathie et discretion",
];

export const SEO_TERMS = [
  "soins a domicile Montreal",
  "infirmiere a domicile Montreal",
  "maintien a domicile",
  "proche aidant",
  "convalescence",
  "soins aux personnes agees",
];

export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Est-ce que l'evaluation des besoins est gratuite ?",
    a:
      "Oui. Une evaluation telephonique gratuite permet de comprendre la situation et de vous orienter vers le service le plus adapte.",
  },
  {
    q: "Quels sont les tarifs de depart ?",
    a:
      "Les services d'accompagnement commencent a partir de 40 $/heure et les soins infirmiers a partir de 60 $. Les tarifs varient selon les besoins.",
  },
  {
    q: "Est-ce qu'une ordonnance est toujours necessaire ?",
    a:
      "Certaines interventions infirmieres peuvent exiger une prescription. Le formulaire et l'evaluation permettent de clarifier ce point avant la visite.",
  },
  {
    q: "Aidez-vous apres une hospitalisation ou une chirurgie ?",
    a:
      "Oui. KGM Soins accompagne le retour a domicile avec de la surveillance, des conseils et du soutien pour la convalescence.",
  },
];

export const FORM_NEEDS = [
  "Soins infirmiers a domicile",
  "Accompagnement aux rendez-vous",
  "Repit pour proche aidant",
  "Assistance aux soins d'hygiene",
  "Retour a domicile apres hospitalisation",
  "Maintien a domicile / prevention",
  "Autre situation",
];

export const STARTER_QUESTIONS = [
  "Quels services offrez-vous ?",
  "Combien coutent les soins ?",
  "Puis-je demander une evaluation ?",
  "Aidez-vous apres une hospitalisation ?",
];

export const KNOWLEDGE_BASE = [
  {
    topic: "mission",
    answer:
      "KGM Soins accompagne les personnes agees, les personnes a mobilite reduite et les personnes en convalescence afin de favoriser le maintien a domicile en toute securite.",
  },
  {
    topic: "services",
    answer:
      "Les services incluent les soins infirmiers a domicile, la sante et le bien-etre, l'accompagnement et soutien, ainsi que le retour a domicile apres hospitalisation.",
  },
  {
    topic: "tarifs",
    answer:
      "Les services d'accompagnement sont a partir de 40 $/heure. Les soins infirmiers sont a partir de 60 $. Les tarifs varient selon les besoins.",
  },
  {
    topic: "evaluation",
    answer:
      "Une evaluation telephonique gratuite permet de comprendre la situation et de proposer le service le plus adapte.",
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
  { n: "01", title: "Ecoute", time: "Evaluation gratuite", copy: "On comprend vos besoins." },
  { n: "02", title: "Orientation", time: "Service adapte", copy: "On propose le bon niveau d'aide." },
  { n: "03", title: "Suivi", time: "A domicile", copy: "On accompagne avec respect." },
];
export const INDUSTRIES = FORM_NEEDS;
export const STATS = [
  { value: 24, suffix: "/7", label: "Disponibilite indiquee publiquement" },
  { value: 4, suffix: "", label: "Categories de services" },
  { value: 1, suffix: "", label: "Evaluation telephonique gratuite" },
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
  "Une evaluation telephonique gratuite permet de vous orienter.",
  "Forfaits personnalises bientot disponibles.",
];
