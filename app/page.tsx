import FeaturedWorkVideoBackground from "@/components/home/FeaturedWorkVideoBackground";
import FeaturedWorkVideoPreloader from "@/components/home/FeaturedWorkVideoPreloader";
import HomeIntroHeader from "@/components/home/HomeIntroHeader";
import HomeIntroShowcaseObject from "@/components/home/HomeIntroShowcaseObject";
import HomePointerParallax from "@/components/home/HomePointerParallax";
import { labs } from "@/data/labs";
import { getWorksByCategory } from "@/data/works";

function getFeaturedVideoSources() {
  return Array.from(
    new Set(
      getWorksByCategory("featured")
        .map((work) => work.media.find((media) => media.type === "video")?.src)
        .filter((src): src is string => Boolean(src)),
    ),
  );
}

function getFirstRecentLabVideoSource() {
  const recentLab = labs.find((lab) => lab.categories.includes("recent"));

  return recentLab?.media.find((media) => media.type === "video")?.src ?? null;
}

export default function Home() {
  const featuredVideoSources = getFeaturedVideoSources();
  const preloadVideoSources = [
    ...featuredVideoSources.slice(0, 3),
    getFirstRecentLabVideoSource(),
  ].filter((src): src is string => Boolean(src));

  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#050505] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <FeaturedWorkVideoBackground sources={featuredVideoSources} />
      <FeaturedWorkVideoPreloader sources={preloadVideoSources} />
      <HomePointerParallax />
      <HomeIntroHeader />
      <HomeIntroShowcaseObject />
    </main>
  );
}
