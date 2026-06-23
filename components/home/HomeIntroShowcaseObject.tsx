"use client";

import { useEffect, useLayoutEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import InteractiveShowcaseObject from "@/components/home/InteractiveShowcaseObject";

let hasHandledHomeShowcaseIntro = false;
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const showcaseIntroInitial = {
  opacity: 0,
  scale: 0.96,
  filter: "blur(16px)",
};

const showcaseIntroAnimate = {
  opacity: 1,
  scale: 1,
  filter: "blur(0px)",
};

const showcaseIntroTransition = {
  duration: 1.1,
  delay: 0.25,
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
      <InteractiveShowcaseObject />
    </motion.div>
  );
}
