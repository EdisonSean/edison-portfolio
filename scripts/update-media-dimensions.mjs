import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, "data");
const publicDir = path.join(projectRoot, "public");
const outputPath = path.join(dataDir, "mediaDimensions.ts");
const mediaSourcePattern =
  /src:\s*["']([^"']+\.(?:mp4|m4v|mov|webm|webp|png|jpe?g|avif|gif))["']/gi;

async function walkFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }

  return files;
}

async function collectMediaSources() {
  const files = await walkFiles(dataDir);
  const sources = new Set();

  for (const file of files) {
    if (path.resolve(file) === path.resolve(outputPath)) {
      continue;
    }

    const content = await fs.readFile(file, "utf8");
    let match = mediaSourcePattern.exec(content);

    while (match) {
      const source = match[1];

      if (source.startsWith("/")) {
        sources.add(source);
      }

      match = mediaSourcePattern.exec(content);
    }

    mediaSourcePattern.lastIndex = 0;
  }

  return [...sources].sort((a, b) => a.localeCompare(b));
}

async function probeDimensions(source) {
  const filePath = path.join(publicDir, source.slice(1));

  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Missing file: ${source}`);
  }

  const { stdout } = await execFileAsync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-of",
    "json",
    filePath,
  ]);
  const result = JSON.parse(stdout);
  const stream = result.streams?.[0];
  const width = Number(stream?.width);
  const height = Number(stream?.height);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(`Could not read dimensions: ${source}`);
  }

  return { width, height };
}

function createOutput(dimensions) {
  const rows = Object.entries(dimensions)
    .map(
      ([source, size]) =>
        `  ${JSON.stringify(source)}: { width: ${size.width}, height: ${size.height} },`,
    )
    .join("\n");

  return `export type MediaDimensions = {
  width: number;
  height: number;
};

export const mediaDimensions: Record<string, MediaDimensions> = {
${rows}
};
`;
}

const sources = await collectMediaSources();
const dimensions = {};
const warnings = [];

for (const source of sources) {
  try {
    dimensions[source] = await probeDimensions(source);
  } catch (error) {
    warnings.push(error instanceof Error ? error.message : String(error));
  }
}

await fs.writeFile(outputPath, createOutput(dimensions), "utf8");

console.log(
  `Updated data/mediaDimensions.ts with ${Object.keys(dimensions).length} media entries.`,
);

if (warnings.length > 0) {
  console.warn("\nWarnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}
