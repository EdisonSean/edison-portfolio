"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const wheelLineHeight = 16;
const dragThreshold = 4;
const dragScrollMultiplier = 1.1;
const smoothStepSizePx = 300;
const smoothAnimationTimeMs = 400;
const accelerationDeltaMs = 30;
const accelerationMax = 20;
const tailToHeadRatio = 6;
const dragHintText = "Try holding and dragging";
const dragHintTextZh = "尝试按住并拖拽";
const dragHintOffsetX = 20;
const dragHintOffsetY = 0;
const dragHintVisibleMs = 3600;
const dragHintStorageKey = "edison-has-used-drag-scroll";
const archiveScrollStartEvent = "edison:archive-scroll-start";

function getMaxScrollY() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
}

function clampScrollY(value: number) {
  return Math.min(Math.max(value, 0), getMaxScrollY());
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * wheelLineHeight;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function getWheelStepDelta(event: WheelEvent, accelerationFactor: number) {
  const normalizedDelta = normalizeWheelDelta(event);
  const direction = Math.sign(normalizedDelta);

  if (direction === 0) {
    return 0;
  }

  const wheelUnits = Math.min(Math.max(Math.abs(normalizedDelta) / 100, 1), 3);

  return direction * smoothStepSizePx * wheelUnits * accelerationFactor;
}

function canScrollElement(element: HTMLElement, deltaY: number) {
  const style = window.getComputedStyle(element);
  const canOverflow =
    style.overflowY === "auto" ||
    style.overflowY === "scroll" ||
    style.overflowY === "overlay";

  if (!canOverflow || element.scrollHeight <= element.clientHeight) {
    return false;
  }

  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  if (deltaY < 0) {
    return element.scrollTop > 0;
  }

  return false;
}

function hasScrollableAncestor(target: EventTarget | null, deltaY: number) {
  let element = target instanceof HTMLElement ? target : null;

  while (element && element !== document.body) {
    if (canScrollElement(element, deltaY)) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}

function getStoredDragUsage() {
  try {
    return window.sessionStorage.getItem(dragHintStorageKey) === "true";
  } catch {
    return false;
  }
}

function setStoredDragUsage(hasUsedDragScroll: boolean) {
  try {
    if (hasUsedDragScroll) {
      window.sessionStorage.setItem(dragHintStorageKey, "true");
    } else {
      window.sessionStorage.removeItem(dragHintStorageKey);
    }
  } catch {
    return;
  }
}

function getNavigatorPlatform() {
  const userAgentData = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };

  return userAgentData.userAgentData?.platform ?? navigator.platform ?? "";
}

function shouldUseNativeScroll() {
  const platform = getNavigatorPlatform();
  const userAgent = navigator.userAgent;
  const isMac = /Mac/i.test(platform) || /Macintosh/i.test(userAgent);
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const isPureTouchDevice = hasCoarsePointer && !hasFinePointer;
  const isMobileUserAgent =
    /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(userAgent);

  return isMac || isPureTouchDevice || isMobileUserAgent;
}

export default function ScrollEnhancer() {
  const pathname = usePathname();
  const dragHintRef = useRef<HTMLDivElement | null>(null);
  const hasUsedDragScrollRef = useRef(false);

  useEffect(() => {
    const dragHint = dragHintRef.current;

    if (pathname === "/") {
      hasUsedDragScrollRef.current = false;
      setStoredDragUsage(false);
      if (dragHint) {
        dragHint.style.opacity = "0";
      }
      return;
    }

    hasUsedDragScrollRef.current = getStoredDragUsage();

    if (shouldUseNativeScroll()) {
      if (dragHint) {
        dragHint.style.opacity = "0";
      }
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationFrameId = 0;
    let targetScrollY = window.scrollY;
    let animationStartY = window.scrollY;
    let animationStartTime = 0;
    let lastWheelTime = 0;
    let accelerationTicks = 0;
    let isPointerDown = false;
    let isDragging = false;
    let suppressNextContextMenu = false;
    let pointerButton = -1;
    let startX = 0;
    let startY = 0;
    let startScrollY = window.scrollY;
    let previousHtmlUserSelect = "";
    let previousBodyUserSelect = "";
    let isDragHintVisible = false;
    let dragHintTimeoutId = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const positionDragHint = () => {
      if (!dragHint) {
        return;
      }

      dragHint.style.transform = `translate3d(${
        pointerX + dragHintOffsetX
      }px, ${pointerY + dragHintOffsetY}px, 0) translateY(-50%)`;
    };

    const hideDragHint = () => {
      if (dragHintTimeoutId !== 0) {
        window.clearTimeout(dragHintTimeoutId);
        dragHintTimeoutId = 0;
      }

      isDragHintVisible = false;

      if (dragHint) {
        dragHint.style.opacity = "0";
      }
    };

    const showDragHint = () => {
      if (
        !finePointer ||
        reducedMotion ||
        hasUsedDragScrollRef.current ||
        !dragHint
      ) {
        return;
      }

      positionDragHint();
      dragHint.style.opacity = "1";
      isDragHintVisible = true;

      if (dragHintTimeoutId !== 0) {
        window.clearTimeout(dragHintTimeoutId);
      }

      dragHintTimeoutId = window.setTimeout(() => {
        hideDragHint();
      }, dragHintVisibleMs);
    };

    const stopAnimation = () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const animateScroll = () => {
      const elapsed = performance.now() - animationStartTime;
      const progress = Math.min(elapsed / smoothAnimationTimeMs, 1);
      const easedProgress = easeOutCubic(progress);
      const nextScrollY =
        animationStartY + (targetScrollY - animationStartY) * easedProgress;

      window.scrollTo({ top: nextScrollY });

      if (progress >= 1) {
        window.scrollTo({ top: targetScrollY });
        animationFrameId = 0;
        return;
      }

      animationFrameId = window.requestAnimationFrame(animateScroll);
    };

    const scheduleScroll = () => {
      animationStartY = window.scrollY;
      animationStartTime = performance.now();

      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(animateScroll);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || reducedMotion) {
        return;
      }

      const deltaY = normalizeWheelDelta(event);

      if (hasScrollableAncestor(event.target, deltaY)) {
        return;
      }

      event.preventDefault();
      const now = performance.now();
      showDragHint();

      if (now - lastWheelTime <= accelerationDeltaMs) {
        accelerationTicks += 1;
      } else {
        accelerationTicks = 0;
        targetScrollY = window.scrollY;
      }

      lastWheelTime = now;

      const accelerationFactor = Math.min(
        accelerationMax,
        1 + accelerationTicks / tailToHeadRatio,
      );

      targetScrollY = clampScrollY(
        targetScrollY + getWheelStepDelta(event, accelerationFactor),
      );
      scheduleScroll();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        !finePointer ||
        reducedMotion ||
        (event.button !== 0 && event.button !== 2)
      ) {
        return;
      }

      previousHtmlUserSelect = document.documentElement.style.userSelect;
      previousBodyUserSelect = document.body.style.userSelect;
      document.documentElement.style.userSelect = "none";
      document.body.style.userSelect = "none";
      isPointerDown = true;
      isDragging = false;
      pointerButton = event.button;
      startX = event.clientX;
      startY = event.clientY;
      startScrollY = window.scrollY;
      targetScrollY = window.scrollY;
      stopAnimation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (isDragHintVisible) {
        positionDragHint();
      }

      const pointerButtonMask = pointerButton === 2 ? 2 : 1;

      if (!isPointerDown || (event.buttons & pointerButtonMask) === 0) {
        return;
      }

      const movementX = event.clientX - startX;
      const movementY = event.clientY - startY;

      if (!isDragging) {
        if (Math.hypot(movementX, movementY) < dragThreshold) {
          return;
        }

        isDragging = true;
        hasUsedDragScrollRef.current = true;
        setStoredDragUsage(true);
        hideDragHint();
        window.getSelection()?.removeAllRanges();
        if (pointerButton === 2) {
          suppressNextContextMenu = true;
        }
      }

      event.preventDefault();
      const deltaY = (startY - event.clientY) * dragScrollMultiplier;
      targetScrollY = clampScrollY(startScrollY + deltaY);
      window.scrollTo({ top: targetScrollY });
    };

    const resetPointerState = () => {
      document.documentElement.style.userSelect = previousHtmlUserSelect;
      document.body.style.userSelect = previousBodyUserSelect;
      isPointerDown = false;
      isDragging = false;
      pointerButton = -1;
      targetScrollY = window.scrollY;
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (!suppressNextContextMenu) {
        return;
      }

      event.preventDefault();
      suppressNextContextMenu = false;
    };

    const handleScroll = () => {
      if (!isPointerDown && animationFrameId === 0) {
        targetScrollY = window.scrollY;
      }
    };

    const handleArchiveScrollStart = () => {
      stopAnimation();
      targetScrollY = window.scrollY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", resetPointerState);
    window.addEventListener("pointercancel", resetPointerState);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener(archiveScrollStartEvent, handleArchiveScrollStart);
    window.addEventListener("pointerleave", hideDragHint);
    window.addEventListener("blur", hideDragHint);

    return () => {
      stopAnimation();
      hideDragHint();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", resetPointerState);
      window.removeEventListener("pointercancel", resetPointerState);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(
        archiveScrollStartEvent,
        handleArchiveScrollStart,
      );
      window.removeEventListener("pointerleave", hideDragHint);
      window.removeEventListener("blur", hideDragHint);
    };
  }, [pathname]);

  return (
    <div
      ref={dragHintRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[55] max-w-[12rem] text-[0.82rem] font-semibold leading-tight text-white/25 opacity-0 mix-blend-difference transition-opacity duration-200 will-change-transform"
    >
      <span className="block">{dragHintText}</span>
      <span className="block">{dragHintTextZh}</span>
    </div>
  );
}
