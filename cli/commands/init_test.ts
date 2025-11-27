/**
 * Tests for init command
 *
 * Focuses on CLI-specific behavior: file generation and error handling.
 *
 * @requires --allow-read Permission to read files
 * @requires --allow-write Permission to write files
 * @module
 */

import { assertEquals, assertStringIncludes } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { exists } from "@std/fs";
import { sandbox } from "@lambdalisue/sandbox";
import { initCommand } from "./init.ts";

describe("init command", () => {
  it("creates all required files with correct content", async () => {
    await using sbox = await sandbox();

    const exitCode = await initCommand([], sbox.path);

    assertEquals(exitCode, 0);

    const configPath = sbox.resolve("probitas.config.ts");
    const denoJsonPath = sbox.resolve("scenarios", "deno.jsonc");
    const examplePath = sbox.resolve("scenarios", "example.scenario.ts");

    assertEquals(await exists(configPath), true);
    assertEquals(await exists(denoJsonPath), true);
    assertEquals(await exists(examplePath), true);

    const configContent = await Deno.readTextFile(configPath);
    assertStringIncludes(configContent, "ProbitasConfig");

    const denoJsonContent = await Deno.readTextFile(denoJsonPath);
    assertStringIncludes(denoJsonContent, "imports");

    const exampleContent = await Deno.readTextFile(examplePath);
    assertStringIncludes(exampleContent, "Example Scenario");
  });

  it("returns error when file exists", async () => {
    await using sbox = await sandbox();

    const configPath = sbox.resolve("probitas.config.ts");
    await Deno.writeTextFile(configPath, "existing content");

    const exitCode = await initCommand([], sbox.path);

    assertEquals(exitCode, 2);
  });

  it("overwrites existing files with --force flag", async () => {
    await using sbox = await sandbox();

    const configPath = sbox.resolve("probitas.config.ts");
    await Deno.writeTextFile(configPath, "old content");

    const exitCode = await initCommand(["--force"], sbox.path);

    assertEquals(exitCode, 0);

    const content = await Deno.readTextFile(configPath);
    assertStringIncludes(content, "ProbitasConfig");
  });

  it("shows help text with --help flag", async () => {
    await using sbox = await sandbox();

    const exitCode = await initCommand(["--help"], sbox.path);

    assertEquals(exitCode, 0);
  });
});
