"use client";

import { useEffect, useMemo, useState } from "react";
import ArchiveSidebar from "@/components/archive/ArchiveSidebar";
import IndexContentLayout from "@/components/archive/IndexContentLayout";
import WorkCategoryView from "@/components/work/WorkCategoryView";
import {
  defaultWorkCategory,
  workCategories,
  type WorkCategory,
} from "@/data/workCategories";
import { getWorksByCategory } from "@/data/works";

export default function HomeWorkScrollCover() {
  const [selectedCategory, setSelectedCategory] =
    useState<WorkCategory>(defaultWorkCategory);
  const [activeItemSlug, setActiveItemSlug] = useState<string | null>(null);
  const selectedWorks = useMemo(
    () => getWorksByCategory(selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    setActiveItemSlug(selectedWorks[0]?.slug ?? null);
  }, [selectedWorks]);

  return (
    <section className="relative z-20 min-h-svh bg-[#050505] px-5 py-5 text-white shadow-[0_-44px_120px_rgba(0,0,0,0.62)] sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <IndexContentLayout
        sidebar={
          <ArchiveSidebar
            title="Work"
            label="Commercial Archive"
            categories={workCategories}
            selectedCategory={selectedCategory}
            items={selectedWorks.map((work) => ({
              slug: work.slug,
              title: work.title,
              projectName: work.projectName,
              year: work.year,
              client: work.client,
            }))}
            activeItemSlug={activeItemSlug}
            onSelectCategory={setSelectedCategory}
            onSelectItem={setActiveItemSlug}
          />
        }
        content={
          <WorkCategoryView
            selectedCategory={selectedCategory}
            activeItemSlug={activeItemSlug}
            onActiveItemChange={setActiveItemSlug}
          />
        }
      />
    </section>
  );
}
