import type { LabItem } from "@/data/labItems/types";

export const recentLabs: LabItem[] = [
  {
    slug: "output-opencall-poster",
    title: "OUTPUT OPENCALL Poster",
    year: 2022,
    categories: ["recent"],
    media: [
      {
        type: "video",
        src: "/lab/recent/output-opencall-poster/opencall_mainvision_shot_v02.mp4",
      },
    ],
    role: ["Visual exploration"],
    description: "A poster exploration for OUTPUT OPENCALL.",
  },
  {
    slug: "metal-liquid-flow-study",
    title: "Metal Liquid Flow Study",
    year: 2024,
    categories: ["recent"],
    media: [
      {
        type: "video",
        src: "/lab/recent/metal-liquid-flow-study/metal_shaping_v009_1.mp4",
      },
      {
        type: "video",
        src: "/lab/recent/metal-liquid-flow-study/metal_shaping_v010_1.mp4",
      },
    ],
    role: ["Material exploration"],
    description:
      "A liquid metal motion study exploring fluid shaping, reflective surfaces, and soft metallic deformation.",
  },

];
