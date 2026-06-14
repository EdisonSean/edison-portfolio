import { clothWorks } from "@/data/workItems/cloth";
import { featuredWorks } from "@/data/workItems/featured";
import { fluidWorks } from "@/data/workItems/fluid";
import { particlesWorks } from "@/data/workItems/particles";
import { proceduralWorks } from "@/data/workItems/procedural";
import { pyroWorks } from "@/data/workItems/pyro";
import type { WorkItem } from "@/data/workItems/types";
import type { WorkCategory } from "@/data/workCategories";

export type { WorkItem } from "@/data/workItems/types";

const workGroups: WorkItem[][] = [
  featuredWorks,
  clothWorks,
  particlesWorks,
  fluidWorks,
  proceduralWorks,
  pyroWorks,
];

export const works: WorkItem[] = Array.from(
  new Map(workGroups.flat().map((work) => [work.slug, work])).values(),
);

function compareFeaturedWorks(a: WorkItem, b: WorkItem) {
  const aOrder = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return 0;
}

export function getWorksByCategory(category: WorkCategory) {
  if (category === "all") {
    return works;
  }

  const filteredWorks = works.filter((work) =>
    category === "featured"
      ? work.featured
      : category === "pyro"
        ? work.categories.includes("pyro") || work.categories.includes("rbd")
        : work.categories.includes(category),
  );

  return category === "featured"
    ? [...filteredWorks].sort(compareFeaturedWorks)
    : filteredWorks;
}
