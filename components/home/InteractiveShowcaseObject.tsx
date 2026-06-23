"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import ShapeBlur from "./ShapeBlur";

const dragClickThreshold = 8;
const constrainedPointerQuery =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";
const logoFrameClassName =
  "relative block h-[240px] w-[min(82vw,760px)] min-w-[260px] max-w-[calc(100vw-2.5rem)] select-none cursor-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-[300px] lg:h-[360px]";

const interactionSurfaceStyle: CSSProperties & {
  WebkitTouchCallout?: string;
} = {
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
  userSelect: "none",
};

type PointerIntent = {
  pointerId: number;
  x: number;
  y: number;
  hasDragged: boolean;
};

function isConstrainedPointer() {
  return window.matchMedia(constrainedPointerQuery).matches;
}

export default function InteractiveShowcaseObject() {
  const [isLogoLinkEnabled, setIsLogoLinkEnabled] = useState(false);
  const pointerIntentRef = useRef<PointerIntent | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(constrainedPointerQuery);
    const updateLogoLinkState = () => {
      setIsLogoLinkEnabled(!mediaQuery.matches);
    };

    updateLogoLinkState();
    mediaQuery.addEventListener("change", updateLogoLinkState);

    return () => {
      mediaQuery.removeEventListener("change", updateLogoLinkState);
    };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    pointerIntentRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      hasDragged: false,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const pointerIntent = pointerIntentRef.current;

    if (!pointerIntent || pointerIntent.pointerId !== event.pointerId) {
      return;
    }

    const movement = Math.hypot(
      event.clientX - pointerIntent.x,
      event.clientY - pointerIntent.y,
    );

    if (movement >= dragClickThreshold) {
      pointerIntent.hasDragged = true;
    }
  };

  const handlePointerCancel = () => {
    pointerIntentRef.current = null;
  };

  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const shouldSuppressClick =
      !isLogoLinkEnabled ||
      isConstrainedPointer() ||
      pointerIntentRef.current?.hasDragged;

    pointerIntentRef.current = null;

    if (shouldSuppressClick) {
      event.preventDefault();
    }
  };

  const logoContent = (
    <ShapeBlur
      className="absolute inset-0"
      logoSrc="/assets/logo/LOGO_SVG_horizontal.svg"
      logoAspect={369.6609 / 98.2799}
      shapeSize={1.04}
      baseSoftness={0.9}
      blurRadius={86}
      circleSize={0.05}
      circleEdge={0.3}
      outerPointerRange={2.1}
    />
  );

  return (
    <section
      id="top"
      className="relative flex w-full min-w-0 flex-1 items-center justify-center py-14 sm:py-16 lg:py-8"
      aria-label="Interactive showcase object"
    >
      {isLogoLinkEnabled ? (
        <Link
          href="/work"
          aria-label="Open work archive"
          className={logoFrameClassName}
          style={interactionSurfaceStyle}
          onClick={handleClick}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          {logoContent}
        </Link>
      ) : (
        <div
          className={logoFrameClassName}
          style={interactionSurfaceStyle}
          aria-hidden="true"
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          {logoContent}
        </div>
      )}
    </section>
  );
}
