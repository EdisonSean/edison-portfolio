"use client";

import { useEffect, useRef, useState } from "react";
import IndexContentLayout from "@/components/archive/IndexContentLayout";
import Header from "@/components/layout/Header";
import VariableProximity from "@/components/typography/VariableProximity";
import ViewportYVariableText from "@/components/typography/ViewportYVariableText";
import type {
  ParsedResume,
  ResumeBlock,
  ResumeInline,
  ResumeSection,
} from "@/components/about/parseResumeMarkdown";

type AboutPageProps = {
  resume: ParsedResume;
};

const aboutTitleVariableTextSettings = {
  fromFontVariationSettings: "'wght' 600, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  radius: 140,
  falloff: "gaussian" as const,
};

const sectionTitleVariableTextSettings = {
  fromFontVariationSettings: "'wght' 650, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  radius: 120,
  falloff: "gaussian" as const,
};

const aboutNumberVariableTextSettings = {
  fromFontVariationSettings: "'wght' 500, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  viewportRadiusRatio: 0.42,
};

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

function renderInlines(inlines: ResumeInline[]) {
  return inlines.map((inline, index) => {
    if (inline.type === "strong") {
      return (
        <strong key={index} className="font-bold text-zinc-300">
          {inline.text}
        </strong>
      );
    }

    if (inline.type === "link") {
      return (
        <a
          key={index}
          className="text-zinc-200 underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:text-white"
          href={inline.href}
          target={inline.href.startsWith("http") ? "_blank" : undefined}
          rel={inline.href.startsWith("http") ? "noreferrer" : undefined}
        >
          {inline.text}
        </a>
      );
    }

    return <span key={index}>{inline.text}</span>;
  });
}

function ResumeBlockView({ block }: { block: ResumeBlock }) {
  if (block.type === "heading") {
    const headingClass =
      block.level <= 3
        ? "mt-10 text-[clamp(1.35rem,2.1vw,2.2rem)] font-bold leading-[1.05] text-zinc-200"
        : "mt-8 text-[1.05rem] font-bold leading-[1.25] text-zinc-300";

    return <h3 className={headingClass}>{block.text}</h3>;
  }

  if (block.type === "list") {
    return (
      <ul className="mt-5 grid max-w-3xl gap-3 text-[0.98rem] font-semibold leading-[1.48] text-zinc-500 md:text-[1.05rem]">
        {block.items.map((item, index) => (
          <li key={index} className="grid grid-cols-[1.35rem_1fr] gap-2">
            <span className="text-zinc-700">*</span>
            <span>{renderInlines(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-5 max-w-3xl text-[0.98rem] font-semibold leading-[1.48] text-zinc-500 md:text-[1.05rem]">
      {renderInlines(block.inlines)}
    </p>
  );
}

function AboutContent({
  resume,
  activeSectionId,
}: {
  resume: ParsedResume;
  activeSectionId: string | null;
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  return (
    <section ref={containerRef} className="min-w-0 text-white">
      <h1 className="mb-16 max-w-[78rem] text-[clamp(2.95rem,7.35vw,8.4rem)] font-semibold leading-[0.86] 2xl:max-w-none 2xl:text-[clamp(4.9rem,5.75vw,15.4rem)]">
        <VariableProximity
          label={resume.title}
          className="block"
          containerRef={containerRef}
          {...aboutTitleVariableTextSettings}
        />
      </h1>

      {resume.isEmpty ? (
        <p className="max-w-2xl text-[1.05rem] font-semibold leading-[1.48] text-zinc-500">
          `docs/resume.md` is empty. Add Markdown headings and content there to
          build this page.
        </p>
      ) : (
        <ol className="space-y-24 text-[1.05rem] font-semibold leading-[1.28] md:text-[1.18rem] 2xl:space-y-32">
          {resume.sections.map((section, index) => (
            <li
              key={section.id}
              id={section.id}
              data-about-section={section.id}
              className="grid scroll-mt-28 gap-5 md:grid-cols-[minmax(3rem,5.6vw)_minmax(0,1fr)] 2xl:grid-cols-[minmax(4.2rem,6.3vw)_minmax(0,1fr)]"
            >
              <span
                className={[
                  "text-[clamp(3.15rem,6.3vw,9.8rem)] leading-[0.78] transition-colors duration-200",
                  activeSectionId === section.id
                    ? "text-white"
                    : "text-zinc-700",
                ].join(" ")}
              >
                <ViewportYVariableText
                  label={String(index + 1)}
                  className="block"
                  {...aboutNumberVariableTextSettings}
                />
              </span>

              <article className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-[1ch]">
                <span
                  aria-hidden="true"
                  className="inline-block translate-y-[-0.04em] text-[clamp(2.65rem,4.12vw,4.72rem)] font-bold leading-none text-zinc-200"
                >
                  *
                </span>

                <h2
                  className={[
                    "mb-8 text-[clamp(1.35rem,2.1vw,2.4rem)] font-bold leading-[1.08] transition-colors duration-200",
                    activeSectionId === section.id
                      ? "text-white"
                      : "text-zinc-300",
                  ].join(" ")}
                >
                  <VariableProximity
                    label={section.title}
                    containerRef={containerRef}
                    {...sectionTitleVariableTextSettings}
                  />
                </h2>

                <div className="col-start-2">
                  {section.blocks.map((block, blockIndex) => (
                    <ResumeBlockView key={blockIndex} block={block} />
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function AboutSidebar({
  sections,
  activeSectionId,
  onSelectSection,
}: {
  sections: ResumeSection[];
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}) {
  return (
    <nav
      aria-label="About index"
      className="grid h-full gap-6 overflow-hidden text-zinc-500 leading-[1.3]"
    >
      <section className="min-h-0 overflow-y-auto pr-1">
        <p className="mb-3 text-[clamp(1.4rem,1.6vw,2rem)] font-semibold leading-[1.3] text-zinc-500">
          About Index
        </p>

        {sections.length > 0 ? (
          <ol className="space-y-0 text-[clamp(1.5rem,1.55vw,2.1rem)] font-semibold leading-[1.3]">
            {sections.map((section) => {
              const isActive = activeSectionId === section.id;

              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => onSelectSection(section.id)}
                    className="group grid grid-cols-[0.9rem_1fr] gap-3 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span
                      className={[
                        "transition-colors duration-150",
                        isActive
                          ? "!text-white"
                          : "text-zinc-700 group-hover:text-zinc-300",
                      ].join(" ")}
                    >
                      <SidebarDot />
                    </span>
                    <span
                      className={[
                        "transition-colors duration-150",
                        isActive
                          ? "!text-white"
                          : "text-zinc-700 group-hover:text-zinc-300",
                      ].join(" ")}
                    >
                      {section.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-[1.1rem] font-semibold text-zinc-700">
            No resume sections yet.
          </p>
        )}
      </section>
    </nav>
  );
}

export default function AboutPage({ resume }: AboutPageProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    resume.sections[0]?.id ?? null,
  );

  useEffect(() => {
    if (resume.sections.length === 0) {
      return;
    }

    let animationFrameId = 0;

    const updateActiveSection = () => {
      animationFrameId = 0;

      const viewportMiddle = window.innerHeight / 2;
      const sectionElements = resume.sections
        .map((section) => document.getElementById(section.id))
        .filter((element): element is HTMLElement => Boolean(element));
      let nextActiveSectionId =
        sectionElements[0]?.getAttribute("data-about-section") ?? null;

      for (const element of sectionElements) {
        if (element.getBoundingClientRect().top <= viewportMiddle) {
          nextActiveSectionId = element.getAttribute("data-about-section");
        } else {
          break;
        }
      }

      if (nextActiveSectionId) {
        setActiveSectionId((currentSectionId) =>
          currentSectionId === nextActiveSectionId
            ? currentSectionId
            : nextActiveSectionId,
        );
      }
    };

    const scheduleActiveSectionUpdate = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);
    };
  }, [resume.sections]);

  return (
    <main className="min-h-svh bg-[#050505] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <Header />
      <IndexContentLayout
        sidebar={
          <AboutSidebar
            sections={resume.sections}
            activeSectionId={activeSectionId}
            onSelectSection={setActiveSectionId}
          />
        }
        content={
          <AboutContent resume={resume} activeSectionId={activeSectionId} />
        }
      />
    </main>
  );
}
