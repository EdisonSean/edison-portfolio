"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { mediaDimensions } from "@/data/mediaDimensions";
import VariableProximity from "@/components/typography/VariableProximity";
import ViewportYVariableText from "@/components/typography/ViewportYVariableText";

export type ArchiveMediaType = "image" | "webp" | "video";

export type ArchiveMediaItem = {
  type: ArchiveMediaType;
  src: string;
  poster?: string | null;
  description?: string;
  layout?: "full" | "half";
};

export type ArchiveProjectEntry = {
  slug: string;
  title: string;
  projectName?: string;
  client?: string;
  year: number;
  role: string[];
  media: ArchiveMediaItem[];
  description: string;
};

export function getArchiveItemId(slug: string) {
  return `archive-item-${slug}`;
}

const archiveTitleVariableTextSettings = {
  fromFontVariationSettings: "'wght' 600, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  radius: 140,
  falloff: "gaussian" as const,
};
const archiveProjectTitleVariableTextSettings = {
  fromFontVariationSettings: "'wght' 700, 'opsz' 18",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  radius: 120,
  falloff: "gaussian" as const,
};
const archiveNumberVariableTextSettings = {
  fromFontVariationSettings: "'wght' 500, 'opsz' 14",
  toFontVariationSettings: "'wght' 1000, 'opsz' 42",
  viewportRadiusRatio: 0.42,
};

type ArchiveContentProps = {
  title: string;
  meta: string;
  description?: string;
  keywords: string[];
  items: ArchiveProjectEntry[];
  emptyMessage: string;
  activeItemSlug?: string | null;
  onActiveItemChange?: (slug: string) => void;
  showItemDetails?: boolean;
};

type ArchiveMediaFrameProps = {
  type: ArchiveMediaType;
  src: string;
  alt: string;
  poster?: string | null;
  className?: string;
};

type ViewportVideoProps = {
  src: string;
  poster?: string | null;
  shouldLoad: boolean;
};

const fallbackMediaDimensions = {
  width: 16,
  height: 9,
};

const constrainedMediaQuery =
  "(max-width: 767px), (hover: none) and (pointer: coarse)";
const desktopLazyLoadRootMargin = "450px 0px";
const constrainedLazyLoadRootMargin = "150px 0px";
const loadedArchiveMediaSources = new Set<string>();

function getMediaDimensions(src: string) {
  return mediaDimensions[src] ?? fallbackMediaDimensions;
}

function getMediaFrameStyle(src: string): CSSProperties {
  const dimensions = getMediaDimensions(src);

  return {
    aspectRatio: `${dimensions.width} / ${dimensions.height}`,
  };
}

function getBufferedProgress(videoElement: HTMLVideoElement) {
  const { duration, buffered } = videoElement;

  if (!Number.isFinite(duration) || duration <= 0 || buffered.length === 0) {
    return 0;
  }

  try {
    let bufferedEnd = 0;

    for (let index = 0; index < buffered.length; index += 1) {
      bufferedEnd = Math.max(bufferedEnd, buffered.end(index));
    }

    return Math.min(Math.max(bufferedEnd / duration, 0), 1);
  } catch {
    return 0;
  }
}

function ViewportVideo({ src, poster, shouldLoad }: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);
  const [usesConstrainedLoading, setUsesConstrainedLoading] = useState(true);
  const [shouldBufferForPlayback, setShouldBufferForPlayback] = useState(false);
  const preloadMode =
    usesConstrainedLoading && !shouldBufferForPlayback ? "metadata" : "auto";

  const togglePlayback = () => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      if (!isReadyToPlay) {
        return;
      }

      const playPromise = videoElement.play();

      if (playPromise) {
        playPromise.catch(() => {
          videoElement.pause();
        });
      }
    } else {
      videoElement.pause();
    }
  };

  useEffect(() => {
    setLoadProgress(0);
    setIsReadyToPlay(false);
    setShouldBufferForPlayback(false);
  }, [src]);

  useEffect(() => {
    setUsesConstrainedLoading(
      window.matchMedia(constrainedMediaQuery).matches,
    );
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !shouldLoad) {
      return;
    }

    const updateLoadProgress = () => {
      setLoadProgress(getBufferedProgress(videoElement));
      setIsReadyToPlay(
        videoElement.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA,
      );
    };

    const progressEvents = [
      "durationchange",
      "loadedmetadata",
      "loadeddata",
      "progress",
      "canplay",
      "canplaythrough",
      "playing",
    ];

    updateLoadProgress();
    progressEvents.forEach((eventName) => {
      videoElement.addEventListener(eventName, updateLoadProgress);
    });

    return () => {
      progressEvents.forEach((eventName) => {
        videoElement.removeEventListener(eventName, updateLoadProgress);
      });
    };
  }, [shouldLoad, src]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInPlaybackRange =
          entry.isIntersecting && entry.intersectionRatio >= 0.35;

        if (
          usesConstrainedLoading &&
          !shouldBufferForPlayback &&
          isInPlaybackRange
        ) {
          setShouldBufferForPlayback(true);
          videoElement.preload = "auto";
          videoElement.load();
        }

        if (
          shouldLoad &&
          isReadyToPlay &&
          isInPlaybackRange
        ) {
          const playPromise = videoElement.play();

          if (playPromise) {
            playPromise.catch(() => {
              videoElement.pause();
            });
          }
        } else {
          videoElement.pause();
        }
      },
      {
        root: null,
        rootMargin: "18% 0px",
        threshold: [0, 0.35],
      },
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
      videoElement.pause();
    };
  }, [
    isReadyToPlay,
    shouldBufferForPlayback,
    shouldLoad,
    usesConstrainedLoading,
  ]);

  return (
    <>
      <video
        ref={videoRef}
        className={[
          "absolute inset-0 h-full w-full cursor-none object-contain transition-[filter] duration-300",
          isReadyToPlay ? "brightness-100" : "brightness-50",
        ].join(" ")}
        src={shouldLoad ? src : undefined}
        poster={shouldLoad ? (poster ?? undefined) : undefined}
        muted
        loop
        playsInline
        preload={preloadMode}
        aria-label="Double click to toggle video playback"
        tabIndex={0}
        onDoubleClick={togglePlayback}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            togglePlayback();
          }
        }}
      />
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-[min(12rem,46%)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-zinc-700/80 transition-opacity duration-300",
          isReadyToPlay ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div
          className="h-full origin-left rounded-full bg-zinc-300 transition-transform duration-200 ease-out will-change-transform"
          style={{ transform: `scaleX(${loadProgress})` }}
        />
      </div>
    </>
  );
}

function useLazyMediaLoad(src: string) {
  const mediaRootRef = useRef<HTMLDivElement | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(() =>
    loadedArchiveMediaSources.has(src) ? src : null,
  );
  const shouldLoad = loadedSource === src || loadedArchiveMediaSources.has(src);

  useEffect(() => {
    const mediaRoot = mediaRootRef.current;
    if (!mediaRoot || shouldLoad) {
      return;
    }
    const rootMargin = window.matchMedia(constrainedMediaQuery).matches
      ? constrainedLazyLoadRootMargin
      : desktopLazyLoadRootMargin;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadedArchiveMediaSources.add(src);
          setLoadedSource(src);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(mediaRoot);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad, src]);

  return { mediaRootRef, shouldLoad };
}

function ArchiveMediaFrame({
  type,
  src,
  alt,
  poster,
  className = "",
}: ArchiveMediaFrameProps) {
  const frameClassName = ["relative w-full overflow-hidden bg-[#111]", className]
    .filter(Boolean)
    .join(" ");
  const frameStyle = getMediaFrameStyle(src);
  const { mediaRootRef, shouldLoad } = useLazyMediaLoad(src);

  if (type === "video") {
    return (
      <div ref={mediaRootRef} className={frameClassName} style={frameStyle}>
        {shouldLoad ? (
          <ViewportVideo src={src} poster={poster} shouldLoad={shouldLoad} />
        ) : null}
      </div>
    );
  }

  return (
    <div ref={mediaRootRef} className={frameClassName} style={frameStyle}>
      {shouldLoad ? (
        <img
          className="absolute inset-0 block h-full w-full object-contain"
          src={src}
          alt={alt}
          loading="lazy"
        />
      ) : null}
    </div>
  );
}

export default function ArchiveContent({
  title,
  items,
  emptyMessage,
  activeItemSlug,
  onActiveItemChange,
  showItemDetails = true,
}: ArchiveContentProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!onActiveItemChange || items.length === 0) {
      return;
    }

    let animationFrameId = 0;
    let lastActiveSlug = activeItemSlug ?? null;

    const updateActiveItem = () => {
      animationFrameId = 0;

      const viewportMiddle = window.innerHeight / 2;
      const itemElements = items
        .map((item) => document.getElementById(getArchiveItemId(item.slug)))
        .filter((element): element is HTMLElement => Boolean(element));
      let activeSlug =
        itemElements[0]?.getAttribute("data-archive-slug") ?? null;

      for (const element of itemElements) {
        if (element.getBoundingClientRect().top <= viewportMiddle) {
          activeSlug = element.getAttribute("data-archive-slug");
        } else {
          break;
        }
      }

      if (activeSlug && activeSlug !== lastActiveSlug) {
        lastActiveSlug = activeSlug;
        onActiveItemChange(activeSlug);
      }
    };

    const scheduleActiveItemUpdate = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(updateActiveItem);
      }
    };

    updateActiveItem();
    window.addEventListener("scroll", scheduleActiveItemUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleActiveItemUpdate);

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("scroll", scheduleActiveItemUpdate);
      window.removeEventListener("resize", scheduleActiveItemUpdate);
    };
  }, [activeItemSlug, items, onActiveItemChange]);

  return (
    <section
      ref={containerRef}
      className="min-w-0 text-white"
      data-archive-content-root
    >
      <h2 className="mb-16 max-w-[78rem] text-[clamp(2.95rem,7.35vw,8.4rem)] font-semibold leading-[0.86] 2xl:max-w-none 2xl:text-[clamp(4.9rem,5.75vw,15.4rem)]">
        <VariableProximity
          label={title}
          className="block"
          containerRef={containerRef}
          {...archiveTitleVariableTextSettings}
        />
      </h2>

      {items.length > 0 ? (
        <ol className="space-y-20 text-[1.05rem] font-semibold leading-[1.28] md:text-[1.18rem] 2xl:space-y-28">
          {items.map((item, index) => (
            <li
              key={item.slug}
              id={getArchiveItemId(item.slug)}
              data-archive-slug={item.slug}
              className="grid scroll-mt-28 gap-5 md:grid-cols-[minmax(3rem,5.6vw)_minmax(0,1fr)] 2xl:grid-cols-[minmax(4.2rem,6.3vw)_minmax(0,1fr)]"
            >
              <span
                className={[
                  "text-[clamp(3.15rem,6.3vw,9.8rem)] leading-[0.78] transition-colors duration-200",
                  activeItemSlug === item.slug ? "text-white" : "text-zinc-700",
                ].join(" ")}
              >
                <ViewportYVariableText
                  label={String(index + 1)}
                  className="block"
                  {...archiveNumberVariableTextSettings}
                />
              </span>

              <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-[1ch]">
                <span
                  aria-hidden="true"
                  className="inline-block translate-y-[-0.04em] text-[clamp(2.65rem,4.12vw,4.72rem)] font-bold leading-none text-zinc-200"
                >
                  *
                </span>

                <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                  <p className="text-[clamp(1.35rem,2.1vw,2.4rem)] font-bold leading-[1.08] text-zinc-200">
                    <VariableProximity
                      label={item.title}
                      containerRef={containerRef}
                      {...archiveProjectTitleVariableTextSettings}
                    />
                  </p>
                  <p className="text-zinc-500 md:text-right">{item.year}</p>
                </div>

                {showItemDetails ? (
                  <div className="col-start-2 mt-8 text-zinc-500">
                    <p>
                      <span className="text-zinc-300">Project Name</span>
                      <br />
                      {item.projectName ?? item.title}
                      <br />
                      <span className="text-zinc-300">Role:</span>{" "}
                      {item.role.join(" / ")}
                    </p>
                  </div>
                ) : null}

                <div
                  className={[
                    "col-start-2 grid max-w-[72rem] gap-10 md:grid-cols-2",
                    showItemDetails ? "mt-12" : "mt-8",
                  ].join(" ")}
                >
                  <p className="max-w-2xl text-[0.95rem] font-semibold leading-[1.45] text-zinc-500 md:col-span-2 md:text-[1.02rem]">
                    {item.description}
                  </p>

                  {item.media.map((mediaItem, mediaIndex) => (
                    <figure
                      key={`${mediaItem.src}-${mediaIndex}`}
                      className={
                        mediaItem.layout === "half"
                          ? "min-w-0"
                          : "min-w-0 md:col-span-2"
                      }
                    >
                      <ArchiveMediaFrame
                        type={mediaItem.type}
                        src={mediaItem.src}
                        poster={mediaItem.poster}
                        alt={`${item.title} preview ${mediaIndex + 1}`}
                      />
                      {mediaItem.description ? (
                        <figcaption className="mt-4 max-w-2xl text-[0.9rem] font-semibold leading-[1.45] text-zinc-500 md:text-[0.98rem]">
                          {mediaItem.description}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[1.1rem] font-semibold text-zinc-500">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
