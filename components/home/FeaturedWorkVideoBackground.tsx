"use client";

import { useEffect, useMemo, useState } from "react";
import { getMediaSrc } from "@/lib/media";

type FeaturedWorkVideoBackgroundProps = {
  sources: string[];
};

const maxVideoDwellMs = 18000;

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

    const timeout = window.setTimeout(() => {
      setIsVideoReady(false);
      setActiveIndex((currentIndex) => (currentIndex + 1) % playlist.length);
    }, maxVideoDwellMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, playlist.length]);

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
            "h-full w-full object-cover",
            isVideoReady ? "opacity-60" : "opacity-0",
          ].join(" ")}
          style={{
            transform:
              "translate3d(var(--home-video-parallax-x, 0px), var(--home-video-parallax-y, 0px), 0) scale(1.1)",
            transformOrigin: "center",
            transitionProperty: "opacity",
            transitionDuration: "700ms",
            transitionTimingFunction: "ease",
            willChange: "opacity, transform",
          }}
          src={resolvedSource}
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setIsVideoReady(true)}
          onEnded={showNextVideo}
          onError={showNextVideo}
        />
      ) : null}
      <div className="absolute inset-0 bg-[#050505]/45" />
    </div>
  );
}
