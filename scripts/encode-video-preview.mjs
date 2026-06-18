import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const videoExtensions = new Set([".mp4", ".m4v", ".mov", ".webm"]);
const skippedDirectoryNames = new Set([
  "wechat",
  "node_modules",
  ".git",
  ".next",
]);
let temporaryFileIndex = 0;

function isVideoFile(filePath) {
  const fileName = path.basename(filePath);

  return (
    videoExtensions.has(path.extname(filePath).toLowerCase()) &&
    !fileName.includes(".encoding-")
  );
}

function shouldSkipDirectory(directoryPath) {
  const name = path.basename(directoryPath).toLowerCase();
  return skippedDirectoryNames.has(name);
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
  return path.join(parsedPath.dir, `${parsedPath.name}.mp4`);
}

function getTemporaryPath(inputPath) {
  const parsedPath = path.parse(inputPath);
  temporaryFileIndex += 1;

  return path.join(
    parsedPath.dir,
    `.${parsedPath.name}.encoding-${process.pid}-${temporaryFileIndex}.mp4`,
  );
}

function pathsAreEqual(firstPath, secondPath) {
  const firstResolvedPath = path.resolve(firstPath);
  const secondResolvedPath = path.resolve(secondPath);

  return process.platform === "win32"
    ? firstResolvedPath.toLowerCase() === secondResolvedPath.toLowerCase()
    : firstResolvedPath === secondResolvedPath;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function replaceSourceVideo(inputPath, temporaryPath, outputPath) {
  const token = `${process.pid}-${Date.now()}`;
  const inputBackupPath = `${inputPath}.encode-backup-${token}`;
  const outputBackupPath = `${outputPath}.encode-backup-${token}`;
  const outputIsInput = pathsAreEqual(inputPath, outputPath);
  let inputWasMoved = false;
  let outputWasMoved = false;
  let outputWasInstalled = false;

  try {
    if (!outputIsInput && (await pathExists(outputPath))) {
      await fs.rename(outputPath, outputBackupPath);
      outputWasMoved = true;
    }

    await fs.rename(inputPath, inputBackupPath);
    inputWasMoved = true;
    await fs.rename(temporaryPath, outputPath);
    outputWasInstalled = true;
  } catch (error) {
    if (outputWasInstalled) {
      await fs.rm(outputPath, { force: true });
    }

    if (inputWasMoved && (await pathExists(inputBackupPath))) {
      await fs.rename(inputBackupPath, inputPath);
    }

    if (outputWasMoved && (await pathExists(outputBackupPath))) {
      await fs.rename(outputBackupPath, outputPath);
    }

    throw error;
  }

  const cleanupPaths = [
    temporaryPath,
    inputBackupPath,
    ...(outputWasMoved ? [outputBackupPath] : []),
  ];

  for (const cleanupPath of cleanupPaths) {
    try {
      await fs.rm(cleanupPath, { force: true });
    } catch (error) {
      console.warn(
        `Could not remove backup ${cleanupPath}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

function runFfmpeg(inputPath, outputPath) {
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
      "scale='if(gte(iw,ih),min(iw,1920),-2)':'if(gte(iw,ih),-2,min(ih,1920))':in_range=auto:out_range=tv,format=yuv420p",
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

const inputs = process.argv.slice(2);

if (inputs.length === 0) {
  console.log("Drag video files or folders onto encode-video-preview.bat.");
  console.log("Encoded MP4 files replace the source videos in place.");
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

const outputGroups = new Map();

for (const videoPath of videos) {
  const outputPath = getOutputPath(videoPath);
  const outputKey =
    process.platform === "win32" ? outputPath.toLowerCase() : outputPath;
  const group = outputGroups.get(outputKey) ?? [];

  group.push(videoPath);
  outputGroups.set(outputKey, group);
}

const outputConflicts = [...outputGroups.values()].filter(
  (group) => group.length > 1,
);

if (outputConflicts.length > 0) {
  console.error("Multiple source videos would replace the same MP4 file:");

  for (const group of outputConflicts) {
    console.error(`- ${group.join(", ")}`);
  }

  process.exit(1);
}

console.log(`Found ${videos.length} video file(s).`);

let completed = 0;
const failures = [];

for (const videoPath of videos) {
  const outputPath = getOutputPath(videoPath);
  const temporaryPath = getTemporaryPath(videoPath);
  completed += 1;

  console.log("");
  console.log(`[${completed}/${videos.length}] ${videoPath}`);
  console.log(`Replacing with: ${outputPath}`);

  try {
    await runFfmpeg(videoPath, temporaryPath);

    const encodedStat = await fs.stat(temporaryPath);

    if (encodedStat.size === 0) {
      throw new Error("Encoded output is empty.");
    }

    await replaceSourceVideo(videoPath, temporaryPath, outputPath);
  } catch (error) {
    await fs.rm(temporaryPath, { force: true });
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

console.log("All videos encoded and replaced successfully.");
