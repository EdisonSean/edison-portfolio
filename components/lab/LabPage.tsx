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

const categoryQueryKey = "category";

function isLabCategory(value: string | null): value is LabCategory {
  return labCategories.some((category) => category.slug === value);
}

function getCategoryFromCurrentUrl() {
  if (typeof window === "undefined") {
    return defaultLabCategory;
  }

  const category = new URLSearchParams(window.location.search).get(
    categoryQueryKey,
  );

  return isLabCategory(category) ? category : defaultLabCategory;
}

export default function LabPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<LabCategory>(defaultLabCategory);
  const [activeItemSlug, setActiveItemSlug] = useState<string | null>(null);
  const selectedLabs = useMemo(
    () => labs.filter((lab) => lab.categories.includes(selectedCategory)),
    [selectedCategory],
  );

  useEffect(() => {
    setActiveItemSlug(selectedLabs[0]?.slug ?? null);
  }, [selectedLabs]);

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

  const handleSelectCategory = (category: LabCategory) => {
    setSelectedCategory(category);

    const url = new URL(window.location.href);

    if (category === defaultLabCategory) {
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
            title="Lab"
            label="Non-commercial Archive"
            categories={labCategories}
            selectedCategory={selectedCategory}
            items={selectedLabs.map((lab) => ({
              slug: lab.slug,
              title: lab.title,
              year: lab.year,
            }))}
            activeItemSlug={activeItemSlug}
            onSelectCategory={handleSelectCategory}
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
