"use client";

import { useEffect, useMemo, useState } from "react";
import { getMediaSrc } from "@/lib/media";

type FeaturedWorkVideoBackgroundProps = {
  sources: string[];
};

const carouselIntervalMs = 11000;

function shuffleSources(sources: string[]) {
  const shuffledSources = [...sources];

  for (let index = shuffledSources.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledSources[index], shuffledSources[swapIndex]] = [
      shuffledSources[swapIndex],
      shuffledSources[index],
    ];
  }

  return shuffledSources;
}

export default function FeaturedWorkVideoBackground({
  sources,
}: FeaturedWorkVideoBackgroundProps) {
  const stableSources = useMemo(() => Array.from(new Set(sources)), [sources]);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const activeSource = playlist[activeIndex] ?? null;
  const resolvedSource = activeSource ? getMediaSrc(activeSource) : null;

  useEffect(() => {
    setPlaylist(shuffleSources(stableSources));
    setActiveIndex(0);
    setIsVideoReady(false);
  }, [stableSources]);

  useEffect(() => {
    if (playlist.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setIsVideoReady(false);
      setActiveIndex((currentIndex) => (currentIndex + 1) % playlist.length);
    }, carouselIntervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [playlist.length]);

  const showNextVideo = () => {
    if (playlist.length <= 1) {
      return;
    }

    setIsVideoReady(false);
    setActiveIndex((currentIndex) => (currentIndex + 1) % playlist.length);
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#050505]"
    >
      {resolvedSource ? (
        <video
          key={activeSource}
          className={[
            "h-full w-full object-cover transition-opacity duration-700",
            isVideoReady ? "opacity-60" : "opacity-0",
          ].join(" ")}
          src={resolvedSource}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setIsVideoReady(true)}
          onError={showNextVideo}
        />
      ) : null}
      <div className="absolute inset-0 bg-[#050505]/45" />
    </div>
  );
}
