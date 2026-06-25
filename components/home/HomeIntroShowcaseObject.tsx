"use client";

import { useEffect, useLayoutEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import InteractiveShowcaseObject from "@/components/home/InteractiveShowcaseObject";

let hasHandledHomeShowcaseIntro = false;
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const showcaseIntroInitial = {
  opacity: 0,
  scale: 0.92,
  filter: "blur(26px)",
};

const showcaseIntroAnimate = {
  opacity: 1,
  scale: 1,
  filter: "blur(0px)",
};

const showcaseIntroTransition = {
  duration: 1.55,
  delay: 0.3,
  ease: [0.22, 1, 0.36, 1],
} as const;

export default function HomeIntroShowcaseObject() {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  useBrowserLayoutEffect(() => {
    if (hasHandledHomeShowcaseIntro || shouldReduceMotion !== false) {
      controls.set(showcaseIntroAnimate);
      hasHandledHomeShowcaseIntro = true;
      return;
    }

    let isCurrentIntro = true;

    controls.set(showcaseIntroInitial);
    void controls.start({
      ...showcaseIntroAnimate,
      transition: showcaseIntroTransition,
    }).then(() => {
      if (isCurrentIntro) {
        hasHandledHomeShowcaseIntro = true;
      }
    });

    return () => {
      isCurrentIntro = false;
    };
  }, [controls, shouldReduceMotion]);

  return (
    <motion.div
      className="relative flex min-w-0 flex-1"
      initial={false}
      animate={controls}
    >
      <div
        className="relative flex min-w-0 flex-1"
        style={{
          filter: "blur(var(--home-logo-scroll-blur, 0px))",
          opacity: "var(--home-logo-scroll-opacity, 1)",
          transform:
            "translate3d(var(--home-logo-parallax-x, 0px), calc(var(--home-logo-parallax-y, 0px) - var(--home-logo-scroll-y, 0px)), 0)",
          willChange: "filter, opacity, transform",
        }}
      >
        <InteractiveShowcaseObject />
      </div>
    </motion.div>
  );
}
