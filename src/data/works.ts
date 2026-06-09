export type WorkCategory =
  | "featured"
  | "cloth"
  | "fluid"
  | "pyro"
  | "particles"
  | "procedural"
  | "rbd"
  | "product";

export type WorkItem = {
  slug: string;
  title: string;
  projectName: string;
  client: string;
  year: number;
  categories: WorkCategory[];
  coverImage: string;
  coverVideo: string | null;
  effectType: string;
  role: string[];
  tools: string[];
  tags: string[];
  description: string;
  featured: boolean;
  hasDetailPage: boolean;
};

export const defaultWorkCategory: WorkCategory = "featured";

export const workCategories: WorkCategory[] = [
  "featured",
  "cloth",
  "fluid",
  "pyro",
  "particles",
  "procedural",
  "rbd",
  "product",
];

export const works: WorkItem[] = [
  {
    slug: "aurora-runway-cloth",
    title: "Runway Fabric Bloom",
    projectName: "Aurora Runway Launch",
    client: "Aurora Atelier",
    year: 2026,
    categories: ["featured", "cloth"],
    coverImage: "/works/aurora-runway-launch/cover.jpg",
    coverVideo: "/works/aurora-runway-launch/cover.mp4",
    effectType: "Cloth simulation",
    role: ["FX direction", "cloth simulation", "look development"],
    tools: ["Houdini", "Redshift", "After Effects"],
    tags: ["fabric", "fashion", "hero film", "wind"],
    description:
      "Commercial launch visuals built around large-scale fabric motion, controlled folds, and soft studio lighting.",
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: "nimbus-sports-fluid",
    title: "Liquid Energy Burst",
    projectName: "Nimbus Active Hydrate",
    client: "Nimbus Sports",
    year: 2025,
    categories: ["featured", "fluid", "product"],
    coverImage: "/works/nimbus-active-hydrate/cover.jpg",
    coverVideo: "/works/nimbus-active-hydrate/cover.mp4",
    effectType: "Fluid simulation",
    role: ["FX design", "simulation", "product integration"],
    tools: ["Houdini", "Cinema 4D", "Redshift"],
    tags: ["liquid", "beverage", "macro", "splash"],
    description:
      "Product campaign shots using energetic fluid arcs and macro splashes around a hero bottle.",
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: "solace-phone-particles",
    title: "Signal Particle Field",
    projectName: "Solace X1 Reveal",
    client: "Solace Mobile",
    year: 2025,
    categories: ["featured", "particles", "product"],
    coverImage: "/works/solace-x1-reveal/cover.jpg",
    coverVideo: "/works/solace-x1-reveal/cover.mp4",
    effectType: "Particle system",
    role: ["particle animation", "technical art", "render setup"],
    tools: ["Houdini", "Karma", "Nuke"],
    tags: ["particles", "technology", "phone", "reveal"],
    description:
      "A commercial device reveal driven by fine particle trails, signal waves, and controlled assembly beats.",
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: "ember-fragrance-pyro",
    title: "Smoked Glass Aura",
    projectName: "Ember No. 7 Film",
    client: "Ember Fragrance",
    year: 2024,
    categories: ["featured", "pyro", "product"],
    coverImage: "/works/ember-no-7-film/cover.jpg",
    coverVideo: "/works/ember-no-7-film/cover.mp4",
    effectType: "Pyro simulation",
    role: ["pyro simulation", "art direction support", "compositing"],
    tools: ["Houdini", "Redshift", "Nuke"],
    tags: ["smoke", "fragrance", "glass", "luxury"],
    description:
      "Perfume campaign imagery shaped with layered smoke ribbons, warm internal glow, and glass caustic passes.",
    featured: true,
    hasDetailPage: true,
  },
  {
    slug: "vector-auto-rbd",
    title: "Road Shatter Reveal",
    projectName: "Vector E-SUV Launch",
    client: "Vector Motors",
    year: 2024,
    categories: ["rbd"],
    coverImage: "/works/vector-e-suv-launch/cover.jpg",
    coverVideo: null,
    effectType: "Rigid body dynamics",
    role: ["RBD setup", "destruction timing", "shot polish"],
    tools: ["Houdini", "Arnold", "Nuke"],
    tags: ["destruction", "automotive", "asphalt", "reveal"],
    description:
      "Automotive reveal sequence featuring asphalt fracture, debris control, and tire-proximate impact timing.",
    featured: false,
    hasDetailPage: false,
  },
  {
    slug: "luma-watch-procedural",
    title: "Procedural Time Lattice",
    projectName: "Luma Chrono Campaign",
    client: "Luma Wearables",
    year: 2024,
    categories: ["procedural", "product"],
    coverImage: "/works/luma-chrono-campaign/cover.jpg",
    coverVideo: null,
    effectType: "Procedural animation",
    role: ["procedural system design", "motion design", "rendering"],
    tools: ["Houdini", "Redshift", "After Effects"],
    tags: ["watch", "lattice", "procedural", "precision"],
    description:
      "Watch campaign visuals built from procedural lattice growth, rhythmic dial transitions, and product macro renders.",
    featured: false,
    hasDetailPage: false,
  },
  {
    slug: "kinetic-trainer-cloth",
    title: "Laced Fabric Drift",
    projectName: "Kinetic Runner Drop",
    client: "Kinetic Footwear",
    year: 2023,
    categories: ["cloth", "product"],
    coverImage: "/works/kinetic-runner-drop/cover.jpg",
    coverVideo: null,
    effectType: "Cloth and soft-body motion",
    role: ["cloth setup", "product animation", "shot lighting"],
    tools: ["Houdini", "Cinema 4D", "Octane"],
    tags: ["footwear", "fabric", "laces", "sportswear"],
    description:
      "Commercial footwear drop combining laces, mesh panels, and controlled soft-body fabric motion.",
    featured: false,
    hasDetailPage: false,
  },
  {
    slug: "atlas-bank-particles",
    title: "Data Dust Transition",
    projectName: "Atlas Pay Identity",
    client: "Atlas Bank",
    year: 2023,
    categories: ["particles", "procedural"],
    coverImage: "/works/atlas-pay-identity/cover.jpg",
    coverVideo: null,
    effectType: "Procedural particles",
    role: ["FX design", "particle system", "brand motion toolkit"],
    tools: ["Houdini", "Redshift", "After Effects"],
    tags: ["finance", "particles", "identity", "data"],
    description:
      "Brand identity motion package using procedural particle wipes and structured data-like transitions.",
    featured: false,
    hasDetailPage: false,
  },
  {
    slug: "verda-cleanser-fluid",
    title: "Gel Ribbon Macro",
    projectName: "Verda Skin Reset",
    client: "Verda Beauty",
    year: 2023,
    categories: ["fluid", "product"],
    coverImage: "/works/verda-skin-reset/cover.jpg",
    coverVideo: null,
    effectType: "Viscous fluid simulation",
    role: ["fluid simulation", "look development", "beauty compositing"],
    tools: ["Houdini", "Redshift", "Nuke"],
    tags: ["skincare", "gel", "macro", "beauty"],
    description:
      "Beauty product campaign featuring slow viscous ribbons, translucent gel surfaces, and clean macro framing.",
    featured: false,
    hasDetailPage: false,
  },
  {
    slug: "forge-headphones-pyro",
    title: "Heatwave Sonic Pulse",
    projectName: "Forge Audio Launch",
    client: "Forge Audio",
    year: 2022,
    categories: ["pyro", "particles", "product"],
    coverImage: "/works/forge-audio-launch/cover.jpg",
    coverVideo: null,
    effectType: "Pyro and particle FX",
    role: ["pyro setup", "particle accents", "final render"],
    tools: ["Houdini", "Arnold", "After Effects"],
    tags: ["audio", "heat", "smoke", "pulse"],
    description:
      "Headphone launch visuals with stylized heat pulses, smoke accents, and reactive particle highlights.",
    featured: false,
    hasDetailPage: false,
  },
];
