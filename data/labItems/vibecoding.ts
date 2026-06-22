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
    githubUrl: "https://github.com/EdisonSean/edison-portfolio",
  },
  {
    slug: "instagram-to-eagle",
    title: "Instagram to Eagle",
    year: 2026,
    categories: ["vibecoding"],
    media: [
      {
        type: "image",
        src: "/lab/vibecoding/instagram-to-eagle/gui_overview1.webp",
      },
      {
        type: "image",
        src: "/lab/vibecoding/instagram-to-eagle/gui_overview2.webp",
      },
      {
        type: "image",
        src: "/lab/vibecoding/instagram-to-eagle/github_repo_overview.webp",
      },
      {
        type: "image",
        src: "/lab/vibecoding/instagram-to-eagle/workflow_diagram.webp",
      },
    ],
    role: ["Vibe coding"],
    description:
      "A Vibe Coding project built to streamline visual reference collection. The tool downloads Instagram posts into a local staging folder, reads metadata, and imports the assets into Eagle with source links, notes, tags, and duplicate-prevention logic.",
    githubUrl: "https://github.com/EdisonSean/Instagram-to-Eagle",
  },
];
