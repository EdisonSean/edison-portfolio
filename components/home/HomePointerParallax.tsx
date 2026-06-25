"use client";

import { useEffect } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const constrainedPointerQuery =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";
const videoParallaxX = 38;
const videoParallaxY = 28;
const logoParallaxX = 10;
const logoParallaxY = 7;
const smoothing = 0.12;

type ParallaxPosition = {
  x: number;
  y: number;
};

type DeviceOrientationEventConstructorWithPermission =
  typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<PermissionState>;
  };

function setVideoParallaxVariables(position: ParallaxPosition) {
  document.documentElement.style.setProperty(
    "--home-video-parallax-x",
    `${(-position.x * videoParallaxX).toFixed(2)}px`,
  );
  document.documentElement.style.setProperty(
    "--home-video-parallax-y",
    `${(-position.y * videoParallaxY).toFixed(2)}px`,
  );
}

function setLogoParallaxVariables(position: ParallaxPosition) {
  document.documentElement.style.setProperty(
    "--home-logo-parallax-x",
    `${(position.x * logoParallaxX).toFixed(2)}px`,
  );
  document.documentElement.style.setProperty(
    "--home-logo-parallax-y",
    `${(position.y * logoParallaxY).toFixed(2)}px`,
  );
}

function resetParallaxVariables() {
  const centeredPosition = { x: 0, y: 0 };
  setVideoParallaxVariables(centeredPosition);
  setLogoParallaxVariables(centeredPosition);
}

function clampParallaxValue(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export default function HomePointerParallax() {
  useEffect(() => {
    const reducedMotionMedia = window.matchMedia(reducedMotionQuery);
    const constrainedPointerMedia = window.matchMedia(constrainedPointerQuery);
    const currentVideoPosition: ParallaxPosition = { x: 0, y: 0 };
    const targetVideoPosition: ParallaxPosition = { x: 0, y: 0 };
    const currentLogoPosition: ParallaxPosition = { x: 0, y: 0 };
    const targetLogoPosition: ParallaxPosition = { x: 0, y: 0 };
    let animationFrameId = 0;
    let isMouseParallaxEnabled = false;
    let isDeviceOrientationEnabled = false;
    let isDeviceOrientationListening = false;
    let hasPromptedForDeviceOrientation = false;
    let hasDeviceOrientationPermission = false;
    let orientationBaseline: ParallaxPosition | null = null;

    const stopAnimation = () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const animateParallax = () => {
      currentVideoPosition.x +=
        (targetVideoPosition.x - currentVideoPosition.x) * smoothing;
      currentVideoPosition.y +=
        (targetVideoPosition.y - currentVideoPosition.y) * smoothing;
      currentLogoPosition.x +=
        (targetLogoPosition.x - currentLogoPosition.x) * smoothing;
      currentLogoPosition.y +=
        (targetLogoPosition.y - currentLogoPosition.y) * smoothing;

      setVideoParallaxVariables(currentVideoPosition);
      setLogoParallaxVariables(currentLogoPosition);

      const isSettled =
        Math.abs(targetVideoPosition.x - currentVideoPosition.x) < 0.001 &&
        Math.abs(targetVideoPosition.y - currentVideoPosition.y) < 0.001 &&
        Math.abs(targetLogoPosition.x - currentLogoPosition.x) < 0.001 &&
        Math.abs(targetLogoPosition.y - currentLogoPosition.y) < 0.001;

      if (isSettled) {
        currentVideoPosition.x = targetVideoPosition.x;
        currentVideoPosition.y = targetVideoPosition.y;
        currentLogoPosition.x = targetLogoPosition.x;
        currentLogoPosition.y = targetLogoPosition.y;
        setVideoParallaxVariables(currentVideoPosition);
        setLogoParallaxVariables(currentLogoPosition);
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
      if (!isMouseParallaxEnabled || event.pointerType !== "mouse") {
        return;
      }

      const pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      const pointerY = (event.clientY / window.innerHeight - 0.5) * 2;

      targetVideoPosition.x = pointerX;
      targetVideoPosition.y = pointerY;
      targetLogoPosition.x = pointerX;
      targetLogoPosition.y = pointerY;
      scheduleParallax();
    };

    const updateDeviceOrientationPosition = (event: DeviceOrientationEvent) => {
      if (
        !isDeviceOrientationEnabled ||
        event.beta === null ||
        event.gamma === null
      ) {
        return;
      }

      if (!orientationBaseline) {
        orientationBaseline = {
          x: event.gamma,
          y: event.beta,
        };
      }

      targetLogoPosition.x = clampParallaxValue(
        (event.gamma - orientationBaseline.x) / 18,
      );
      targetLogoPosition.y = clampParallaxValue(
        (event.beta - orientationBaseline.y) / 18,
      );
      scheduleParallax();
    };

    const startDeviceOrientation = () => {
      if (isDeviceOrientationListening || !isDeviceOrientationEnabled) {
        return;
      }

      window.addEventListener(
        "deviceorientation",
        updateDeviceOrientationPosition,
      );
      isDeviceOrientationListening = true;
    };

    const stopDeviceOrientation = () => {
      if (!isDeviceOrientationListening) {
        return;
      }

      window.removeEventListener(
        "deviceorientation",
        updateDeviceOrientationPosition,
      );
      isDeviceOrientationListening = false;
      orientationBaseline = null;
    };

    const getDeviceOrientationEvent = () => {
      if (typeof DeviceOrientationEvent === "undefined") {
        return null;
      }

      return DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission;
    };

    const canRequestDeviceOrientationPermission = () => {
      const deviceOrientationEvent =
        getDeviceOrientationEvent();

      return typeof deviceOrientationEvent?.requestPermission === "function";
    };

    const startDeviceOrientationIfPermissionIsNotRequired = () => {
      if (hasDeviceOrientationPermission) {
        startDeviceOrientation();
        return;
      }

      const deviceOrientationEvent = getDeviceOrientationEvent();

      if (
        deviceOrientationEvent &&
        !canRequestDeviceOrientationPermission()
      ) {
        startDeviceOrientation();
      }
    };

    const requestDeviceOrientationAccess = () => {
      if (!isDeviceOrientationEnabled || hasPromptedForDeviceOrientation) {
        return;
      }

      hasPromptedForDeviceOrientation = true;

      const deviceOrientationEvent = getDeviceOrientationEvent();

      if (!deviceOrientationEvent) {
        return;
      }

      if (!canRequestDeviceOrientationPermission()) {
        startDeviceOrientation();
        return;
      }

      const requestPermission = deviceOrientationEvent.requestPermission;

      if (!requestPermission) {
        return;
      }

      void requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            hasDeviceOrientationPermission = true;
            startDeviceOrientation();
          }
        })
        .catch(() => {
          resetTargetPosition();
        });
    };

    const resetTargetPosition = () => {
      targetVideoPosition.x = 0;
      targetVideoPosition.y = 0;
      targetLogoPosition.x = 0;
      targetLogoPosition.y = 0;
      scheduleParallax();
    };

    const syncEnabledState = () => {
      isMouseParallaxEnabled =
        !reducedMotionMedia.matches && !constrainedPointerMedia.matches;
      isDeviceOrientationEnabled =
        !reducedMotionMedia.matches && constrainedPointerMedia.matches;

      if (isDeviceOrientationEnabled) {
        startDeviceOrientationIfPermissionIsNotRequired();
      } else {
        stopDeviceOrientation();
      }

      if (!isMouseParallaxEnabled) {
        targetVideoPosition.x = 0;
        targetVideoPosition.y = 0;
        currentVideoPosition.x = 0;
        currentVideoPosition.y = 0;
        setVideoParallaxVariables(currentVideoPosition);
      }

      if (!isMouseParallaxEnabled && !isDeviceOrientationEnabled) {
        targetLogoPosition.x = 0;
        targetLogoPosition.y = 0;
        currentLogoPosition.x = 0;
        currentLogoPosition.y = 0;
        stopAnimation();
        setLogoParallaxVariables(currentLogoPosition);
      }
    };

    resetParallaxVariables();
    syncEnabledState();

    window.addEventListener("pointermove", updateTargetPosition, {
      passive: true,
    });
    window.addEventListener("pointerdown", requestDeviceOrientationAccess, {
      passive: true,
    });
    window.addEventListener("touchstart", requestDeviceOrientationAccess, {
      passive: true,
    });
    window.addEventListener("blur", resetTargetPosition);
    document.addEventListener("mouseleave", resetTargetPosition);
    reducedMotionMedia.addEventListener("change", syncEnabledState);
    constrainedPointerMedia.addEventListener("change", syncEnabledState);

    return () => {
      stopAnimation();
      stopDeviceOrientation();
      window.removeEventListener("pointermove", updateTargetPosition);
      window.removeEventListener("pointerdown", requestDeviceOrientationAccess);
      window.removeEventListener("touchstart", requestDeviceOrientationAccess);
      window.removeEventListener("blur", resetTargetPosition);
      document.removeEventListener("mouseleave", resetTargetPosition);
      reducedMotionMedia.removeEventListener("change", syncEnabledState);
      constrainedPointerMedia.removeEventListener("change", syncEnabledState);
      resetParallaxVariables();
    };
  }, []);

  return null;
}
