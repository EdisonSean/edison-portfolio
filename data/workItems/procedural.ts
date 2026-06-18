import type { WorkItem } from "@/data/workItems/types";

export const proceduralWorks: WorkItem[] = [
    {
        slug: "adidas-climacool-lace-threading",
        title: "Lace Threading System",
        projectName: "adidas CLIMACOOL — Born to Breathe",
        client: "adidas / 阿迪达斯",
        year: 2026,
        categories: ["procedural"],
        media: [
            {
            type: "video",
            src: "/works/procedural/adidas-climacool-lace-threading/web/s19_v1.1_flipbook_v003_1.mp4",
            description:
                "Viewport flipbook showing the lace path animation and shoe structure.",
            },
            {
            type: "video",
            src: "/works/procedural/adidas-climacool-lace-threading/web/s19_1.mp4",
            description:
                "Final shot of the shoelace threading through the CLIMACOOL upper structure.",
            },
        ],
        role: ["Procedural lace animation"],
        description:
        "A product motion shot for adidas CLIMACOOL, built around shoelaces threading through the shoe structure to emphasize breathability, tension, and engineered form.",
        featured: true,
        featuredOrder: 4,
    },

    {
        slug: "procedural-flower-bloom-system",
        title: "Flower Bloom System",
        projectName: "Selected Commercial Bloom Shots",
        client: "Various Clients",
        year: 2024,
        categories: ["procedural"],
        media: [
            {
                type: "video",
                src: "/works/procedural/procedural-flower-bloom-system/s05_v027.mp4",
                layout: "half",
            },
            {
                type: "video",
                src: "/works/procedural/procedural-flower-bloom-system/shot05_v007.mp4",
                layout: "half",
            },
            {
                type: "video",
                src: "/works/procedural/procedural-flower-bloom-system/web/shot06_v004.mp4",
                layout: "half",
            },
            {
                type: "video",
                src: "/works/procedural/procedural-flower-bloom-system/droplet.mp4",
                layout: "half",
            },
        ],
        role: ["Procedural animation"],
        description:
        "A procedural blooming system built around layered petal unfolding, organic growth timing, and sculptural flower silhouettes for commercial visual sequences.",
        featured: false,
    },

    {
    slug: "realme-gt-energy-dynamics",
    title: "Energy Splines and Glitch Dynamics",
    projectName: "realme GT Commercial Film",
    client: "realme",
    year: 2024,
    categories: ["procedural"],
    media: [
        {
            type: "video",
            src: "/works/procedural/realme-gt-energy-dynamics/shot04_v008_1.mp4",
        },
        {
            type: "video",
            src: "/works/procedural/realme-gt-energy-dynamics/shot11_nor_1.mp4",
            layout: "half",
        },
        {
            type: "video",
            src: "/works/procedural/realme-gt-energy-dynamics/shot11_all_red.mp4",
            layout: "half",
        },
    ],
    role: ["Spline simulation", "Motion graphics", "Compositing"],
    description:
    "Dynamic vector-driven spline simulations converging into the 'GT' logo, paired with high-energy, kaleidoscopic glitch effects to visualize the device's extreme speed and performance.",
    featured: false,
    }
];
