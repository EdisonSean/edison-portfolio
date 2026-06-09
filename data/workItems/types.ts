import type { ArchiveMediaItem } from "@/components/archive/ArchiveContent";
import type { WorkCategory } from "@/data/workCategories";

export type WorkItemCategory = Exclude<WorkCategory, "featured">;

export type WorkItem = {
  slug: string;
  title: string;
  projectName: string;
  client: string;
  year: number;
  categories: WorkItemCategory[];
  media: ArchiveMediaItem[];
  role: string[];
  description: string;
  featured: boolean;
};
