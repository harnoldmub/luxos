import cdmPlan from "../assets/images/cdm-plan-principal.png";
import peagePlanImg from "../assets/images/concession-peage-plan.jpg";
import peageMasterplan from "../assets/images/concession-peage-3d-masterplan.jpg";
import hillsFlyer from "../assets/images/luxos-hills-flyer-01.jpg";
import muasiCover from "../assets/images/muasi-ya-talo-2026-cover.jpg";
import azurCover from "../assets/images/campagne-azur-cover-optimized.jpg";

export type DocCategory = "reglements" | "investissement" | "plans" | "brochures";
export type DocKind = "pdf" | "plan" | "brochure";

export type Bilingual = { fr: string; en: string };

export type LuxosDocument = {
  id: string;
  title: Bilingual;
  category: DocCategory;
  kind: DocKind;
  /** URL publique (/documents/*.pdf) ou asset importé (image). */
  file: string;
  /** slug du projet lié, pour l'affichage contextuel sur la page projet. */
  projectSlug?: string;
  description?: Bilingual;
  /** Taille réelle uniquement — jamais inventée. */
  sizeLabel?: string;
};

/**
 * Métadonnées de catégorie (libellés bilingues). Pas de dates inventées :
 * seules les infos réellement connues (type de fichier, taille des PDF) sont exposées.
 */
export const docCategories: { id: DocCategory; label: Bilingual }[] = [
  { id: "reglements", label: { fr: "Règlements", en: "Regulations" } },
  { id: "investissement", label: { fr: "Investissement", en: "Investment" } },
  { id: "plans", label: { fr: "Plans", en: "Plans" } },
  { id: "brochures", label: { fr: "Brochures", en: "Brochures" } }
];

export const documents: LuxosDocument[] = [
  {
    id: "reglement-cdm",
    title: { fr: "Règlement de la concession Cité des Merveilles", en: "Cité des Merveilles concession rules" },
    category: "reglements",
    kind: "pdf",
    file: "/documents/reglement-concession-cite-des-merveilles.pdf",
    projectSlug: "cite-des-merveilles",
    description: {
      fr: "Règlement officiel et avis encadrant la vie et la construction dans la concession Cité des Merveilles.",
      en: "Official rules and notice governing life and construction within the Cité des Merveilles concession."
    },
    sizeLabel: "PDF · 2,8 Mo"
  },
  {
    id: "roi-peage",
    title: { fr: "ROI — Concession Péage", en: "ROI — Péage concession" },
    category: "investissement",
    kind: "pdf",
    file: "/documents/roi-concession-peage.pdf",
    projectSlug: "peage",
    description: {
      fr: "Éléments de rentabilité et de projection d'investissement pour la concession Péage.",
      en: "Profitability and investment projection details for the Péage concession."
    },
    sizeLabel: "PDF · 2,7 Mo"
  },
  {
    id: "plan-cdm",
    title: { fr: "Plan principal — Cité des Merveilles", en: "Master plan — Cité des Merveilles" },
    category: "plans",
    kind: "plan",
    file: cdmPlan,
    projectSlug: "cdm-tongandaku",
    description: { fr: "Plan principal et zones de la Cité des Merveilles.", en: "Master plan and zones of Cité des Merveilles." }
  },
  {
    id: "plan-peage",
    title: { fr: "Plan de lotissement — Concession Péage", en: "Subdivision plan — Péage concession" },
    category: "plans",
    kind: "plan",
    file: peagePlanImg,
    projectSlug: "peage",
    description: { fr: "Plan des lots de la concession Péage.", en: "Plot plan for the Péage concession." }
  },
  {
    id: "masterplan-peage",
    title: { fr: "Masterplan 3D — Concession Péage", en: "3D masterplan — Péage concession" },
    category: "plans",
    kind: "plan",
    file: peageMasterplan,
    projectSlug: "peage",
    description: { fr: "Vision d'aménagement 3D de la concession Péage.", en: "3D development vision of the Péage concession." }
  },
  {
    id: "brochure-hills",
    title: { fr: "Brochure — Luxos Hills", en: "Brochure — Luxos Hills" },
    category: "brochures",
    kind: "brochure",
    file: hillsFlyer,
    projectSlug: "luxos-hills",
    description: { fr: "Présentation du programme résidentiel Luxos Hills.", en: "Overview of the Luxos Hills residential program." }
  },
  {
    id: "brochure-muasi",
    title: { fr: "Brochure — Muasi ya Talo 2026", en: "Brochure — Muasi ya Talo 2026" },
    category: "brochures",
    kind: "brochure",
    file: muasiCover,
    projectSlug: "muasi-ya-talo-2026",
    description: { fr: "Campagne patrimoniale Muasi ya Talo, édition 2026.", en: "Muasi ya Talo heritage campaign, 2026 edition." }
  },
  {
    id: "brochure-azur",
    title: { fr: "Présentation — Concession Luxos Azur", en: "Overview — Concession Luxos Azur" },
    category: "brochures",
    kind: "brochure",
    file: azurCover,
    projectSlug: "azur",
    description: { fr: "Présentation de la campagne Azur : parcelles viabilisées et accompagnement.", en: "Overview of the Azur campaign: serviced plots and support." }
  }
];

export function documentsForProject(slug: string): LuxosDocument[] {
  return documents.filter((doc) => doc.projectSlug === slug);
}
