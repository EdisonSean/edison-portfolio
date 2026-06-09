import type { Metadata } from "next";
import WorkPage from "@/components/work/WorkPage";

export const metadata: Metadata = {
  title: "Work",
  description: "Commercial works categorized by FX discipline.",
};

export default function Page() {
  return <WorkPage />;
}
