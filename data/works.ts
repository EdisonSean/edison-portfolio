import { clothWorks } from "@/data/workItems/cloth";
import { featuredWorks } from "@/data/workItems/featured";
import { fluidWorks } from "@/data/workItems/fluid";
import { particlesWorks } from "@/data/workItems/particles";
import { proceduralWorks } from "@/data/workItems/procedural";
import { productWorks } from "@/data/workItems/product";
import { pyroWorks } from "@/data/workItems/pyro";
import { rbdWorks } from "@/data/workItems/rbd";
import type { WorkItem } from "@/data/workItems/types";

export type { WorkItem } from "@/data/workItems/types";

const workGroups: WorkItem[][] = [
  featuredWorks,
  clothWorks,
  fluidWorks,
  pyroWorks,
  particlesWorks,
  proceduralWorks,
  rbdWorks,
  productWorks,
];

export const works: WorkItem[] = Array.from(
  new Map(workGroups.flat().map((work) => [work.slug, work])).values(),
);
