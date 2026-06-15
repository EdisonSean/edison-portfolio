export type LabCategory = "recent" | "vibecoding";

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
    slug: "vibecoding",
    index: "02",
    label: "VibeCoding",
    meta: "Coding experiments",
    description:
      "Vibe coding experiments, local tools, UI tests, and small software studies.",
    keywords: ["vibecoding", "tools", "experiments"],
  },
];
