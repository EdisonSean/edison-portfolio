export type WorkCategory =
  | "featured"
  | "all"
  | "cloth"
  | "fluid"
  | "pyro"
  | "particles"
  | "procedural";

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
    slug: "particles",
    index: "03",
    label: "Particles",
    meta: "Point systems",
    description:
      "Particle systems for commercial reveal, transition, and identity work.",
    keywords: ["particles", "trails", "data"],
  },
  {
    slug: "fluid",
    index: "04",
    label: "Fluid",
    meta: "Liquid motion",
    description:
      "Fluid-led commercial shots, from macro gel to product splash work.",
    keywords: ["fluid", "splash", "macro"],
  },
  {
    slug: "procedural",
    index: "05",
    label: "Procedural",
    meta: "Generated motion",
    description:
      "Procedural commercial systems for structured motion and repeatable looks.",
    keywords: ["procedural", "systems", "motion"],
  },
  {
    slug: "pyro",
    index: "06",
    label: "Pyro / RBD",
    meta: "Smoke, heat, and breakage",
    description:
      "Volume, smoke, heat, rigid-body, and destruction work for commercial imagery.",
    keywords: ["pyro", "rbd", "volume", "fracture", "destruction"],
  },
  {
    slug: "all",
    index: "07",
    label: "All",
    meta: "Full work index",
    description: "The full commercial archive across every work category.",
    keywords: ["all", "archive", "commercial"],
  },
];
