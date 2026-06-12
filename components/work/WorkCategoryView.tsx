import ArchiveContent from "@/components/archive/ArchiveContent";
import { workCategories, type WorkCategory } from "@/data/workCategories";
import { getWorksByCategory } from "@/data/works";

type WorkCategoryViewProps = {
  selectedCategory: WorkCategory;
  activeItemSlug?: string | null;
  onActiveItemChange?: (slug: string) => void;
};

export default function WorkCategoryView({
  selectedCategory,
  activeItemSlug,
  onActiveItemChange,
}: WorkCategoryViewProps) {
  const category =
    workCategories.find((item) => item.slug === selectedCategory) ??
    workCategories[0];
  const filteredWorks = getWorksByCategory(selectedCategory);
  const title = selectedCategory === "featured" ? "Featured" : category.label;

  return (
    <ArchiveContent
      title={title}
      meta="Commercial works categorized by FX discipline"
      description={category.description}
      keywords={category.keywords}
      items={filteredWorks.map((work) => ({
        slug: work.slug,
        title: work.title,
        projectName: work.projectName,
        client: work.client,
        year: work.year,
        role: work.role,
        media: work.media,
        description: work.description,
      }))}
      emptyMessage="No commercial works in this category yet."
      activeItemSlug={activeItemSlug}
      onActiveItemChange={onActiveItemChange}
    />
  );
}
