/**
 * JSON Reporter
 *
 * Outputs test results in JSONLine format (one JSON object per line)
 * for easy parsing and integration with external tools.
 *
 * @module
 */

import { BaseReporter } from "./base_reporter.ts";
import type {
  ReporterOptions,
  ResourceDefinition,
  RunSummary,
  ScenarioDefinition,
  ScenarioResult,
  SetupDefinition,
  StepDefinition,
  StepResult,
} from "./types.ts";

/**
 * JSON Reporter - outputs results in JSONLine format
 */
export class JSONReporter extends BaseReporter {
  /**
   * Initialize JSON reporter
   *
   * @param options Configuration options
   */
  constructor(options: ReporterOptions = {}) {
    super(options);
  }

  /**
   * Called when test run starts
   *
   * @param scenarios All scenarios to be run
   */
  override async onRunStart(
    scenarios: readonly ScenarioDefinition[],
  ): Promise<void> {
    await super.onRunStart(scenarios);
    await this.write(
      JSON.stringify({
        type: "runStart",
        scenarios,
      }) + "\n",
    );
  }

  /**
   * Called when scenario starts
   *
   * @param scenario The scenario being executed
   */
  async onScenarioStart(scenario: ScenarioDefinition): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "scenarioStart",
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when resource initialization starts
   *
   * @param resource The resource being initialized
   * @param scenario The scenario being executed
   */
  async onResourceStart(
    resource: ResourceDefinition,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "resourceStart",
        resource,
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when resource initialization completes
   *
   * @param resource The resource that completed
   * @param scenario The scenario being executed
   */
  async onResourceEnd(
    resource: ResourceDefinition,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "resourceEnd",
        resource,
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when resource initialization fails
   *
   * @param resource The resource that failed
   * @param error The error that occurred
   * @param scenario The scenario being executed
   */
  async onResourceError(
    resource: ResourceDefinition,
    error: Error,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "resourceError",
        resource,
        scenario,
        error: {
          message: error.message,
          stack: error.stack ? this.sanitizeStack(error.stack) : undefined,
        },
      }) + "\n",
    );
  }

  /**
   * Called when setup starts
   *
   * @param setup The setup being executed
   * @param scenario The scenario being executed
   */
  async onSetupStart(
    setup: SetupDefinition,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "setupStart",
        setup,
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when setup completes
   *
   * @param setup The setup that completed
   * @param scenario The scenario being executed
   */
  async onSetupEnd(
    setup: SetupDefinition,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "setupEnd",
        setup,
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when setup fails
   *
   * @param setup The setup that failed
   * @param error The error that occurred
   * @param scenario The scenario being executed
   */
  async onSetupError(
    setup: SetupDefinition,
    error: Error,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "setupError",
        setup,
        scenario,
        error: {
          message: error.message,
          stack: error.stack ? this.sanitizeStack(error.stack) : undefined,
        },
      }) + "\n",
    );
  }

  /**
   * Called when step starts
   *
   * @param step The step being executed
   * @param scenario The scenario being executed
   */
  async onStepStart(
    step: StepDefinition,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "stepStart",
        step,
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when step completes
   *
   * @param _step The step definition
   * @param result The step execution result
   * @param scenario The scenario being executed
   */
  async onStepEnd(
    step: StepDefinition,
    result: StepResult,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "stepEnd",
        step,
        result,
        scenario,
      }) + "\n",
    );
  }

  /**
   * Called when step fails
   *
   * @param step The step definition
   * @param error The error that occurred
   * @param duration Step execution duration in milliseconds
   * @param scenario The scenario being executed
   */
  async onStepError(
    step: StepDefinition,
    error: Error,
    duration: number,
    scenario: ScenarioDefinition,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "stepError",
        step,
        scenario,
        duration,
        error: {
          message: error.message,
          stack: error.stack ? this.sanitizeStack(error.stack) : undefined,
        },
      }) + "\n",
    );
  }

  /**
   * Called when scenario is skipped
   *
   * @param scenario The scenario that was skipped
   * @param reason Optional skip reason
   * @param duration Scenario execution duration in milliseconds
   */
  async onScenarioSkip(
    scenario: ScenarioDefinition,
    reason: string | undefined,
    duration: number,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "scenarioSkip",
        scenario,
        reason,
        duration,
      }) + "\n",
    );
  }

  /**
   * Called when scenario completes
   *
   * @param scenario The scenario definition
   * @param result The scenario execution result
   */
  async onScenarioEnd(
    scenario: ScenarioDefinition,
    result: ScenarioResult,
  ): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "scenarioEnd",
        scenario,
        result,
      }) + "\n",
    );
  }

  /**
   * Called when test run completes
   *
   * @param summary The execution summary
   */
  override async onRunEnd(summary: RunSummary): Promise<void> {
    await this.write(
      JSON.stringify({
        type: "runEnd",
        summary,
      }) + "\n",
    );
    await super.onRunEnd(summary);
  }
}
