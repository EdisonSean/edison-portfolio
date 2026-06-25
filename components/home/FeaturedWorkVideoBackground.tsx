"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getMediaSrc } from "@/lib/media";

type FeaturedWorkVideoBackgroundProps = {
  sources: string[];
};

const maxVideoDwellMs = 18000;

function getWeChatVideoSource(src: string) {
  const lastSlashIndex = src.lastIndexOf("/");
  const directory = src.slice(0, lastSlashIndex);
  const fileName = src.slice(lastSlashIndex + 1);
  const extensionIndex = fileName.lastIndexOf(".");
  const baseName =
    extensionIndex >= 0 ? fileName.slice(0, extensionIndex) : fileName;

  return `${directory}/wechat/${baseName}.mp4`;
}

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
  const [isWeChatBrowser, setIsWeChatBrowser] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeSource = playlist[activeIndex] ?? null;
  const resolvedSource = activeSource
    ? getMediaSrc(
        isWeChatBrowser ? getWeChatVideoSource(activeSource) : activeSource,
      )
    : null;

  useEffect(() => {
    setIsWeChatBrowser(/MicroMessenger/i.test(navigator.userAgent));
    setPlaylist(shuffleSources(stableSources));
    setActiveIndex(0);
    setIsVideoReady(false);
  }, [stableSources]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !isWeChatBrowser || !resolvedSource) {
      return;
    }

    videoElement.setAttribute("webkit-playsinline", "true");
    videoElement.setAttribute("x5-playsinline", "true");
    videoElement.setAttribute("x5-video-player-type", "h5");
    videoElement.setAttribute("x5-video-player-fullscreen", "false");

    const retryPlayback = () => {
      const playPromise = videoElement.play();

      if (playPromise) {
        playPromise.catch(() => {
          videoElement.pause();
        });
      }
    };

    document.addEventListener("WeixinJSBridgeReady", retryPlayback);
    window.addEventListener("touchstart", retryPlayback, {
      passive: true,
    });

    if ("WeixinJSBridge" in window) {
      retryPlayback();
    }

    return () => {
      document.removeEventListener("WeixinJSBridgeReady", retryPlayback);
      window.removeEventListener("touchstart", retryPlayback);
    };
  }, [isWeChatBrowser, resolvedSource]);

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
          ref={videoRef}
          key={resolvedSource}
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
          onCanPlay={(event) => {
            setIsVideoReady(true);

            if (isWeChatBrowser) {
              const playPromise = event.currentTarget.play();

              if (playPromise) {
                playPromise.catch(() => {
                  event.currentTarget.pause();
                });
              }
            }
          }}
          onEnded={showNextVideo}
          onError={showNextVideo}
        />
      ) : null}
      <div className="absolute inset-0 bg-[#050505]/45" />
    </div>
  );
}
