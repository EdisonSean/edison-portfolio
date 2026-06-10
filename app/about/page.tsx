import { readFile } from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";
import { parseResumeMarkdown } from "@/components/about/parseResumeMarkdown";

export const metadata: Metadata = {
  title: "About | EDISON",
  description: "About and resume page for EDISON.",
};

export const dynamic = "force-dynamic";

async function readResumeMarkdown() {
  const resumePath = path.join(process.cwd(), "docs", "resume.md");

  try {
    return await readFile(resumePath, "utf8");
  } catch {
    return "";
  }
}

export default async function AboutRoute() {
  const markdown = await readResumeMarkdown();
  const resume = parseResumeMarkdown(markdown);

  return <AboutPage resume={resume} />;
}
