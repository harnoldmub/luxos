import logo from "./assets/images/logo-luxos-rdc.png";
import azur from "./assets/images/campagne-azur-cover-optimized.jpg";
import azurPoster from "./assets/images/concession-luxos-azur-3d-villa.jpg";
import hills1 from "./assets/images/luxos-hills-flyer-01.jpg";
import hills2 from "./assets/images/luxos-hills-flyer-02.jpg";
import muasi from "./assets/images/muasi-ya-talo-2026-women-investors.jpg";
import muasiOriginal from "./assets/images/muasi-ya-talo-2026-cover.jpg";
import cdmPlan from "./assets/images/cdm-plan-principal.png";
import cdmPoster from "./assets/images/maison-cdm-kinshasa-delivery.jpg";
import cdmHouse from "./assets/images/maison-cdm-type-39-exterior.jpg";
import cdmInterior from "./assets/images/maison-cdm-type-39-interior.jpg";
import cite from "./assets/images/cite-des-merveilles-aerial-view.jpg";
import citeRoad from "./assets/images/cite-des-merveilles-road.jpg";
import peage from "./assets/images/concession-peage-cover.jpg";
import peagePoster from "./assets/images/concession-peage-3d-masterplan.jpg";
import peagePlan from "./assets/images/concession-peage-plan.jpg";
import luxosC from "./assets/images/luxos-c-site-view.jpg";
import luxosCPlot from "./assets/images/luxos-c-parcelle-01.jpg";
import aboutTeam from "./assets/images/about-luxos-team.png";
import advisorDiaspora from "./assets/images/luxos-advisor-diaspora-investment.jpg";

export const assets = {
  logo,
  hero: advisorDiaspora,
  aboutTeam,
  advisorDiaspora,
  cdmPlan,
  construction: cdmHouse,
  constructionInterior: cdmInterior,
  citeMerveilles: cite,
  peagePlan
};

export type Project = {
  slug: string;
  title: string;
  type: "Campagne" | "Concession" | "Programme" | "Campaign" | "Program";
  location: string;
  status: string;
  price: string;
  monthly?: string;
  image: string;
  coverImage?: string;
  gallery: string[];
  summary: string;
  details: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "azur",
    title: "Concession Luxos Azur",
    type: "Campagne",
    location: "Kinshasa, RDC",
    status: "Nouvelle campagne",
    price: "Sur demande",
    image: azur,
    coverImage: azurPoster,
    gallery: [azur, citeRoad, luxosCPlot],
    summary: "Une campagne pensée pour devenir propriétaire avec simplicité, accompagnement commercial et transparence sur les étapes.",
    details: ["Parcelles viabilisées", "Suivi commercial dédié", "Options de paiement souples"],
    highlights: ["Achat accompagné", "Documents suivis", "Visite terrain"]
  },
  {
    slug: "luxos-hills",
    title: "Luxos Hills",
    type: "Campagne",
    location: "Périphérie de Kinshasa",
    status: "Offre en cours",
    price: "Opportunités disponibles",
    image: hills1,
    gallery: [hills1, hills2, cite],
    summary: "Un programme résidentiel à l'image d'une nouvelle génération d'investisseurs : clair, ambitieux et durable.",
    details: ["Lots résidentiels", "Projection patrimoniale", "Accompagnement diaspora"],
    highlights: ["Site premium", "Plans disponibles", "Réservation guidée"]
  },
  {
    slug: "muasi-ya-talo-2026",
    title: "Muasi ya Talo 2026",
    type: "Campagne",
    location: "RDC",
    status: "Edition 2026",
    price: "Formules dédiées",
    image: muasiOriginal,
    coverImage: muasi,
    gallery: [muasiOriginal],
    summary: "Une expérience d'investissement accessible et rassurante qui valorise les femmes bâtisseuses et la transmission familiale.",
    details: ["Offre à durée limitée", "Conseils personnalisés", "Suivi administratif"],
    highlights: ["Femmes de valeur", "Paiement progressif", "Patrimoine familial"]
  },
  {
    slug: "cdm-tongandaku",
    title: "Maison CDM - Tonga ndako ya lobi",
    type: "Campagne",
    location: "Cité des Merveilles",
    status: "Construction maison",
    price: "A partir de 30 000 $",
    monthly: "250 $ / mois pendant 120 mois",
    image: cdmHouse,
    coverImage: cdmPoster,
    gallery: [cdmHouse, cdmInterior, cdmPlan],
    summary: "La campagne qui transforme une parcelle CDM en maison de demain, avec plans, zones et mensualités lisibles.",
    details: ["Maisons basses et R+1", "Zones Zamundu, Abbé, Lipanda, CRS", "Mensualités jusqu'à 120 mois"],
    highlights: ["Tonga ndako ya lobi", "Plans sommaires", "Construction encadrée"]
  },
  {
    slug: "cite-des-merveilles",
    title: "Cité des Merveilles",
    type: "Concession",
    location: "Kinshasa, RDC",
    status: "Concession historique",
    price: "Lots selon zone",
    image: cite,
    gallery: [cite, citeRoad, cdmPlan],
    summary: "Une concession structurante de Luxos RDC, pensée pour bâtir, habiter et transmettre dans un cadre organisé.",
    details: ["Présentation de la cité", "Galerie et plan", "Règlement de concession"],
    highlights: ["Zones identifiées", "Cadre organisé", "Communauté résidentielle"]
  },
  {
    slug: "peage",
    title: "Concession Péage",
    type: "Concession",
    location: "Route du Péage",
    status: "Lots disponibles",
    price: "A partir de 2 500 $",
    image: peage,
    coverImage: peagePoster,
    gallery: [peage, peagePlan],
    summary: "Une concession accessible pour concrétiser un investissement immobilier avec des règles claires et une gestion professionnelle.",
    details: ["Présentation de la cité", "Galerie et plan", "ROI concession Péage"],
    highlights: ["Offres terrain", "Règles de revente", "Construction accompagnée"]
  },
  {
    slug: "luxos-c",
    title: "Luxos C SARL",
    type: "Programme",
    location: "RDC",
    status: "Programme immobilier",
    price: "Sur consultation",
    image: luxosC,
    gallery: [luxosC, luxosCPlot, citeRoad],
    summary: "Une collection de parcelles et opportunités Luxos C avec galerie, accompagnement et projection patrimoniale.",
    details: ["Parcelles disponibles", "Galerie terrain", "Accompagnement achat"],
    highlights: ["Investissement foncier", "Conseil dédié", "Suivi Luxos"]
  }
];

export const services = [
  ["Vente immobilière", "Acquisition de terrains, parcelles et biens avec un parcours clair du premier contact à la remise documentaire."],
  ["Construction sur mesure", "Bureau d'études, plans, exécution et suivi pour construire la maison qui respecte votre budget."],
  ["Location immobilière", "Gestion et valorisation de biens pour sécuriser les revenus et simplifier le quotidien."],
  ["Clôtures et travaux", "Travaux courants, clôtures, agrandissements et rénovations pour protéger et améliorer votre bien."]
];

export const faq = [
  ["Puis-je acheter depuis l'étranger ?", "Oui. L'espace Diaspora prévoit un accompagnement à distance, des rendez-vous adaptés au fuseau horaire et un suivi documentaire."],
  ["Quels sont les moyens de paiement ?", "Luxos Cash permet un paiement en une fois. Luxos Green permet un paiement progressif à 0 % de taux d'intérêt selon les conditions de l'offre."],
  ["Comment vérifier la sécurité d'une parcelle ?", "Luxos accompagne les étapes commerciales, administratives et documentaires afin de limiter les risques et clarifier l'achat."],
  ["Lina utilise-t-elle une IA ?", "Pour cette V1, Lina fonctionne avec des scénarios scriptés. Le code est isolé pour permettre un branchement API IA plus tard."]
];
