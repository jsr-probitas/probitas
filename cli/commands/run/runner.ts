/**
 * Subprocess entry point for running scenarios
 *
 * Receives configuration as JSON via stdin and executes scenarios
 * in a subprocess with the project's deno.json configuration.
 *
 * @module
 */

import { as, ensure, is, type Predicate } from "@core/unknownutil";
import { ScenarioRunner } from "../../../src/runner/scenario_runner.ts";
import { loadScenarios } from "../../loader.ts";
import { applySelectors } from "../../selector.ts";
import { resolveReporter } from "../../utils.ts";
import type { ReporterOptions } from "../../../src/reporter/types.ts";

/**
 * Input configuration passed via stdin
 */
interface SubprocessInput {
  /** Scenario file paths (absolute) */
  files: string[];
  /** Selectors to filter scenarios */
  selectors?: string[];
  /** Reporter name */
  reporter?: string;
  /** Disable color output */
  noColor?: boolean;
  /** Verbosity level */
  verbosity?: "quiet" | "normal" | "verbose" | "debug";
  /** Maximum concurrent scenario execution */
  maxConcurrency?: number;
  /** Maximum number of failures before stopping */
  maxFailures?: number;
}

const isSubprocessInput = is.ObjectOf({
  files: is.ArrayOf(is.String),
  selectors: as.Optional(is.ArrayOf(is.String)),
  reporter: as.Optional(is.String),
  noColor: as.Optional(is.Boolean),
  verbosity: as.Optional(is.LiteralOneOf(
    ["quiet", "normal", "verbose", "debug"] as const,
  )),
  maxConcurrency: as.Optional(is.Number),
  maxFailures: as.Optional(is.Number),
}) satisfies Predicate<SubprocessInput>;

async function main(): Promise<number> {
  // Read JSON input from stdin
  let input: SubprocessInput;
  try {
    input = ensure(
      await new Response(Deno.stdin.readable).json(),
      isSubprocessInput,
    );
  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : String(err);
    console.error(`Error: Failed to parse stdin JSON as SubprocessInput: ${m}`);
    return 1;
  }

  const {
    files,
    selectors,
    reporter: reporterName,
    noColor,
    verbosity,
    maxConcurrency,
    maxFailures,
  } = input;

  if (!files || files.length === 0) {
    console.error("Error: No scenario files specified");
    return 1;
  }

  try {
    // Load scenarios
    let scenarios = await loadScenarios(files);
    if (scenarios.length === 0) {
      console.error("Error: No scenarios found in specified files");
      return 1;
    }

    // Apply selectors to filter scenarios
    if (selectors && selectors.length > 0) {
      scenarios = applySelectors(scenarios, selectors);
    }

    if (scenarios.length === 0) {
      console.error("Error: No scenarios matched the filter");
      return 4; // NOT_FOUND
    }

    // Setup reporter
    const reporterOptions: ReporterOptions = {
      noColor: noColor ?? false,
      verbosity: verbosity ?? "normal",
    };
    const reporter = resolveReporter(reporterName, reporterOptions);

    // Run scenarios
    const runner = new ScenarioRunner();
    const summary = await runner.run(scenarios, {
      reporter,
      maxConcurrency,
      maxFailures,
    });

    // Return exit code
    return summary.failed > 0 ? 1 : 0;
  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${m}`);
    return 1;
  }
}

if (import.meta.main) {
  const exitCode = await main();
  Deno.exit(exitCode);
}
