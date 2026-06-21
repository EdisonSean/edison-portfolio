import type { LabItem } from "@/data/labItems/types";

export const vibeCodingLabs: LabItem[] = [
  {
    slug: "vibe-coded-portfolio-website",
    title: "Vibe-Coded Portfolio Website",
    year: 2026,
    categories: ["vibecoding"],
    media: [
      {
        type: "video",
        src: "/lab/vibecoding/vibe-coded-portfolio-website/portfolio_walkthrough.mp4",
      },
      {
        type: "image",
        src: "/lab/vibecoding/vibe-coded-portfolio-website/github_repo_overview.webp",
      },
      {
        type: "image",
        src: "/lab/vibecoding/vibe-coded-portfolio-website/vibecoding_process.webp",
      },
    ],
    role: ["Vibe coding"],
    description:
      "A self-directed portfolio website built through a Vibe Coding workflow, covering visual direction, archive structure, interactive homepage design, media optimization, GitHub versioning, and Vercel deployment.",
  },
];
