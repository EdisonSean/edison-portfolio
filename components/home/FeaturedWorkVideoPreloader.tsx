"use client";

import { useEffect } from "react";
import { getMediaSrc } from "@/lib/media";

type FeaturedWorkVideoPreloaderProps = {
  sources: string[];
};

const preloadedVideos = new Map<string, HTMLVideoElement>();
const constrainedMediaQuery =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";

function preloadVideo(src: string) {
  if (preloadedVideos.has(src)) {
    return;
  }

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = getMediaSrc(src);
  video.load();

  preloadedVideos.set(src, video);
}

export default function FeaturedWorkVideoPreloader({
  sources,
}: FeaturedWorkVideoPreloaderProps) {
  useEffect(() => {
    if (window.matchMedia(constrainedMediaQuery).matches) {
      return;
    }

    const timers = sources.map((src, index) =>
      window.setTimeout(() => {
        preloadVideo(src);
      }, index * 300),
    );

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [sources]);

  return null;
}
