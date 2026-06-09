import ArchiveContent from "@/components/archive/ArchiveContent";
import { labCategories, type LabCategory } from "@/data/labCategories";
import { labs } from "@/data/labs";

type LabCategoryViewProps = {
  selectedCategory: LabCategory;
  activeItemSlug?: string | null;
  onActiveItemChange?: (slug: string) => void;
};

export default function LabCategoryView({
  selectedCategory,
  activeItemSlug,
  onActiveItemChange,
}: LabCategoryViewProps) {
  const category =
    labCategories.find((item) => item.slug === selectedCategory) ??
    labCategories[0];
  const filteredLabs =
    selectedCategory === "all"
      ? labs
      : labs.filter((lab) => lab.categories.includes(selectedCategory));
  const title = selectedCategory === "recent" ? "Recent Lab" : category.label;

  return (
    <ArchiveContent
      title={title}
      meta="Experiments, R&D, tests, and practice"
      description={category.description}
      keywords={category.keywords}
      items={filteredLabs.map((lab) => ({
        slug: lab.slug,
        title: lab.title,
        projectName: lab.status,
        year: lab.year,
        role: lab.role,
        media: lab.media,
        description: lab.description,
      }))}
      emptyMessage="No lab entries in this category yet."
      activeItemSlug={activeItemSlug}
      onActiveItemChange={onActiveItemChange}
    />
  );
}
