#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const args = process.argv.slice(2);
const command = args[0] || "add";

if (command === "--help" || command === "-h" || command === "help") {
  printHelp();
  process.exit(0);
}

if (command !== "add") {
  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

const globalInstall = args.includes("--global");
const explicitTargetArgIndex = args.findIndex((arg) => arg === "--target");
let explicitTarget = null;
if (explicitTargetArgIndex >= 0) {
  explicitTarget = args[explicitTargetArgIndex + 1];
  if (!explicitTarget) {
    console.error("Missing value for --target");
    process.exit(1);
  }
}

const packageRoot = path.resolve(__dirname, "..");
const sourceSkillsDir = path.join(packageRoot, "skills");

if (!fs.existsSync(sourceSkillsDir)) {
  console.error(`Skills source directory not found: ${sourceSkillsDir}`);
  process.exit(1);
}

const targetDir = resolveTarget({
  globalInstall,
  explicitTarget
});

ensureDirectory(targetDir);

const skillFolders = fs
  .readdirSync(sourceSkillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (skillFolders.length === 0) {
  console.warn("No skills were found to install.");
  process.exit(0);
}

for (const skillName of skillFolders) {
  const sourcePath = path.join(sourceSkillsDir, skillName);
  const destinationPath = path.join(targetDir, skillName);
  fs.cpSync(sourcePath, destinationPath, { recursive: true, force: true });
}

console.log(`Installed ${skillFolders.length} Growth Nirvana skill(s) to:`);
console.log(`  ${targetDir}`);
console.log("");
console.log("Installed skills:");
for (const skillName of skillFolders) {
  console.log(`- ${skillName}`);
}
console.log("");
console.log("Next step: restart or reload Cursor.");

function resolveTarget({ globalInstall, explicitTarget }) {
  if (explicitTarget) {
    return path.resolve(process.cwd(), explicitTarget);
  }

  if (globalInstall) {
    return path.join(os.homedir(), ".cursor", "skills");
  }

  return path.join(process.cwd(), ".cursor", "skills");
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function printHelp() {
  console.log("Growth Nirvana Skills Installer");
  console.log("");
  console.log("Usage:");
  console.log("  gn-skills add [--global] [--target <path>]");
  console.log("");
  console.log("Options:");
  console.log("  --global         Install to ~/.cursor/skills");
  console.log("  --target <path>  Install to a custom path");
}
