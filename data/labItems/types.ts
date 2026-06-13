import type { ArchiveMediaItem } from "@/components/archive/ArchiveContent";
import type { LabCategory } from "@/data/labCategories";

export type LabItemCategory = Exclude<LabCategory, "all">;

export type LabItem = {
  slug: string;
  title: string;
  year: number;
  categories: LabItemCategory[];
  media: ArchiveMediaItem[];
  role: string[];
  status: "note" | "wip" | "study" | "archive";
  description: string;
};
