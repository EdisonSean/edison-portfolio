import type { LabItem } from "@/data/labItems/types";

export const vibeCodingLabs: LabItem[] = [
  {
    slug: "example-lab-study",
    title: "Example Lab Study",
    year: 2026,
    categories: ["vibecoding"],
    media: [
      {
        type: "image",
        src: "/assets/logo/LOGO_white_alpha.png",
        description: "Optional description for this image or video.",
      },
    ],
    role: ["Vibe coding note"],
    description: "One short sentence about what this experiment is testing.",
  },
];
