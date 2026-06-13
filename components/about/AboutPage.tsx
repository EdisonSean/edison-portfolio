"use client";

import { useEffect, useRef, useState } from "react";
import IndexContentLayout from "@/components/archive/IndexContentLayout";
import Header from "@/components/layout/Header";
import VariableProximity from "@/components/typography/VariableProximity";
import ViewportYVariableText from "@/components/typography/ViewportYVariableText";
import type { MouseEvent } from "react";
import type {
  ParsedResume,
  ResumeBlock,
  ResumeInline,
  ResumeSection,
} from "@/components/about/parseResumeMarkdown";

type AboutPageProps = {
  resume: ParsedResume;
};

type ContactCopyTarget = {
  label: string;
  value: string;
  isValue: boolean;
};

type CopyToastState = {
  message: string;
  isVisible: boolean;
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
const aboutScrollStartEvent = "edison:archive-scroll-start";
const aboutScrollDurationMs = 320;
let aboutScrollFrameId = 0;

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function getHeaderOffset() {
  const header = document.querySelector("header");

  if (!(header instanceof HTMLElement)) {
    return 24;
  }

  return header.getBoundingClientRect().bottom + 24;
}

function getSectionScrollTarget(element: HTMLElement) {
  return Math.max(
    0,
    window.scrollY + element.getBoundingClientRect().top - getHeaderOffset(),
  );
}

function animateWindowScrollTo(targetScrollY: number) {
  window.dispatchEvent(new CustomEvent(aboutScrollStartEvent));

  if (aboutScrollFrameId !== 0) {
    window.cancelAnimationFrame(aboutScrollFrameId);
    aboutScrollFrameId = 0;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) {
    window.scrollTo({ top: targetScrollY });
    return;
  }

  const startScrollY = window.scrollY;
  const distance = targetScrollY - startScrollY;
  const startTime = performance.now();

  const step = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / aboutScrollDurationMs, 1);
    const nextScrollY = startScrollY + distance * easeOutCubic(progress);

    window.scrollTo({ top: nextScrollY });

    if (progress >= 1) {
      window.scrollTo({ top: targetScrollY });
      aboutScrollFrameId = 0;
      return;
    }

    aboutScrollFrameId = window.requestAnimationFrame(step);
  };

  aboutScrollFrameId = window.requestAnimationFrame(step);
}

function scrollSectionIntoAboutView(element: HTMLElement) {
  animateWindowScrollTo(getSectionScrollTarget(element));
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

function getInlineText(inlines: ResumeInline[]) {
  return inlines
    .map((inline) => inline.text)
    .join("")
    .trim();
}

function getBlockText(block: ResumeBlock) {
  if (block.type === "heading") {
    return block.text.trim();
  }

  if (block.type === "paragraph") {
    return getInlineText(block.inlines);
  }

  return block.items.map(getInlineText).join(" ").trim();
}

function getContactLabel(text: string) {
  const normalizedText = text.toLowerCase();

  if (normalizedText.startsWith("email")) {
    return "Email";
  }

  if (normalizedText.startsWith("wechat")) {
    return "WeChat";
  }

  return null;
}

function getContactCopyTarget(
  section: ResumeSection,
  blockIndex: number,
): ContactCopyTarget | null {
  if (!section.title.toLowerCase().includes("contact")) {
    return null;
  }

  const block = section.blocks[blockIndex];
  const previousBlock = section.blocks[blockIndex - 1];
  const nextBlock = section.blocks[blockIndex + 1];
  const currentLabel = getContactLabel(getBlockText(block));
  const previousLabel = previousBlock
    ? getContactLabel(getBlockText(previousBlock))
    : null;
  const label = currentLabel ?? previousLabel;
  const valueBlock = currentLabel ? nextBlock : block;
  const isValue = !currentLabel;

  if (!label || !valueBlock || valueBlock.type === "heading") {
    return null;
  }

  const value = getBlockText(valueBlock);

  if (!value) {
    return null;
  }

  return { label, value, isValue };
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function renderInlines(
  inlines: ResumeInline[],
  options: { renderLinksAsText?: boolean } = {},
) {
  return inlines.map((inline, index) => {
    if (inline.type === "strong") {
      return (
        <strong key={index} className="font-bold text-zinc-300">
          {inline.text}
        </strong>
      );
    }

    if (inline.type === "link") {
      if (options.renderLinksAsText) {
        return <span key={index}>{inline.text}</span>;
      }

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

function ResumeBlockView({
  block,
  copyTarget,
  onCopyContact,
}: {
  block: ResumeBlock;
  copyTarget?: ContactCopyTarget | null;
  onCopyContact?: (target: ContactCopyTarget) => void;
}) {
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

  if (copyTarget) {
    return (
      <button
        type="button"
        aria-label={`Copy ${copyTarget.label}: ${copyTarget.value}`}
        onClick={() => onCopyContact?.(copyTarget)}
        className="group mt-5 block max-w-3xl cursor-none text-left text-[0.98rem] font-semibold leading-[1.48] text-zinc-500 transition-colors duration-150 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:text-[1.05rem]"
      >
        <span
          className={
            copyTarget.isValue
              ? "underline decoration-white/30 underline-offset-4 transition-[text-decoration-color] duration-150 group-hover:decoration-white/70"
              : ""
          }
        >
          {renderInlines(block.inlines, { renderLinksAsText: true })}
        </span>
        <span className="ml-3 align-baseline text-[0.82rem] text-zinc-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          Click to copy / 点击复制
        </span>
      </button>
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
  onCopyContact,
}: {
  resume: ParsedResume;
  activeSectionId: string | null;
  onCopyContact: (target: ContactCopyTarget) => void;
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
                  {section.blocks.map((block, blockIndex) => {
                    const copyTarget = getContactCopyTarget(
                      section,
                      blockIndex,
                    );

                    return (
                      <ResumeBlockView
                        key={blockIndex}
                        block={block}
                        copyTarget={copyTarget}
                        onCopyContact={onCopyContact}
                      />
                    );
                  })}
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
  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const targetElement = document.getElementById(sectionId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();
    onSelectSection(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
    scrollSectionIntoAboutView(targetElement);
  };

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
                    onClick={(event) => handleSectionClick(event, section.id)}
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

function CopyToast({ toast }: { toast: CopyToastState | null }) {
  return (
    <div
      aria-live="polite"
      className={[
        "pointer-events-none fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 border border-white/15 bg-[#050505]/90 px-4 py-2 text-[0.9rem] font-semibold leading-tight text-white/75 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-opacity duration-300",
        toast?.isVisible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {toast?.message ?? ""}
    </div>
  );
}

export default function AboutPage({ resume }: AboutPageProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    resume.sections[0]?.id ?? null,
  );
  const [copyToast, setCopyToast] = useState<CopyToastState | null>(null);
  const hideCopyToastTimeoutRef = useRef<number | null>(null);
  const removeCopyToastTimeoutRef = useRef<number | null>(null);

  const handleCopyContact = async (target: ContactCopyTarget) => {
    await copyText(target.value);

    if (hideCopyToastTimeoutRef.current !== null) {
      window.clearTimeout(hideCopyToastTimeoutRef.current);
    }

    if (removeCopyToastTimeoutRef.current !== null) {
      window.clearTimeout(removeCopyToastTimeoutRef.current);
    }

    setCopyToast({
      message: `Copied ${target.label}`,
      isVisible: true,
    });

    hideCopyToastTimeoutRef.current = window.setTimeout(() => {
      setCopyToast((currentToast) =>
        currentToast ? { ...currentToast, isVisible: false } : currentToast,
      );
    }, 1400);

    removeCopyToastTimeoutRef.current = window.setTimeout(() => {
      setCopyToast(null);
    }, 1750);
  };

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

  useEffect(() => {
    return () => {
      if (hideCopyToastTimeoutRef.current !== null) {
        window.clearTimeout(hideCopyToastTimeoutRef.current);
      }

      if (removeCopyToastTimeoutRef.current !== null) {
        window.clearTimeout(removeCopyToastTimeoutRef.current);
      }
    };
  }, []);

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
          <AboutContent
            resume={resume}
            activeSectionId={activeSectionId}
            onCopyContact={handleCopyContact}
          />
        }
      />
      <CopyToast toast={copyToast} />
    </main>
  );
}
