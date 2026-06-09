import type { Metadata } from "next";
import LabPage from "@/components/lab/LabPage";

export const metadata: Metadata = {
  title: "Lab",
  description: "Non-commercial experiments, R&D, tests, and practice.",
};

export default function Page() {
  return <LabPage />;
}
