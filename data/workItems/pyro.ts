import type { WorkItem } from "@/data/workItems/types";

export const pyroWorks: WorkItem[] = [
    {
    slug: "xiaomi-14pro-titanium-impact",
    title: "Titanium Meteorite Impact and Fragmentation",
    projectName: "Xiaomi 14 Pro Titanium Edition Commercial Film",
    client: "Xiaomi",
    year: 2023,
    categories: ["rbd"],
    media: [
        {
            type: "video",
            src: "/works/rbd/xiaomi-14pro-titanium-impact/Xiaomi14pro_V1-0001.mp4",
        },
        {
            type: "video",
            src: "/works/rbd/xiaomi-14pro-titanium-impact/Xiaomi14pro_V1-0004.mp4",
        },
        {
            type: "video",
            src: "/works/rbd/xiaomi-14pro-titanium-impact/Xiaomi14pro_V1-0005.mp4",
        },
    ],
    role: ["Rigid", "Smoke", "Particle simulation"],
    description:
    "Showcasing the device's extreme durability through a dynamic collision sequence, utilizing precise rigid body fracturing and procedural dust simulations.",
    featured: true,
    featuredOrder: 1,
    },

    {
    slug: "realme-p3pro-soul-infusion",
    title: "Ethereal Energy Infusion",
    projectName: "realme P3 Pro Commercial Film",
    client: "realme",
    year: 2024,
    categories: ["pyro"],
    media: [
        {
            type: "video",
            src: "/works/pyro/realme-p3pro-soul-infusion/shot01_v2_1.mp4",
        },
        {
            type: "video",
            src: "/works/pyro/realme-p3pro-soul-infusion/shot02_1.mp4",
        },
    ],
    role: ["simulation", "Look development"],
    description:
    "A custom pyro simulation illustrating ethereal energy infusion, seamlessly blending luminescent, organic fluid dynamics with the phone's sleek silhouette.",
    featured: true,
    featuredOrder: 3,
    },

    {
    slug: "adidas-ethereal-fluid-flow",
    title: "Ethereal Fluid Envelopment",
    projectName: "Adidas Concept Film",
    client: "Adidas",
    year: 2025,
    categories: ["pyro"],
    media: [
        {
            type: "video",
            src: "/works/pyro/adidas-ethereal-fluid-flow/shot08_v010.mp4",
            description: "Dynamic fluid and smoke simulation elegantly wrapping around the dark silhouette of a futuristic sneaker.",
        },
    ],
    role: ["Fluid simulation", "Pyro dynamics", "Look development", "Lighting"],
    description:
    "Ethereal, fluid-driven smoke simulations delicately wrap around the sneaker to emphasize its aerodynamic form and complex sole geometry.",
    featured: false,
    }
];
