"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

const transitionPaths = ["/work", "/lab", "/about"];
const transitionDurationMs = 180;

function isTransitionPath(pathname: string) {
  return transitionPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const transitionTimeoutRef = useRef<number | null>(null);
  const [renderedChildren, setRenderedChildren] = useState(children);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const shouldTransition =
      previousPathname !== pathname &&
      isTransitionPath(previousPathname) &&
      isTransitionPath(pathname);

    previousPathnameRef.current = pathname;

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    if (!shouldTransition) {
      setRenderedChildren(children);
      setIsVisible(true);
      return;
    }

    setIsVisible(false);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setRenderedChildren(children);
      setIsVisible(true);
      transitionTimeoutRef.current = null;
    }, transitionDurationMs);
  }, [children, pathname]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={[
        "min-h-svh transition-opacity duration-200 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {renderedChildren}
    </div>
  );
}
