import type { Metadata } from "next";
import LabPage from "@/components/lab/LabPage";

export const metadata: Metadata = {
  title: "Lab",
  description: "Recent lab notes and vibe coding experiments.",
};

export default function Page() {
  return <LabPage />;
}
