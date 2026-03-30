#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const args = process.argv.slice(2);
const command = args[0] || "add";
const packageRoot = path.resolve(__dirname, "..");
const DEFAULT_MCP_SERVER_PACKAGE = "@growthnirvana/mcp-server";
const MCP_SERVER_PACKAGE_PLACEHOLDER = "__MCP_SERVER_PACKAGE__";

if (command === "--help" || command === "-h" || command === "help") {
  printHelp();
  process.exit(0);
}

if (command === "add") {
  handleAddCommand(args.slice(1));
  process.exit(0);
}

if (command === "init-mcp") {
  handleInitMcpCommand(args.slice(1));
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
printHelp();
process.exit(1);

function handleAddCommand(commandArgs) {
  const globalInstall = commandArgs.includes("--global");
  const explicitTarget = getOptionValue(commandArgs, "--target");
  const sourceSkillsDir = path.join(packageRoot, "skills");

  if (!fs.existsSync(sourceSkillsDir)) {
    console.error(`Skills source directory not found: ${sourceSkillsDir}`);
    process.exit(1);
  }

  const targetDir = resolveSkillsTarget({
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
    return;
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
}

function handleInitMcpCommand(commandArgs) {
  const targetFile = resolveMcpTargetFile(getOptionValue(commandArgs, "--target"));
  const force = commandArgs.includes("--force");
  const pinnedVersion = getOptionValue(commandArgs, "--pin-server-version");
  const templatePath = path.join(packageRoot, "templates", "mcp.json");

  if (!fs.existsSync(templatePath)) {
    console.error(`MCP template not found: ${templatePath}`);
    process.exit(1);
  }

  if (fs.existsSync(targetFile) && !force) {
    console.error(`Target file already exists: ${targetFile}`);
    console.error("Use --force to overwrite.");
    process.exit(1);
  }

  ensureDirectory(path.dirname(targetFile));
  const templateJson = readJsonFile(templatePath);
  const serverPackage = pinnedVersion
    ? `${DEFAULT_MCP_SERVER_PACKAGE}@${pinnedVersion}`
    : DEFAULT_MCP_SERVER_PACKAGE;
  const mcpJson = replaceTemplateToken(
    templateJson,
    MCP_SERVER_PACKAGE_PLACEHOLDER,
    serverPackage
  );
  fs.writeFileSync(targetFile, `${JSON.stringify(mcpJson, null, 2)}\n`, "utf8");

  console.log(`Created MCP config at:`);
  console.log(`  ${targetFile}`);
  console.log("");
  console.log("Next steps:");
  console.log("1) Set GROWTH_NIRVANA_API_KEY in your shell environment.");
  console.log("2) Reload Cursor so MCP config is re-read.");
}

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to parse JSON file: ${filePath}`);
    console.error(error.message);
    process.exit(1);
  }
}

function replaceTemplateToken(value, token, replacement) {
  if (typeof value === "string") {
    return value.split(token).join(replacement);
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceTemplateToken(item, token, replacement));
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      next[key] = replaceTemplateToken(nestedValue, token, replacement);
    }
    return next;
  }

  return value;
}

function resolveSkillsTarget({ globalInstall, explicitTarget }) {
  if (explicitTarget) {
    return path.resolve(process.cwd(), explicitTarget);
  }

  if (globalInstall) {
    return path.join(os.homedir(), ".cursor", "skills");
  }

  return path.join(process.cwd(), ".cursor", "skills");
}

function resolveMcpTargetFile(explicitTarget) {
  if (explicitTarget) {
    return path.resolve(process.cwd(), explicitTarget);
  }

  return path.join(process.cwd(), "mcp.json");
}

function getOptionValue(commandArgs, flag) {
  const optionIndex = commandArgs.findIndex((arg) => arg === flag);
  if (optionIndex < 0) {
    return null;
  }

  const optionValue = commandArgs[optionIndex + 1];
  if (!optionValue) {
    console.error(`Missing value for ${flag}`);
    process.exit(1);
  }

  return optionValue;
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function printHelp() {
  console.log("Growth Nirvana Skills Installer");
  console.log("");
  console.log("Usage:");
  console.log("  gn-skills add [--global] [--target <path>]");
  console.log("  gn-skills init-mcp [--target <path>] [--force] [--pin-server-version <version>]");
  console.log("");
  console.log("Options:");
  console.log("  --global         (add) install to ~/.cursor/skills");
  console.log("  --target <path>  Install to a custom path");
  console.log("  --force          (init-mcp) overwrite existing target file");
  console.log("  --pin-server-version <version>  (init-mcp) pin @growthnirvana/mcp-server");
}
