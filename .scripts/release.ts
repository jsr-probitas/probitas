#!/usr/bin/env -S deno run -A
/**
 * Prepare a release by updating version and dependencies
 *
 * Usage:
 *   deno task release <version>
 *
 * Examples:
 *   deno task release v1.2.3
 *   deno task release 1.2.3
 *
 * This script performs:
 * 1. Update version in deno.json
 * 2. Update deno.lock with new version
 * 3. Update flake.lock (if Nix is available)
 *
 * Note: Branch creation and PR creation are handled by GitHub Actions workflow
 *
 * @module
 */

const VERSION_PATTERN = /^v?(\d+\.\d+\.\d+(?:-[\w.]+)?)$/;

function parseVersion(input: string): { version: string; tag: string } {
  const match = input.match(VERSION_PATTERN);
  if (!match) {
    throw new Error(
      `Invalid version format: "${input}". Expected semver (e.g., "1.2.3" or "v1.2.3")`,
    );
  }
  const version = match[1];
  return { version, tag: `v${version}` };
}

async function updateVersion(version: string): Promise<void> {
  console.log("Updating version in deno.json...");
  const configPath = new URL("../deno.json", import.meta.url);
  const content = await Deno.readTextFile(configPath);
  const config = JSON.parse(content);

  const oldVersion = config.version;
  config.version = version;

  await Deno.writeTextFile(
    configPath,
    JSON.stringify(config, null, 2) + "\n",
  );

  console.log(`✓ Updated version: ${oldVersion} -> ${version}`);
}

async function updateLock(): Promise<void> {
  console.log("Updating deno.lock...");
  const command = new Deno.Command("deno", {
    args: [
      "cache",
      "-r",
      "**/*.ts",
      "jsr:@probitas/probitas",
      "jsr:@probitas/probitas@^0",
    ],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await command.output();
  if (code !== 0) {
    throw new Error("Failed to update deno.lock");
  }

  console.log("✓ Updated deno.lock");
}

async function updateFlakeLock(): Promise<void> {
  console.log("Updating flake.lock...");

  // Check if nix is available
  const nixCheck = new Deno.Command("which", {
    args: ["nix"],
    stdout: "null",
    stderr: "null",
  });

  const { code: nixCode } = await nixCheck.output();
  if (nixCode !== 0) {
    console.log("⊘ Skipping flake.lock update (nix not available)");
    return;
  }

  const command = new Deno.Command("nix", {
    args: ["flake", "update"],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { code } = await command.output();
  if (code !== 0) {
    throw new Error("Failed to update flake.lock");
  }

  console.log("✓ Updated flake.lock");
}

if (import.meta.main) {
  const args = Deno.args;
  const versionInput = args[0];

  if (!versionInput) {
    console.error("Usage: deno task release <version>");
    console.error("Example: deno task release v1.2.3");
    Deno.exit(1);
  }

  try {
    const { version, tag } = parseVersion(versionInput);

    console.log(`Preparing release for ${tag}...\n`);

    await updateVersion(version);
    await updateLock();
    await updateFlakeLock();

    console.log(`\n✓ Release preparation complete!`);
    console.log(`✓ Files updated: deno.json, deno.lock, flake.lock`);
    console.log(
      `\n⚠️  Next: GitHub Actions will create a PR for release/${tag}`,
    );
  } catch (error) {
    console.error(
      `\n✗ Error: ${error instanceof Error ? error.message : error}`,
    );
    Deno.exit(1);
  }
}
