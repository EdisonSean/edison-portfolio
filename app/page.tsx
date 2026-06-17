import FeaturedWorkVideoPreloader from "@/components/home/FeaturedWorkVideoPreloader";
import InteractiveShowcaseObject from "@/components/home/InteractiveShowcaseObject";
import Header from "@/components/layout/Header";
import { labs } from "@/data/labs";
import { getWorksByCategory } from "@/data/works";

function getFeaturedPreviewVideoSources() {
  return getWorksByCategory("featured")
    .slice(0, 3)
    .map((work) => work.media.find((media) => media.type === "video")?.src)
    .filter((src): src is string => Boolean(src));
}

function getFirstRecentLabVideoSource() {
  const recentLab = labs.find((lab) => lab.categories.includes("recent"));

  return recentLab?.media.find((media) => media.type === "video")?.src ?? null;
}

export default function Home() {
  const preloadVideoSources = [
    ...getFeaturedPreviewVideoSources(),
    getFirstRecentLabVideoSource(),
  ].filter((src): src is string => Boolean(src));

  return (
    <main className="flex min-h-svh flex-col overflow-hidden bg-[#050505] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <FeaturedWorkVideoPreloader sources={preloadVideoSources} />
      <Header />
      <InteractiveShowcaseObject />
    </main>
  );
}
