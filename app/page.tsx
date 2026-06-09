import InteractiveShowcaseObject from "@/components/home/InteractiveShowcaseObject";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col overflow-hidden bg-[#050505] px-5 py-5 text-white sm:px-8 sm:py-7 lg:px-10 lg:py-9">
      <Header />
      <InteractiveShowcaseObject />
    </main>
  );
}
