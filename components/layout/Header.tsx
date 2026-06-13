"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import VariableProximity from "@/components/typography/VariableProximity";

const directoryItems = [
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];
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

export default function Header() {
  const containerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const [isCompressed, setIsCompressed] = useState(false);
  const isHome = pathname === "/";
  const currentHeadingTextClass = isCompressed
    ? compressedHeadingTextClass
    : headingTextClass;

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
      <a
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
      </a>

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
                <a
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
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
