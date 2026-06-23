"use client";

import { useEffect, useLayoutEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import Header from "@/components/layout/Header";

let hasHandledHomeHeaderIntro = false;
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const headerIntroInitial = {
  opacity: 0,
  y: -24,
  filter: "blur(4px)",
};

const headerIntroAnimate = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
};

const headerIntroTransition = {
  duration: 0.75,
  delay: 0.1,
  ease: [0.22, 1, 0.36, 1],
} as const;

export default function HomeIntroHeader() {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  useBrowserLayoutEffect(() => {
    if (hasHandledHomeHeaderIntro || shouldReduceMotion !== false) {
      controls.set(headerIntroAnimate);
      hasHandledHomeHeaderIntro = true;
      return;
    }

    let isCurrentIntro = true;

    controls.set(headerIntroInitial);
    void controls.start({
      ...headerIntroAnimate,
      transition: headerIntroTransition,
    }).then(() => {
      if (isCurrentIntro) {
        hasHandledHomeHeaderIntro = true;
      }
    });

    return () => {
      isCurrentIntro = false;
    };
  }, [controls, shouldReduceMotion]);

  return (
    <motion.div
      className="relative z-10"
      initial={false}
      animate={controls}
    >
      <Header />
    </motion.div>
  );
}
