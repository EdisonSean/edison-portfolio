export type LabCategory =
  | "recent"
  | "all"
  | "rd"
  | "simulation"
  | "shader"
  | "motion"
  | "practice";

export type LabCategoryInfo = {
  slug: LabCategory;
  index: string;
  label: string;
  meta: string;
  description: string;
  keywords: string[];
};

export const defaultLabCategory: LabCategory = "recent";

export const labCategories: LabCategoryInfo[] = [
  {
    slug: "recent",
    index: "01",
    label: "Recent",
    meta: "Latest notes",
    description:
      "Recent non-commercial experiments and small technical studies.",
    keywords: ["recent", "tests", "notes"],
  },
  {
    slug: "rd",
    index: "02",
    label: "R&D",
    meta: "Research",
    description:
      "Small research tracks for techniques that may become production tools.",
    keywords: ["r&d", "systems", "research"],
  },
  {
    slug: "simulation",
    index: "03",
    label: "Simulation",
    meta: "FX tests",
    description:
      "Non-commercial simulation tests for motion, behavior, and timing.",
    keywords: ["sim", "solver", "tests"],
  },
  {
    slug: "shader",
    index: "04",
    label: "Shader",
    meta: "Look tests",
    description: "Shader, material, SDF, and render experiments.",
    keywords: ["shader", "sdf", "lookdev"],
  },
  {
    slug: "motion",
    index: "05",
    label: "Motion",
    meta: "Design drills",
    description: "Short motion studies and procedural animation exercises.",
    keywords: ["motion", "timing", "animation"],
  },
  {
    slug: "practice",
    index: "06",
    label: "Practice",
    meta: "Exercises",
    description:
      "Practice files, small rebuilds, and focused learning sketches.",
    keywords: ["practice", "sketch", "exercise"],
  },
  {
    slug: "all",
    index: "07",
    label: "All",
    meta: "Full lab index",
    description:
      "The full lab index for experiments, R&D, tests, and practice work.",
    keywords: ["all", "archive", "lab"],
  },
];
