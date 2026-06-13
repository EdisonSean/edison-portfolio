export type ArchiveCategoryEntry<TCategory extends string = string> = {
  slug: TCategory;
  index: string;
  label: string;
  meta: string;
  description?: string;
  keywords: string[];
};

export type ArchiveSidebarItem = {
  slug: string;
  title: string;
  projectName?: string;
  year: number;
  client?: string;
};

function getArchiveItemHref(slug: string) {
  return `#archive-item-${slug}`;
}

function SidebarDot() {
  return (
    <span
      aria-hidden="true"
      className="flex h-[1.3em] items-center justify-center"
    >
      <span className="block h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

const sidebarHeadingClass =
  "text-[clamp(1.4rem,1.6vw,2rem)] font-semibold leading-[1.3]";
const sidebarListClass =
  "text-[clamp(1.5rem,1.55vw,2.1rem)] font-semibold leading-[1.3]";
const sidebarSecondaryHeadingClass =
  "text-[clamp(1.26rem,1.44vw,1.8rem)] font-semibold leading-[1.3]";
const sidebarSecondaryListClass =
  "text-[clamp(1.35rem,1.4vw,1.89rem)] font-semibold leading-[1.3]";
type ArchiveSidebarProps<TCategory extends string> = {
  title: string;
  label: string;
  categories: ArchiveCategoryEntry<TCategory>[];
  selectedCategory: TCategory;
  items: ArchiveSidebarItem[];
  activeItemSlug?: string | null;
  onSelectCategory: (category: TCategory) => void;
  onSelectItem?: (slug: string) => void;
};

export default function ArchiveSidebar<TCategory extends string>({
  title,
  label,
  categories,
  selectedCategory,
  items,
  activeItemSlug,
  onSelectCategory,
  onSelectItem,
}: ArchiveSidebarProps<TCategory>) {
  const activeCategory =
    categories.find((category) => category.slug === selectedCategory) ??
    categories[0];

  return (
    <nav
      aria-label={`${title} archive index`}
      className="grid h-full gap-6 overflow-hidden text-zinc-500 leading-[1.3] 2xl:grid-cols-2 2xl:gap-8"
    >
      <section className="min-h-0 overflow-y-auto pr-1">
        <p className={`mb-3 text-zinc-500 ${sidebarHeadingClass}`}>
          {title} Index
        </p>

        <ol className={`space-y-0 ${sidebarListClass}`}>
          {categories.map((category) => {
            const isSelected = category.slug === selectedCategory;
            const isAllCategory = category.slug === "all";

            return (
              <li key={category.slug} className={isAllCategory ? "mt-6" : ""}>
                <button
                  type="button"
                  aria-current={isSelected ? "page" : undefined}
                  onClick={() => onSelectCategory(category.slug)}
                  className={[
                    "grid w-full grid-cols-[0.9rem_1fr] gap-3 text-left leading-[1.3] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    isSelected
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200",
                  ].join(" ")}
                >
                  <SidebarDot />
                  <span>{category.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="min-h-0 overflow-y-auto 2xl:border-l 2xl:border-white/20 2xl:pl-8">
        <div className="h-px bg-white/20 2xl:hidden" />

        <div className="grid gap-6 pt-6 font-semibold leading-[1.3] 2xl:pt-12">
          <section>
            <p className={`mb-2 text-zinc-500 ${sidebarSecondaryHeadingClass}`}>
              {activeCategory.label}
            </p>
            <ol className={`space-y-0 ${sidebarSecondaryListClass}`}>
              {items.map((item, index) => {
                const isActiveItem = activeItemSlug === item.slug;

                return (
                  <li key={item.slug}>
                    <a
                      href={getArchiveItemHref(item.slug)}
                      aria-current={isActiveItem ? "location" : undefined}
                      onClick={() => onSelectItem?.(item.slug)}
                      className="group grid grid-cols-[2.7rem_1fr] gap-2 leading-[1.3] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span
                        className={[
                          "tabular-nums transition-colors duration-150",
                          isActiveItem
                            ? "text-white"
                            : "text-zinc-700 group-hover:text-zinc-300",
                        ].join(" ")}
                      >
                        {index + 1}.
                      </span>
                      <span
                        className={[
                          "transition-colors duration-150",
                          isActiveItem
                            ? "text-white"
                            : "text-zinc-700 hover:text-zinc-300",
                        ].join(" ")}
                      >
                        {item.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </section>
    </nav>
  );
}
