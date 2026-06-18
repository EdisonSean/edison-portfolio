import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const videoExtensions = new Set([".mp4", ".m4v", ".mov", ".webm"]);
const outputFolderName = "web";

function isVideoFile(filePath) {
  return videoExtensions.has(path.extname(filePath).toLowerCase());
}

function shouldSkipDirectory(directoryPath) {
  const name = path.basename(directoryPath).toLowerCase();
  return name === outputFolderName || name === "node_modules" || name === ".git";
}

async function collectVideos(inputPath) {
  const resolvedPath = path.resolve(inputPath);
  const stat = await fs.stat(resolvedPath);

  if (stat.isFile()) {
    return isVideoFile(resolvedPath) ? [resolvedPath] : [];
  }

  if (!stat.isDirectory() || shouldSkipDirectory(resolvedPath)) {
    return [];
  }

  const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
  const videos = [];

  for (const entry of entries) {
    const entryPath = path.join(resolvedPath, entry.name);

    if (entry.isDirectory()) {
      videos.push(...(await collectVideos(entryPath)));
    } else if (entry.isFile() && isVideoFile(entryPath)) {
      videos.push(entryPath);
    }
  }

  return videos;
}

function getOutputPath(inputPath) {
  const parsedPath = path.parse(inputPath);
  return path.join(parsedPath.dir, outputFolderName, `${parsedPath.name}.mp4`);
}

function runFfmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-hide_banner",
      "-y",
      "-i",
      inputPath,
      "-map",
      "0:v:0",
      "-an",
      "-vf",
      "scale='if(gte(iw,ih),min(iw,1920),-2)':'if(gte(iw,ih),-2,min(ih,1920))'",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-profile:v",
      "high",
      "-level:v",
      "4.1",
      "-pix_fmt",
      "yuv420p",
      "-b:v",
      "4M",
      "-maxrate",
      "5M",
      "-bufsize",
      "8M",
      "-movflags",
      "+faststart",
      outputPath,
    ];
    const child = spawn("ffmpeg", args, {
      stdio: ["ignore", "inherit", "inherit"],
      windowsHide: false,
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

const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.log("Drag video files or folders onto encode-video-preview.bat.");
  console.log("Output goes into a web folder next to each source file.");
  process.exit(1);
}

const videos = [
  ...new Set(
    (
      await Promise.all(
        inputs.map(async (input) => {
          try {
            return await collectVideos(input);
          } catch (error) {
            console.warn(
              `Skipping ${input}: ${error instanceof Error ? error.message : String(error)}`,
            );
            return [];
          }
        }),
      )
    ).flat(),
  ),
].sort((a, b) => a.localeCompare(b));

if (videos.length === 0) {
  console.log("No supported video files found.");
  process.exit(1);
}

console.log(`Found ${videos.length} video file(s).`);

let completed = 0;
const failures = [];

for (const videoPath of videos) {
  const outputPath = getOutputPath(videoPath);
  completed += 1;

  console.log("");
  console.log(`[${completed}/${videos.length}] ${videoPath}`);
  console.log(`Output: ${outputPath}`);

  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await runFfmpeg(videoPath, outputPath);
  } catch (error) {
    failures.push({
      videoPath,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

console.log("");

if (failures.length > 0) {
  console.error(`Finished with ${failures.length} failure(s):`);

  for (const failure of failures) {
    console.error(`- ${failure.videoPath}: ${failure.message}`);
  }

  process.exit(1);
}

console.log("All videos encoded successfully.");
