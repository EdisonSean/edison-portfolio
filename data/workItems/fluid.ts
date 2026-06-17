import type { WorkItem } from "@/data/workItems/types";

export const fluidWorks: WorkItem[] = [
  {
  slug: "xiaomi-viscous-release",
  title: "Viscous Release",
  projectName: "Xiaomi Phone Product Film",
  client: "Xiaomi / 小米",
  year: 2022,
  categories: ["fluid"],
  media: [
  {
  type: "video",
  src: "/works/fluid/xiaomi-viscous-release/xiaomiM3_Director cut_x264.mp4",
  description: "Final shot of the phone breaking free from a viscous liquid mass.",
  },
  {
  type: "video",
  src: "/works/fluid/xiaomi-viscous-release/Xiaomi_Viscose_v005.mp4",
  description: "Simulation preview showing the stretching and tearing behavior of the sticky fluid.",
  },
  ],
  role: ["Fluid simulation"],
  description:
  "A viscous fluid shot built around the phone breaking free from a sticky liquid mass, balancing elastic stretching, surface adhesion, and art-directed silhouettes for a dramatic product reveal.",
  featured: true,
  featuredOrder: 1,
  },
  {
  slug: "vivo-surface-tension-flow",
  title: "Surface Tension Flow",
  projectName: "vivo Phone Product Film",
  client: "vivo / VIVO",
  year: 2025,
  categories: ["fluid"],
  media: [
    {
      type: "video",
      src: "/works/fluid/vivo-surface-tension-flow/shot03_preview.mp4",
      description: "Final water-surface animation on the phone body.",
    },
    {
      type: "video",
      src: "/works/fluid/vivo-surface-tension-flow/s03_v024_1.mp4",
      layout: "half",
      description: "Custom surface tension solver",
    },
    {
      type: "video",
      src: "/works/fluid/vivo-surface-tension-flow/s03_v022_1.mp4",
      layout: "half",
      description: "Mesh",
    },
    {
      type: "video",
      src: "/works/fluid/vivo-surface-tension-flow/s03_v023_1.mp4",
      layout: "half",
      description: "Particles",
    },
    {
      type: "video",
      src: "/works/fluid/vivo-surface-tension-flow/s03_ripple_1.mp4",
      layout: "half",
      description: "ripple",
    },
    {
      type: "video",
      src: "/works/fluid/vivo-surface-tension-flow/shot02_preview.mp4",
      description: "Final water-surface animation on the phone body.",
    },
  ],
  role: ["Fluid simulation"],
  description:
    "A fluid shot for a vivo phone film, focused on keeping water droplets stable on the product surface while balancing controlled local tension, believable flow behavior, and client-specific water shapes.",
  featured: true,
  featuredOrder: 3,
  },

  {
    slug: "beatbot-aquasense-2-pro-aqua-flow",
    title: "Aqua Flow System",
    projectName: "AquaSense 2 Pro Product Film",
    client: "Beatbot",
    year: 2024,
    categories: ["fluid"],
    media: [
      {
        type: "video",
        src: "/works/fluid/beatbot-aquasense-2-pro-aqua-flow/shot08.mp4",
        description: "Fluid animation showing dirty water being pulled into the robot intake system.",
      },
      {
        type: "video",
        src: "/works/fluid/beatbot-aquasense-2-pro-aqua-flow/shot08_v001_1.mp4",
      },
      {
        type: "video",
        src: "/works/fluid/beatbot-aquasense-2-pro-aqua-flow/shot14_v001_1.mp4",
        layout: "half",
      },
      {
        type: "video",
        src: "/works/fluid/beatbot-aquasense-2-pro-aqua-flow/shot14_v003_1.mp4",
        layout: "half",
      },

    ],
    role: [
      "Fluid simulation",
    ],
    description:
      "A product FX sequence for Beatbot AquaSense 2 Pro, built around water suction and output motion to visualize the robot's cleaning performance and fluid interaction.",
    featured: false,
    featuredOrder: 2,
  },
  {
  slug: "vivo-fluid-lift-reveal",
  title: "Fluid Lift Reveal",
  projectName: "vivo Phone Product Film",
  client: "vivo / VIVO",
  year: 2024,
  categories: ["fluid"],
  media: [
  {
  type: "video",
  src: "/works/fluid/vivo-fluid-lift-reveal/web/fluid_phone_01_v006.mp4",
  description: "Fluid mass lifting and wrapping around the phone body.",
  },
  ],
  role: ["Fluid simulation"],
  description:
  "A product fluid shot built around a soft liquid mass lifting and wrapping the phone, balancing weight, contact, and art-directed fluid shapes for a controlled product reveal.",
  featured: false,
  featuredOrder: 4,
  },
  {
  slug: "cosmetic-lotion-creep-flow",
  title: "Lotion Creep Flow",
  projectName: "Cosmetic Lotion Product Film",
  client: "Confidential / Cosmetic Brand",
  year: 2024,
  categories: ["fluid"],
  media: [
  {
  type: "video",
  src: "/works/fluid/cosmetic-lotion-creep-flow/shot_fluid_01_v005.m4v",
  },
  ],
  role: ["Fluid simulation"],
  description:
  "A cosmetic fluid shot built around viscous lotion creeping upward, balancing surface adhesion, elastic stretching, and soft product-driven motion.",
  featured: false,
  },

];
