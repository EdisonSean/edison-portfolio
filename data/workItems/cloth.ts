import type { WorkItem } from "@/data/workItems/types";

export const clothWorks: WorkItem[] = [
  {
    slug: "iqoo-pad-tearing-reveal",
    title: "Tearing Reveal",
    projectName: "iQOO Pad",
    client: "iQOO",
    year: 2025,
    categories: ["cloth"],
    media: [
      {
        type: "video",
        src: "/works/cloth/iqoo-pad-tearing-reveal/Tearing_logo.mp4",
      },
      {
        type: "video",
        src: "/works/cloth/iqoo-pad-tearing-reveal/Tearing_logo_v009_1.mp4",
        layout: "half",
      },
      {
        type: "video",
        src: "/works/cloth/iqoo-pad-tearing-reveal/Pad_Tearing_v021_1.mp4",
        layout: "half",
      },
    ],
    role: ["Tearing effect"],
    description:
      "A product reveal shot built around a tearing surface effect, using ripped material edges and controlled fracture motion to expose the iQOO Pad form and logo.",
    featured: true,
    featuredOrder: 1,
  },

  {
    slug: "redmi-woven-backplate-flow",
    title: "Woven Backplate Flow",
    projectName: "REDMI Phone",
    client: "REDMI / 红米",
    year: 2025,
    categories: ["cloth"],
    media: [
      {
        type: "video",
        src: "/works/cloth/redmi-woven-backplate-flow/REDMI-P16U  Director Cut_1_1.mp4",
      },
      {
        type: "video",
        src: "/works/cloth/redmi-woven-backplate-flow/s02_v020_1.mp4",
      },
      {
        type: "video",
        src: "/works/cloth/redmi-woven-backplate-flow/REDMI-P16U  Director Cut_1.mp4",
      },
    ],
    role: ["Procedural fiber motion", "Weave structure"],
    description:
      "A procedural fiber-weaving shot visualizing the material structure of a REDMI phone backplate.",
    featured: true,
    featuredOrder: 2,
  },

  {
    slug: "xiaomi-carbon-fiber-backplate",
    title: "Carbon Fiber Backplate",
    projectName: "Xiaomi Carbon Fiber Backplate Film",
    client: "Xiaomi / 小米",
    year: 2024,
    categories: ["cloth"],
    media: [
      {
        type: "video",
        src: "/works/cloth/xiaomi-carbon-fiber-backplate/shot04_v05.mp4",
      },
      {
        type: "video",
        src: "/works/cloth/xiaomi-carbon-fiber-backplate/shot05_v04.mp4",
      },
      {
        type: "video",
        src: "/works/cloth/xiaomi-carbon-fiber-backplate/shot04_KinttingFromCenter_v004_1.mp4",
        layout: "half",
      },
      {
        type: "video",
        src: "/works/cloth/xiaomi-carbon-fiber-backplate/Shot03_v02.mp4",
        layout: "half",
      },
    ],
    role: [
      "Procedural fiber motion",
      "Material visualization",
      "Look development",
    ],
    description:
      "A procedural material shot visualizing carbon-fiber strands flowing, crossing, and settling into a woven phone backplate structure.",
    featured: false,
  },

  {
    slug: "bananain-cooling-quilt-weave",
    title: "Cooling Weave Structure",
    projectName: "Bananain Summer Cooling Quilt",
    client: "Bananain / 蕉内",
    year: 2025,
    categories: ["cloth"],
    media: [
      {
        type: "video",
        src: "/works/cloth/bananain-cooling-quilt-weave/亚朵夏凉被_shot10_v1_1.mp4",
        description:
          "Macro weaving motion for the summer cooling quilt fabric.",
      },
      {
        type: "video",
        src: "/works/cloth/bananain-cooling-quilt-weave/breakdown_knitting_v001_1.mp4",
        layout: "half",
        description: "01 - falloff spreading",
      },
      {
        type: "video",
        src: "/works/cloth/bananain-cooling-quilt-weave/breakdown_knitting_v003_1.mp4",
        layout: "half",
        description: "02 - fiber generation",
      },
      {
        type: "video",
        src: "/works/cloth/bananain-cooling-quilt-weave/breakdown_knitting_v004_1.mp4",
        layout: "half",
        description: "03 - boundary weave detail",
      },
      {
        type: "video",
        src: "/works/cloth/bananain-cooling-quilt-weave/breakdown_knitting_v005_1.mp4",
        layout: "half",
        description: "04 - final structure",
      },
    ],
    role: [
      "Procedural fiber setup",
      "Weaving structure",
      "Cloth look development",
    ],
    description:
      "A macro fabric structure shot for the Bananain summer cooling quilt, built around procedural fibers, woven surface detail, and a cool breathable textile feel.",
    featured: true,
    featuredOrder: 3,
  },

  {
    slug: "bananain-sunshield-fabric-flight",
    title: "Sunshield Fabric Flight",
    projectName: "Bananain Sun-Protective Jacket",
    client: "Bananain / 蕉内",
    year: 2026,
    categories: ["cloth"],
    media: [
      {
        type: "video",
        src: "/works/cloth/bananain-sunshield-fabric-flight/sleeve_flying_test_v009.mp4",
        description: "Cloth motion test for the sun-protective jacket sleeve.",
      },
      {
        type: "video",
        src: "/works/cloth/bananain-sunshield-fabric-flight/final_comp.mp4",
        layout: "half",
      },
      {
        type: "video",
        src: "/works/cloth/bananain-sunshield-fabric-flight/final.mp4",
        layout: "half",
      },
    ],
    role: ["Cloth simulation"],
    description:
      "A floating garment motion piece built around lightweight fabric, airflow-driven folds, and controlled sleeve silhouettes.",
    featured: false,
  },
];
