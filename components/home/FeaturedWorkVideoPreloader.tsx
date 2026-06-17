"use client";

import { useEffect } from "react";

type FeaturedWorkVideoPreloaderProps = {
  sources: string[];
};

const preloadedVideos = new Map<string, HTMLVideoElement>();

function preloadVideo(src: string) {
  if (preloadedVideos.has(src)) {
    return;
  }

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = src;
  video.load();

  preloadedVideos.set(src, video);
}

export default function FeaturedWorkVideoPreloader({
  sources,
}: FeaturedWorkVideoPreloaderProps) {
  useEffect(() => {
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
