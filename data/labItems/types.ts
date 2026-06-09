import type { ArchiveMediaItem } from "@/components/archive/ArchiveContent";
import type { LabCategory } from "@/data/labCategories";

export type LabItem = {
  slug: string;
  title: string;
  year: number;
  categories: LabCategory[];
  media: ArchiveMediaItem[];
  role: string[];
  status: "note" | "wip" | "study" | "archive";
  description: string;
};
