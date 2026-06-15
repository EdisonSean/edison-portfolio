import { recentLabs } from "@/data/labItems/recent";
import { vibeCodingLabs } from "@/data/labItems/vibecoding";
import type { LabItem } from "@/data/labItems/types";

export type { LabItem } from "@/data/labItems/types";

const labGroups: LabItem[][] = [recentLabs, vibeCodingLabs];

export const labs: LabItem[] = Array.from(
  new Map(labGroups.flat().map((lab) => [lab.slug, lab])).values(),
);
