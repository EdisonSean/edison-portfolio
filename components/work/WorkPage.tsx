"use client";

import { useEffect, useMemo, useState } from "react";
import ArchiveSidebar from "@/components/archive/ArchiveSidebar";
import IndexContentLayout from "@/components/archive/IndexContentLayout";
import Header from "@/components/layout/Header";
import {
  defaultWorkCategory,
  workCategories,
  type WorkCategory,
} from "@/data/workCategories";
import { works } from "@/data/works";
import WorkCategoryView from "@/components/work/WorkCategoryView";

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<WorkCategory>(defaultWorkCategory);
  const [activeItemSlug, setActiveItemSlug] = useState<string | null>(null);
  const selectedWorks = useMemo(
    () =>
      works.filter((work) =>
        selectedCategory === "featured"
          ? work.featured
          : work.categories.includes(selectedCategory),
      ),
    [selectedCategory],
  );

  useEffect(() => {
    setActiveItemSlug(selectedWorks[0]?.slug ?? null);
  }, [selectedWorks]);

  return (
    <main className="min-h-svh bg-[#050505] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <Header />
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
    </main>
  );
}
