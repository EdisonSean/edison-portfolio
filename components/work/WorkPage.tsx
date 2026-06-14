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
import { getWorksByCategory } from "@/data/works";
import WorkCategoryView from "@/components/work/WorkCategoryView";

const categoryQueryKey = "category";

function isWorkCategory(value: string | null): value is WorkCategory {
  return workCategories.some((category) => category.slug === value);
}

function getCategoryFromCurrentUrl() {
  if (typeof window === "undefined") {
    return defaultWorkCategory;
  }

  const category = new URLSearchParams(window.location.search).get(
    categoryQueryKey,
  );

  return isWorkCategory(category) ? category : defaultWorkCategory;
}

export default function WorkPage() {
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

  useEffect(() => {
    const syncCategoryFromUrl = () => {
      setSelectedCategory(getCategoryFromCurrentUrl());
    };

    syncCategoryFromUrl();
    window.addEventListener("popstate", syncCategoryFromUrl);

    return () => {
      window.removeEventListener("popstate", syncCategoryFromUrl);
    };
  }, []);

  const handleSelectCategory = (category: WorkCategory) => {
    setSelectedCategory(category);

    const url = new URL(window.location.href);

    if (category === defaultWorkCategory) {
      url.searchParams.delete(categoryQueryKey);
    } else {
      url.searchParams.set(categoryQueryKey, category);
    }

    url.hash = "";
    window.history.pushState(null, "", url);
  };

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
            onSelectCategory={handleSelectCategory}
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
