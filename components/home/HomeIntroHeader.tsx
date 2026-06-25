"use client";

import { useEffect, useLayoutEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import Header from "@/components/layout/Header";

let hasHandledHomeHeaderIntro = false;
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const headerIntroInitial = {
  opacity: 0,
  y: -44,
  filter: "blur(8px)",
};

const headerIntroAnimate = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
};

const headerIntroTransition = {
  duration: 1.05,
  delay: 0.12,
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
      className="fixed inset-x-0 top-0 z-[60]"
      initial={false}
      animate={controls}
    >
      <Header />
    </motion.div>
  );
}
