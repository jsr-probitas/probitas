import type { ScenarioDefinition, StepDefinition } from "@probitas/scenario";
import type { ScenarioResult } from "./scenario.ts";
import type { StepResult } from "./step.ts";
import type { RunResult } from "./run.ts";

export interface Reporter {
  /**
   * Called when the test run starts, before any scenarios execute.
   */
  onRunStart?(scenarios: readonly ScenarioDefinition[]): void | Promise<void>;

  /**
   * Called when test run completes
   */
  onRunEnd?(
    scenarios: readonly ScenarioDefinition[],
    result: RunResult,
  ): void | Promise<void>;

  /**
   * Called when a scenario begins execution.
   */
  onScenarioStart?(scenario: ScenarioDefinition): void | Promise<void>;

  /**
   * Called when scenario completes
   */
  onScenarioEnd?(
    scenario: ScenarioDefinition,
    result: ScenarioResult,
  ): void | Promise<void>;

  /**
   * Called when step starts
   */
  onStepStart?(
    scenario: ScenarioDefinition,
    step: StepDefinition,
  ): void | Promise<void>;

  /**
   * Called when step completes successfully
   */
  onStepEnd?(
    scenario: ScenarioDefinition,
    step: StepDefinition,
    result: StepResult,
  ): void | Promise<void>;
}
