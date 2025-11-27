/**
 * Utility functions for CLI
 *
 * @module
 */

import {
  DotReporter,
  JSONReporter,
  ListReporter,
  TAPReporter,
} from "../src/reporter/mod.ts";
import type { ReporterOptions } from "../src/reporter/types.ts";
import type { Reporter } from "../src/runner/types.ts";

/**
 * Resolve reporter by name or return Reporter instance
 *
 * @param reporter - Reporter name or instance
 * @param options - Optional reporter options
 * @returns Reporter instance
 */
export function resolveReporter(
  reporter: string | Reporter | undefined,
  options?: ReporterOptions,
): Reporter {
  if (!reporter) {
    return new ListReporter(options);
  }

  if (typeof reporter === "string") {
    const reporterMap: Record<string, (opts?: ReporterOptions) => Reporter> = {
      "list": (opts) => new ListReporter(opts),
      "dot": (opts) => new DotReporter(opts),
      "json": (opts) => new JSONReporter(opts),
      "tap": (opts) => new TAPReporter(opts),
    };

    const factory = reporterMap[reporter];
    if (!factory) {
      throw new Error(`Unknown reporter: ${reporter}`);
    }

    return factory(options);
  }

  return reporter;
}

/**
 * Parse positive integer option
 *
 * @param value - Value to parse
 * @param name - Option name for error messages
 * @returns Parsed integer or undefined if not set
 */
export function parsePositiveInteger(
  value: string | number | undefined,
  name: string = "value",
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "string" && value.includes(".")) {
    throw new Error(`${name} must be a positive integer`);
  }

  const num = typeof value === "number" ? value : parseInt(value, 10);

  if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
    throw new Error(`${name} must be a positive integer`);
  }

  return num;
}

/**
 * Read template file from assets/templates
 *
 * @param filename - Template filename
 * @returns Template content
 * @requires --allow-read Permission to read template files
 */
export async function readTemplate(filename: string): Promise<string> {
  return await readAsset(`templates/${filename}`);
}

/**
 * Read asset file (help text, etc.)
 *
 * @param path - Asset filename (e.g., "usage.txt", "usage-run.txt")
 * @returns Asset content
 * @requires --allow-read Permission to read asset files
 */
export async function readAsset(path: string): Promise<string> {
  const assetPath = new URL(
    `../assets/${path}`,
    import.meta.url,
  );
  const resp = await fetch(assetPath);
  return await resp.text();
}

/**
 * Get version from import.meta.url
 *
 * @returns Version string from deno.jsonc or "unknown" if unable to read
 */
export function getVersion(): string {
  const prefix = "https://jsr.io/@lambdalisue/probitas/";
  if (import.meta.url.startsWith(prefix)) {
    return import.meta.url.slice(prefix.length).split("/").at(0) ?? "unknown";
  }
  return "unknown";
}
