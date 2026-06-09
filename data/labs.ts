import { allLabs } from "@/data/labItems/all";
import { motionLabs } from "@/data/labItems/motion";
import { practiceLabs } from "@/data/labItems/practice";
import { rdLabs } from "@/data/labItems/rd";
import { recentLabs } from "@/data/labItems/recent";
import { shaderLabs } from "@/data/labItems/shader";
import { simulationLabs } from "@/data/labItems/simulation";
import type { LabItem } from "@/data/labItems/types";

export type { LabItem } from "@/data/labItems/types";

const labGroups: LabItem[][] = [
  recentLabs,
  allLabs,
  rdLabs,
  simulationLabs,
  shaderLabs,
  motionLabs,
  practiceLabs,
];

export const labs: LabItem[] = Array.from(
  new Map(labGroups.flat().map((lab) => [lab.slug, lab])).values(),
);
