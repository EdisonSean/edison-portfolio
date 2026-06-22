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

  if (icon === "wechat") {
    return (
      <svg
        aria-hidden="true"
        className="h-[1.12em] w-[1.12em]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.2 17.4a6.4 6.4 0 1 1 5.52-3.16" />
        <path d="m5.1 18.7.72-2.38" />
        <path d="M13.9 11.7a4.5 4.5 0 1 1 3.98 6.61" />
        <path d="m19.4 19.5-.55-1.84" />
        <circle cx="7.8" cy="10" r="0.45" fill="currentColor" stroke="none" />
        <circle
          cx="11.2"
          cy="10"
          r="0.45"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="15.7"
          cy="15"
          r="0.38"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="18.1"
          cy="15"
          r="0.38"
          fill="currentColor"
          stroke="none"
        />
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

export default function Header() {
  const containerRef = useRef<HTMLElement | null>(null);
  const weChatRootRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [isCompressed, setIsCompressed] = useState(false);
  const [isWeChatOpen, setIsWeChatOpen] = useState(false);
  const [hasCopiedWeChat, setHasCopiedWeChat] = useState(false);
  const isHome = pathname === "/";
  const currentHeadingTextClass = isCompressed
    ? compressedHeadingTextClass
    : headingTextClass;
  const socialLinkSizeClass = isCompressed
    ? "h-8 w-8 text-[0.82rem]"
    : "h-9 w-9 text-[0.88rem] sm:h-10 sm:w-10 sm:text-[0.95rem]";

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

        <nav aria-label="Social links" className="flex items-center gap-1.5 sm:gap-2">
          {socialLinks.map((link) => (
            "href" in link ? (
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
            ) : (
              <div key={link.label} ref={weChatRootRef} className="relative">
                <button
                  type="button"
                  aria-label="WeChat"
                  aria-expanded={isWeChatOpen}
                  onClick={() => setIsWeChatOpen((isOpen) => !isOpen)}
                  className={[
                    "flex items-center justify-center border border-zinc-700/80 text-zinc-400 transition-all duration-300 hover:border-zinc-200 hover:bg-zinc-900/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    isWeChatOpen
                      ? "border-zinc-200 bg-zinc-900/70 text-white"
                      : "",
                    socialLinkSizeClass,
                  ].join(" ")}
                >
                  <SocialIcon icon={link.icon} />
                </button>

                <div
                  className={[
                    "absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 border border-zinc-700/80 bg-[#050505]/95 p-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-sm transition-all duration-200",
                    isWeChatOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0",
                  ].join(" ")}
                >
                  <p className="text-[0.72rem] font-semibold uppercase leading-none tracking-normal text-zinc-500">
                    WeChat
                  </p>
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
            )
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
