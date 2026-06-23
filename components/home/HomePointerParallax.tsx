"use client";

import { useEffect } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const constrainedPointerQuery =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";
const videoParallaxX = 20;
const videoParallaxY = 14;
const iconParallaxX = 32;
const iconParallaxY = 22;
const smoothing = 0.12;

type ParallaxPosition = {
  x: number;
  y: number;
};

function setParallaxVariables(position: ParallaxPosition) {
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
    `${(position.x * iconParallaxX).toFixed(2)}px`,
  );
  document.documentElement.style.setProperty(
    "--home-icon-parallax-y",
    `${(position.y * iconParallaxY).toFixed(2)}px`,
  );
}

function resetParallaxVariables() {
  setParallaxVariables({ x: 0, y: 0 });
}

export default function HomePointerParallax() {
  useEffect(() => {
    const reducedMotionMedia = window.matchMedia(reducedMotionQuery);
    const constrainedPointerMedia = window.matchMedia(constrainedPointerQuery);
    const currentPosition: ParallaxPosition = { x: 0, y: 0 };
    const targetPosition: ParallaxPosition = { x: 0, y: 0 };
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

      setParallaxVariables(currentPosition);

      const isSettled =
        Math.abs(targetPosition.x - currentPosition.x) < 0.001 &&
        Math.abs(targetPosition.y - currentPosition.y) < 0.001;

      if (isSettled) {
        currentPosition.x = targetPosition.x;
        currentPosition.y = targetPosition.y;
        setParallaxVariables(currentPosition);
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
      scheduleParallax();
    };

    const resetTargetPosition = () => {
      targetPosition.x = 0;
      targetPosition.y = 0;
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
