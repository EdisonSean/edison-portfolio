"use client";

import { useEffect, useMemo, useState } from "react";
import ArchiveSidebar from "@/components/archive/ArchiveSidebar";
import IndexContentLayout from "@/components/archive/IndexContentLayout";
import Header from "@/components/layout/Header";
import {
  defaultLabCategory,
  labCategories,
  type LabCategory,
} from "@/data/labCategories";
import { labs } from "@/data/labs";
import LabCategoryView from "@/components/lab/LabCategoryView";

export default function LabPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<LabCategory>(defaultLabCategory);
  const [activeItemSlug, setActiveItemSlug] = useState<string | null>(null);
  const selectedLabs = useMemo(
    () =>
      selectedCategory === "all"
        ? labs
        : labs.filter((lab) => lab.categories.includes(selectedCategory)),
    [selectedCategory],
  );

  useEffect(() => {
    setActiveItemSlug(selectedLabs[0]?.slug ?? null);
  }, [selectedLabs]);

  return (
    <main className="min-h-svh bg-[#050505] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <Header />
      <IndexContentLayout
        sidebar={
          <ArchiveSidebar
            title="Lab"
            label="Non-commercial Archive"
            categories={labCategories}
            selectedCategory={selectedCategory}
            items={selectedLabs.map((lab) => ({
              slug: lab.slug,
              title: lab.title,
              projectName: lab.status,
              year: lab.year,
            }))}
            activeItemSlug={activeItemSlug}
            onSelectCategory={setSelectedCategory}
            onSelectItem={setActiveItemSlug}
          />
        }
        content={
          <LabCategoryView
            selectedCategory={selectedCategory}
            activeItemSlug={activeItemSlug}
            onActiveItemChange={setActiveItemSlug}
          />
        }
      />
    </main>
  );
}
