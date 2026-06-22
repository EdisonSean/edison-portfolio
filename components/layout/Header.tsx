"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    label: "Email",
    href: "mailto:edi3on.xiao@gmail.com",
    icon: "email",
  },
] as const;
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

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
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
    : "h-10 w-10 text-[0.95rem]";

  useEffect(() => {
    if (isHome) {
      setIsCompressed(false);
      return;
    }

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
  }, [isHome]);

  return (
    <header
      ref={containerRef}
      className={[
        "z-10 grid grid-cols-1 items-start gap-8 transition-all duration-300 sm:grid-cols-[auto_1fr]",
        isHome
          ? "relative"
          : [
              "sticky top-0 z-40 -mx-5 -mt-5 bg-[#050505] px-5 sm:-mx-8 sm:-mt-7 sm:px-8 lg:-mx-10 lg:-mt-9 lg:px-10",
              isCompressed ? "py-3 sm:py-4 lg:py-5" : "py-5 sm:py-7 lg:py-9",
            ].join(" "),
        isCompressed ? "gap-5" : "",
      ].join(" ")}
    >
      <div className="flex w-fit items-center gap-3">
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

        <nav aria-label="Social links" className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={link.label}
              className={[
                "flex items-center justify-center border border-zinc-700/80 text-zinc-400 transition-all duration-300 hover:border-zinc-200 hover:bg-zinc-900/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                socialLinkSizeClass,
              ].join(" ")}
            >
              <SocialIcon icon={link.icon} />
            </a>
          ))}
        </nav>
      </div>

      <nav
        aria-label="Primary navigation"
        className="min-w-0 justify-self-stretch sm:justify-self-end"
      >
        <ul className="grid w-full min-w-0 grid-cols-3 justify-items-start gap-x-0 sm:w-[min(72vw,660px)] sm:justify-items-end">
          {directoryItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.label} className="min-w-0">
                <Link
                  className={[
                    "block transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    currentHeadingTextClass,
                    isHome ? "" : "w-fit border-b-2 pb-1",
                    !isHome && isActive ? "border-white" : "",
                    !isHome && !isActive ? "border-transparent" : "",
                  ].join(" ")}
                  href={item.href}
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
