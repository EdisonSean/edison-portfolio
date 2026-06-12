export type WorkCategory =
  | "featured"
  | "cloth"
  | "fluid"
  | "pyro"
  | "particles"
  | "procedural"
  | "rbd";

export type WorkCategoryInfo = {
  slug: WorkCategory;
  index: string;
  label: string;
  meta: string;
  description: string;
  keywords: string[];
};

export const defaultWorkCategory: WorkCategory = "featured";

export const workCategories: WorkCategoryInfo[] = [
  {
    slug: "featured",
    index: "01",
    label: "Featured",
    meta: "Selected commercial",
    description: "A short index of selected commercial FX and motion pieces.",
    keywords: ["selected", "commercial", "fx"],
  },
  {
    slug: "cloth",
    index: "02",
    label: "Cloth / Knitting",
    meta: "Fabric systems",
    description:
      "Commercial cloth, fabric, laces, soft panels, and knitting-led motion.",
    keywords: ["cloth", "knitting", "fabric"],
  },
  {
    slug: "fluid",
    index: "03",
    label: "Fluid",
    meta: "Liquid motion",
    description:
      "Fluid-led commercial shots, from macro gel to product splash work.",
    keywords: ["fluid", "splash", "macro"],
  },
  {
    slug: "pyro",
    index: "04",
    label: "Pyro / Volume",
    meta: "Smoke and heat",
    description:
      "Volume, smoke, heat, and atmosphere built for commercial imagery.",
    keywords: ["pyro", "volume", "smoke"],
  },
  {
    slug: "particles",
    index: "05",
    label: "Particles",
    meta: "Point systems",
    description:
      "Particle systems for commercial reveal, transition, and identity work.",
    keywords: ["particles", "trails", "data"],
  },
  {
    slug: "procedural",
    index: "06",
    label: "Procedural",
    meta: "Generated motion",
    description:
      "Procedural commercial systems for structured motion and repeatable looks.",
    keywords: ["procedural", "systems", "motion"],
  },
  {
    slug: "rbd",
    index: "07",
    label: "RBD / Destruction",
    meta: "Breakage",
    description:
      "Rigid-body and destruction work for commercial reveal sequences.",
    keywords: ["rbd", "fracture", "destruction"],
  },
];
