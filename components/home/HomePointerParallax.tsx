"use client";

import { useEffect } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const constrainedPointerQuery =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";
const videoParallaxX = 20;
const videoParallaxY = 14;
const iconParallaxX = 32;
const iconParallaxY = 22;
const iconParallaxTargetSelector = "[data-home-icon-parallax-target]";
const iconOuterStrength = 0.16;
const smoothing = 0.12;

type ParallaxPosition = {
  x: number;
  y: number;
};

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const x = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return x * x * (3 - 2 * x);
}

function getDistanceToRect(clientX: number, clientY: number, rect: DOMRect) {
  const x = Math.max(rect.left - clientX, 0, clientX - rect.right);
  const y = Math.max(rect.top - clientY, 0, clientY - rect.bottom);

  return Math.hypot(x, y);
}

function getIconParallaxStrength(clientX: number, clientY: number) {
  const targetElement = document.querySelector<HTMLElement>(
    iconParallaxTargetSelector,
  );

  if (!targetElement) {
    return 1;
  }

  const rect = targetElement.getBoundingClientRect();
  const minDimension = Math.max(1, Math.min(rect.width, rect.height));
  const distance = getDistanceToRect(clientX, clientY, rect);
  const closeDistance = minDimension * 0.12;
  const strongFalloffDistance = minDimension * 0.42;
  const wideReachDistance = minDimension * 1.95;
  const closeStrength =
    1 - smoothstep(closeDistance, strongFalloffDistance, distance);
  const wideStrength =
    iconOuterStrength *
    (1 - smoothstep(strongFalloffDistance, wideReachDistance, distance));

  return Math.min(1, closeStrength + wideStrength);
}

function setParallaxVariables(
  position: ParallaxPosition,
  iconStrength: number,
) {
  document.documentElement.style.setProperty(
    "--home-video-parallax-x",
    `${(-position.x * videoParallaxX).toFixed(2)}px`,
  );
  document.documentElement.style.setProperty(
    "--home-video-parallax-y",
    `${(-position.y * videoParallaxY).toFixed(2)}px`,
  );
  document.documentElement.style.setProperty(
    "--home-icon-parallax-x",
    `${(position.x * iconParallaxX * iconStrength).toFixed(2)}px`,
  );
  document.documentElement.style.setProperty(
    "--home-icon-parallax-y",
    `${(position.y * iconParallaxY * iconStrength).toFixed(2)}px`,
  );
}

function resetParallaxVariables() {
  setParallaxVariables({ x: 0, y: 0 }, 0);
}

export default function HomePointerParallax() {
  useEffect(() => {
    const reducedMotionMedia = window.matchMedia(reducedMotionQuery);
    const constrainedPointerMedia = window.matchMedia(constrainedPointerQuery);
    const currentPosition: ParallaxPosition = { x: 0, y: 0 };
    const targetPosition: ParallaxPosition = { x: 0, y: 0 };
    let currentIconStrength = 0;
    let targetIconStrength = 0;
    let animationFrameId = 0;
    let isEnabled = false;

    const stopAnimation = () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const animateParallax = () => {
      currentPosition.x += (targetPosition.x - currentPosition.x) * smoothing;
      currentPosition.y += (targetPosition.y - currentPosition.y) * smoothing;
      currentIconStrength +=
        (targetIconStrength - currentIconStrength) * smoothing;

      setParallaxVariables(currentPosition, currentIconStrength);

      const isSettled =
        Math.abs(targetPosition.x - currentPosition.x) < 0.001 &&
        Math.abs(targetPosition.y - currentPosition.y) < 0.001 &&
        Math.abs(targetIconStrength - currentIconStrength) < 0.001;

      if (isSettled) {
        currentPosition.x = targetPosition.x;
        currentPosition.y = targetPosition.y;
        currentIconStrength = targetIconStrength;
        setParallaxVariables(currentPosition, currentIconStrength);
        animationFrameId = 0;
        return;
      }

      animationFrameId = window.requestAnimationFrame(animateParallax);
    };

    const scheduleParallax = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(animateParallax);
      }
    };

    const updateTargetPosition = (event: PointerEvent) => {
      if (!isEnabled || event.pointerType !== "mouse") {
        return;
      }

      targetPosition.x = (event.clientX / window.innerWidth - 0.5) * 2;
      targetPosition.y = (event.clientY / window.innerHeight - 0.5) * 2;
      targetIconStrength = getIconParallaxStrength(
        event.clientX,
        event.clientY,
      );
      scheduleParallax();
    };

    const resetTargetPosition = () => {
      targetPosition.x = 0;
      targetPosition.y = 0;
      targetIconStrength = 0;
      scheduleParallax();
    };

    const syncEnabledState = () => {
      isEnabled =
        !reducedMotionMedia.matches && !constrainedPointerMedia.matches;

      if (!isEnabled) {
        targetPosition.x = 0;
        targetPosition.y = 0;
        currentPosition.x = 0;
        currentPosition.y = 0;
        targetIconStrength = 0;
        currentIconStrength = 0;
        stopAnimation();
        resetParallaxVariables();
      }
    };

    resetParallaxVariables();
    syncEnabledState();

    window.addEventListener("pointermove", updateTargetPosition, {
      passive: true,
    });
    window.addEventListener("blur", resetTargetPosition);
    document.addEventListener("mouseleave", resetTargetPosition);
    reducedMotionMedia.addEventListener("change", syncEnabledState);
    constrainedPointerMedia.addEventListener("change", syncEnabledState);

    return () => {
      stopAnimation();
      window.removeEventListener("pointermove", updateTargetPosition);
      window.removeEventListener("blur", resetTargetPosition);
      document.removeEventListener("mouseleave", resetTargetPosition);
      reducedMotionMedia.removeEventListener("change", syncEnabledState);
      constrainedPointerMedia.removeEventListener("change", syncEnabledState);
      resetParallaxVariables();
    };
  }, []);

  return null;
}
