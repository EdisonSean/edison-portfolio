"use client";

import { useRef } from "react";
import VariableProximity from "@/components/typography/VariableProximity";

const directoryItems = [
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];
const headingTextClass =
  "text-[clamp(1.55rem,2.7vw,2.9rem)] leading-[0.92]";
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

  return (
    <header
      ref={containerRef}
      className="relative z-10 grid grid-cols-1 items-start gap-8 sm:grid-cols-[auto_1fr]"
    >
      <a
        className={`block w-fit ${headingTextClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
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
          {directoryItems.map((item) => (
            <li key={item.label} className="min-w-0">
              <a
                className={`block ${headingTextClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
                href={item.href}
              >
                <VariableProximity
                  label={item.label}
                  className="variable-proximity-demo"
                  containerRef={containerRef}
                  {...navVariableTextSettings}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
