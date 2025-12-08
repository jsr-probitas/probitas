/**
 * List Reporter
 *
 * Outputs test results in a flat list format with detailed information
 * for each step.
 *
 * @module
 */

import type {
  ScenarioDefinition,
  Source,
  StepDefinition,
} from "@probitas/scenario";
import type { Reporter, RunResult, StepResult } from "@probitas/runner";
import { Writer, type WriterOptions } from "./writer.ts";
import { defaultTheme, type Theme } from "./theme.ts";
import { formatSource } from "./utils/source.ts";

export interface ListReporterOptions extends WriterOptions {
  theme?: Theme;
}

export class ListReporter implements Reporter {
  #writer: Writer;
  #theme: Theme;

  constructor(options: ListReporterOptions = {}) {
    this.#writer = new Writer(options);
    this.#theme = options.theme ?? defaultTheme;
  }

  #writeln(...terms: string[]): Promise<void> {
    const text = terms.join(" ");
    return this.#writer.write(`${text}\n`);
  }

  #formatSource(source?: Source): string {
    return this.#theme.dim(formatSource(source, {
      prefix: "(",
      suffix: ")",
    }));
  }

  #formatTime(duration: number): string {
    return `${this.#theme.info(`[${duration.toFixed(3)}ms]`)}`;
  }

  async onStepEnd(
    scenario: ScenarioDefinition,
    _step: StepDefinition,
    result: StepResult,
  ): Promise<void> {
    const icon = result.status === "passed"
      ? this.#theme.success("✓")
      : result.status === "skipped"
      ? this.#theme.skip("⊘")
      : this.#theme.failure("✗");
    const source = this.#formatSource(result.metadata.source);
    const time = this.#formatTime(result.duration);
    const skipReason = result.status === "skipped"
      ? this.#theme.warning(getErrorMessage(result.error))
      : "";
    await this.#writeln(
      icon,
      scenario.name,
      this.#theme.dim(">"),
      result.metadata.name,
      source,
      time,
      skipReason,
    );
  }

  /**
   * Called when run ends - output summary
   *
   * @param summary The execution summary
   */
  async onRunEnd(
    _scenarios: readonly ScenarioDefinition[],
    result: RunResult,
  ): Promise<void> {
    const { passed, skipped, failed, scenarios, total, duration } = result;
    await this.#writeln(`\n${this.#theme.title("Summary")}`);
    await this.#writeln(
      `  ${this.#theme.success("✓")} ${passed} scenarios passed`,
    );

    if (skipped > 0) {
      await this.#writeln(
        `  ${this.#theme.skip("⊘")} ${skipped} scenarios skipped`,
      );
    }

    if (failed > 0) {
      await this.#writeln(
        `  ${this.#theme.failure("✗")} ${failed} scenarios failed`,
      );
      await this.#writeln("");
      await this.#writeln(`${this.#theme.title("Failed Tests")}`);

      const failedScenarios = scenarios.filter((s) => s.status === "failed");
      for (const scenario of failedScenarios) {
        // Show failed steps
        const failedSteps = scenario.steps.filter((s) => s.status === "failed");
        for (const step of failedSteps) {
          const source = this.#formatSource(step.metadata.source);
          const time = this.#formatTime(step.duration);
          await this.#writeln(
            `  ${this.#theme.failure("✗")}`,
            scenario.metadata.name,
            this.#theme.dim(">"),
            step.metadata.name,
            source,
            time,
          );
          // Show error details for failed steps
          if (step.status === "failed" && "error" in step && step.error) {
            await this.#writeln("");
            const message = getErrorMessage(step.error);
            await this.#writeln(`    ${this.#theme.failure(message)}`);
            if (step.error instanceof Error && step.error.stack) {
              const stack = step.error.stack.split("\n")
                .slice(1) // Skip first line (already shown as message)
                .join("\n")
                .trim();
              if (stack) {
                await this.#writeln("");
                for (const line of stack.split("\n")) {
                  await this.#writeln(`    ${this.#theme.dim(line)}`);
                }
              }
            }
            await this.#writeln("");
          }
        }
      }
    }

    await this.#writeln(
      `${total} scenarios total`,
      this.#theme.info(`[${duration.toFixed(3)}ms]`),
    );
  }
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message) {
      return `${err.name}: ${err.message}`;
    }
    if (err.cause) {
      return `${err.name}: ${getErrorMessage(err.cause)}`;
    }
    return err.name;
  }
  return String(err);
}
