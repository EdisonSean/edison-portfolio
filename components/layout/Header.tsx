"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import VariableProximity from "@/components/typography/VariableProximity";

const directoryItems = [
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];
const socialLinks = [
  {
    label: "Behance",
    href: "https://www.behance.net/EdisonSean",
    icon: "behance",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/edison.sean",
    icon: "instagram",
  },
  {
    label: "WeChat",
    icon: "wechat",
  },
  {
    label: "Email",
    href: "mailto:edi3on.xiao@gmail.com",
    icon: "email",
  },
] as const;
const weChatId = "Edison_Sean";
const weChatQrSrc = "/assets/contact/wechat-qr.jpg";
const headingTextClass = "text-[clamp(1.55rem,2.7vw,2.9rem)] leading-[0.92]";
const compressedHeadingTextClass =
  "text-[clamp(1.1rem,1.72vw,1.9rem)] leading-[0.92]";
const brandVariableTextSettings = {
  fromFontVariationSettings: "'wght' 600, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  radius: 80,
  falloff: "gaussian" as const,
};
const navVariableTextSettings = {
  fromFontVariationSettings: "'wght' 600, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  radius: 80,
  falloff: "gaussian" as const,
};
const homeWorkCoverId = "home-work-cover";

type SocialIconName = (typeof socialLinks)[number]["icon"];

type SocialContactLinksProps = {
  className?: string;
  linkSizeClass: string;
  popoverClassName?: string;
};

function SocialIcon({ icon }: { icon: SocialIconName }) {
  if (icon === "behance") {
    return (
      <span
        aria-hidden="true"
        className="text-[0.92em] font-black leading-none tracking-normal"
      >
        Be
      </span>
    );
  }

  if (icon === "instagram") {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.08em] w-[1.08em]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.4" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "wechat") {
    return (
      <svg
        aria-hidden="true"
        className="h-[0.98em] w-[0.98em]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8.69 2.19C3.89 2.19 0 5.48 0 9.53c0 2.21 1.17 4.2 3 5.55.2.14.28.4.21.67l-.39 1.48c-.02.07-.05.14-.05.21 0 .16.13.3.29.3.06 0 .12-.02.17-.05l1.91-1.12c.2-.12.45-.15.72-.1a10.2 10.2 0 0 0 2.83.4c.28 0 .55-.03.81-.05a6.04 6.04 0 0 1 1.93-6.45c1.7-1.41 4.88-1.93 7.62-.55-.3-4-3.98-7.13-8.36-7.13Zm-2.51 3.85a1.07 1.07 0 1 1 0 2.15 1.07 1.07 0 0 1 0-2.15Zm5.02 0a1.07 1.07 0 1 1 0 2.15 1.07 1.07 0 0 1 0-2.15Zm6.32 4.92c-3.52 0-6.37 2.4-6.37 5.37s2.85 5.37 6.37 5.37c.7 0 1.37-.1 2-.27.2-.06.39-.03.54.07l1.44.84c.04.03.08.04.13.04.12 0 .22-.1.22-.22 0-.05-.02-.11-.04-.16l-.29-1.11a.45.45 0 0 1 .16-.5C23.05 19.37 24 17.87 24 16.33c0-2.97-2.85-5.37-6.48-5.37Zm-2.04 3.24a.81.81 0 1 1 0-1.62.81.81 0 0 1 0 1.62Zm4.08 0a.81.81 0 1 1 0-1.62.81.81 0 0 1 0 1.62Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-[1.08em] w-[1.08em]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
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

export function SocialContactLinks({
  className = "flex items-center gap-1.5 sm:gap-2",
  linkSizeClass,
  popoverClassName = "",
}: SocialContactLinksProps) {
  const weChatRootRef = useRef<HTMLDivElement | null>(null);
  const [isWeChatOpen, setIsWeChatOpen] = useState(false);
  const [hasCopiedWeChat, setHasCopiedWeChat] = useState(false);
  const socialIconToneClass =
    "text-zinc-400 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white";

  useEffect(() => {
    if (!isWeChatOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        weChatRootRef.current?.contains(target)
      ) {
        return;
      }

      setIsWeChatOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsWeChatOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWeChatOpen]);

  const handleCopyWeChatId = async () => {
    await copyText(weChatId);
    setHasCopiedWeChat(true);

    window.setTimeout(() => {
      setHasCopiedWeChat(false);
    }, 1400);
  };

  return (
    <nav aria-label="Social links" className={className}>
      {socialLinks.map((link) =>
        "href" in link ? (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            aria-label={link.label}
            className={[
              "group flex items-center justify-center border border-zinc-700/80 transition-all duration-300 hover:border-zinc-200 hover:bg-zinc-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
              linkSizeClass,
            ].join(" ")}
          >
            <span className={socialIconToneClass}>
              <SocialIcon icon={link.icon} />
            </span>
          </a>
        ) : (
          <div key={link.label} ref={weChatRootRef} className="relative">
            <button
              type="button"
              aria-label="WeChat"
              aria-expanded={isWeChatOpen}
              onClick={() => setIsWeChatOpen((isOpen) => !isOpen)}
              className={[
                "group flex items-center justify-center border border-zinc-700/80 transition-all duration-300 hover:border-zinc-200 hover:bg-zinc-900/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                isWeChatOpen ? "border-zinc-200 bg-zinc-900/70" : "",
                linkSizeClass,
              ].join(" ")}
            >
              <span
                className={
                  isWeChatOpen ? "text-white" : socialIconToneClass
                }
              >
                <SocialIcon icon={link.icon} />
              </span>
            </button>

            <div
              className={[
                "absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 border border-zinc-700/80 bg-[#050505]/95 p-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-sm transition-all duration-200",
                isWeChatOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0",
                popoverClassName,
              ].join(" ")}
            >
              <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-normal text-zinc-500">
                WeChat
              </p>
              <img
                src={weChatQrSrc}
                alt="WeChat QR code"
                className="mt-3 block aspect-square w-full select-none bg-white object-cover"
                draggable={false}
              />
              <p className="mt-2 select-text text-[0.95rem] font-semibold leading-tight text-zinc-200">
                {weChatId}
              </p>
              <button
                type="button"
                onClick={handleCopyWeChatId}
                className="mt-3 w-full border border-zinc-700/80 px-3 py-2 text-[0.78rem] font-semibold leading-none text-zinc-300 transition-colors duration-200 hover:border-zinc-200 hover:bg-zinc-900/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {hasCopiedWeChat ? "Copied" : "Copy WeChat ID"}
              </button>
            </div>
          </div>
        ),
      )}
    </nav>
  );
}

export default function Header() {
  const containerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const [isCompressed, setIsCompressed] = useState(false);
  const isHome = pathname === "/";
  const currentHeadingTextClass = isCompressed
    ? compressedHeadingTextClass
    : headingTextClass;
  const socialLinkSizeClass = isCompressed
    ? "h-8 w-8 text-[0.82rem]"
    : "h-9 w-9 text-[0.88rem] sm:h-10 sm:w-10 sm:text-[0.95rem]";

  useEffect(() => {
    let animationFrameId = 0;

    const updateHeaderState = () => {
      animationFrameId = 0;
      setIsCompressed(window.scrollY > 24);
    };

    const scheduleHeaderStateUpdate = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(updateHeaderState);
      }
    };

    updateHeaderState();
    window.addEventListener("scroll", scheduleHeaderStateUpdate, {
      passive: true,
    });

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", scheduleHeaderStateUpdate);
    };
  }, []);

  const handleDirectoryClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!isHome || href !== "/work") {
      return;
    }

    const workCover = document.getElementById(homeWorkCoverId);

    if (!workCover) {
      return;
    }

    event.preventDefault();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetScrollY =
      window.scrollY + workCover.getBoundingClientRect().top;

    window.scrollTo({
      top: targetScrollY,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <header
      ref={containerRef}
      className={[
        "z-10 grid grid-cols-1 items-start gap-8 transition-all duration-300 sm:grid-cols-[auto_1fr]",
        isHome
          ? [
              "fixed inset-x-0 top-0 z-50 px-5 sm:px-8 lg:px-10",
              isCompressed
                ? "bg-[#050505]/94 py-3 shadow-[0_1px_0_rgba(255,255,255,0.1),0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:py-4 lg:py-5"
                : "py-5 sm:py-7 lg:py-9",
            ].join(" ")
          : [
              "sticky top-0 z-40 -mx-5 -mt-5 bg-[#050505] px-5 sm:-mx-8 sm:-mt-7 sm:px-8 lg:-mx-10 lg:-mt-9 lg:px-10",
              isCompressed ? "py-3 sm:py-4 lg:py-5" : "py-5 sm:py-7 lg:py-9",
            ].join(" "),
        isCompressed ? "gap-5" : "",
      ].join(" ")}
    >
      <div className="flex w-fit items-center gap-2 sm:gap-3">
        <Link
          className={`block w-fit ${currentHeadingTextClass} transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
          href="/"
          aria-label="Home"
        >
          <VariableProximity
            label="EDISON"
            className="variable-proximity-demo"
            containerRef={containerRef}
            {...brandVariableTextSettings}
          />
        </Link>

        <SocialContactLinks linkSizeClass={socialLinkSizeClass} />
      </div>

      <nav
        aria-label="Primary navigation"
        className="min-w-0 justify-self-stretch sm:justify-self-end"
      >
        <ul className="grid w-full min-w-0 grid-cols-3 justify-items-start gap-x-0 sm:w-[min(72vw,660px)] sm:justify-items-end">
          {directoryItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (isHome && isCompressed && item.href === "/work");
            const shouldShowNavRule = !isHome || isCompressed;

            return (
              <li key={item.label} className="min-w-0">
                <Link
                  className={[
                    "block transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    currentHeadingTextClass,
                    shouldShowNavRule ? "w-fit border-b-2 pb-1" : "",
                    shouldShowNavRule && isActive ? "border-white" : "",
                    shouldShowNavRule && !isActive ? "border-transparent" : "",
                  ].join(" ")}
                  href={item.href}
                  onClick={(event) => handleDirectoryClick(event, item.href)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <VariableProximity
                    label={item.label}
                    className="variable-proximity-demo"
                    containerRef={containerRef}
                    {...navVariableTextSettings}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
