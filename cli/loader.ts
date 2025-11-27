/**
 * Scenario file loader for Probitas
 *
 * @module
 */

import { toFileUrl } from "@std/path";
import type { ScenarioDefinition } from "../src/runner/types.ts";

/**
 * Load scenarios from specified file paths
 *
 * @param scenarioFiles - Array of absolute file paths to load
 * @returns Array of loaded ScenarioDefinition objects
 *
 * @requires --allow-read Permission to read scenario files
 *
 * @example
 * const files = await discoverScenarioFiles("/project", {});
 * const scenarios = await loadScenarios(files);
 */
export async function loadScenarios(
  scenarioFiles: readonly string[],
): Promise<ScenarioDefinition[]> {
  const scenarios: ScenarioDefinition[] = [];

  for (const filePath of scenarioFiles) {
    try {
      const fileUrl = toFileUrl(filePath);
      const module = await import(fileUrl.href);
      const exported = module.default;

      if (Array.isArray(exported)) {
        // Multiple scenarios
        scenarios.push(...exported);
      } else if (exported && typeof exported === "object") {
        // Single scenario
        scenarios.push(exported);
      }
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to load scenario from ${filePath}: ${m}`);
    }
  }

  return scenarios;
}
