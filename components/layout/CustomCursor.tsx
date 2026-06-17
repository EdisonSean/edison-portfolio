"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorShapeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorShape = cursorShapeRef.current;
    if (!cursor || !cursorShape) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const moveCursor = (event: PointerEvent) => {
      cursor.style.opacity = "1";
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };

    const cancelCursorShapeAnimations = () => {
      cursorShape.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    };

    const animatePress = () => {
      cancelCursorShapeAnimations();
      cursorShape.animate(
        [
          {
            offset: 0,
            transform: "scale(0.82)",
            easing: "cubic-bezier(0.2, 0.75, 0.2, 1)",
          },
          {
            offset: 0.36,
            transform: "scale(1.45)",
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
          {
            offset: 1,
            transform: "scale(1.28)",
          },
        ],
        {
          duration: 180,
          fill: "forwards",
        },
      );
    };

    const animateRelease = () => {
      cancelCursorShapeAnimations();
      cursorShape.animate(
        [
          {
            offset: 0,
            transform: "scale(1.28)",
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
          {
            offset: 0.58,
            transform: "scale(0.92)",
            easing: "cubic-bezier(0.24, 0.8, 0.28, 1)",
          },
          {
            offset: 1,
            transform: "scale(1)",
          },
        ],
        {
          duration: 280,
          fill: "none",
        },
      );
    };

    const hideCursor = () => {
      cursor.style.opacity = "0";
      animateRelease();
    };

    window.addEventListener("pointermove", moveCursor);
    window.addEventListener("pointerdown", animatePress);
    window.addEventListener("pointerup", animateRelease);
    window.addEventListener("pointercancel", animateRelease);
    window.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", animatePress);
      window.removeEventListener("pointerup", animateRelease);
      window.removeEventListener("pointercancel", animateRelease);
      window.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 block opacity-0 transition-opacity duration-150 will-change-transform"
    >
      <div
        ref={cursorShapeRef}
        className="h-[22px] w-[22px] rounded-full bg-white/55 will-change-transform"
      />
    </div>
  );
}
