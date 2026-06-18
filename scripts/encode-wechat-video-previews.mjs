import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, "data");
const publicDir = path.join(projectRoot, "public");
const outputFolderName = "wechat";
const videoSourcePattern =
  /src:\s*["']([^"']+\.(?:mp4|m4v|mov|webm))["']/gi;

async function walkDataFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkDataFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(entryPath);
    }
  }

  return files;
}

async function collectVideoSources() {
  const files = await walkDataFiles(dataDir);
  const sources = new Set();

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    let match = videoSourcePattern.exec(content);

    while (match) {
      if (match[1].startsWith("/") && !match[1].includes("/wechat/")) {
        sources.add(match[1]);
      }

      match = videoSourcePattern.exec(content);
    }

    videoSourcePattern.lastIndex = 0;
  }

  return [...sources].sort((a, b) => a.localeCompare(b));
}

function getInputPath(source) {
  return path.join(publicDir, source.slice(1));
}

function getOutputPath(inputPath) {
  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, outputFolderName, `${parsedPath.name}.mp4`);
}

function encodeVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-nostdin",
      "-y",
      "-i",
      inputPath,
      "-map",
      "0:v:0",
      "-an",
      "-vf",
      "scale='if(gte(iw,ih),min(iw,1280),-2)':'if(gte(iw,ih),-2,min(ih,1280))'",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-profile:v",
      "high",
      "-level:v",
      "4.0",
      "-pix_fmt",
      "yuv420p",
      "-b:v",
      "2200k",
      "-maxrate",
      "2800k",
      "-bufsize",
      "4400k",
      "-movflags",
      "+faststart",
      outputPath,
    ];
    const child = spawn("ffmpeg", args, {
      stdio: ["ignore", "inherit", "inherit"],
      windowsHide: true,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function needsEncoding(inputPath, outputPath) {
  try {
    const [inputStat, outputStat] = await Promise.all([
      fs.stat(inputPath),
      fs.stat(outputPath),
    ]);

    return outputStat.size === 0 || outputStat.mtimeMs < inputStat.mtimeMs;
  } catch {
    return true;
  }
}

const sources = await collectVideoSources();
const failures = [];
let encodedCount = 0;
let skippedCount = 0;

console.log(`Encoding ${sources.length} WeChat video preview(s).`);

for (const [index, source] of sources.entries()) {
  const inputPath = getInputPath(source);
  const outputPath = getOutputPath(inputPath);

  try {
    await fs.access(inputPath);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    if (!(await needsEncoding(inputPath, outputPath))) {
      skippedCount += 1;
      continue;
    }

    console.log(`[${index + 1}/${sources.length}] ${source}`);
    await encodeVideo(inputPath, outputPath);
    encodedCount += 1;
  } catch (error) {
    failures.push(
      `${source}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

if (failures.length > 0) {
  console.error("\nFailed to encode:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `WeChat video previews ready: ${encodedCount} encoded, ${skippedCount} unchanged.`,
);
