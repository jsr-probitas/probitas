/**
 * Default options for the Builder layer
 *
 * Default values applied to scenarios and steps when no explicit options provided.
 *
 * @module
 */

import type { ScenarioOptions, StepOptions } from "@probitas/scenario";

/**
 * Default scenario options applied when building scenarios.
 *
 * These values are used as fallbacks when options are not explicitly specified.
 * The option resolution order is:
 * 1. Explicitly provided option
 * 2. Scenario-level default
 * 3. This constant
 *
 * @remarks
 * Default values:
 * - `tags`: Empty array (no tags)
 * - `stepOptions.timeout`: 30000ms (30 seconds)
 * - `stepOptions.retry.maxAttempts`: 1 (no retry)
 * - `stepOptions.retry.backoff`: "linear"
 *
 * @example
 * ```ts
 * import { scenario } from "@probitas/builder";
 *
 * // This scenario inherits all defaults
 * scenario("Basic Test")
 *   .step("Test step", () => {
 *     // timeout: 30000ms, retry: 1 attempt
 *   })
 *   .build();
 * ```
 */
export const DEFAULT_SCENARIO_OPTIONS: ScenarioOptions = {
  tags: [],
  stepOptions: {
    timeout: 30000,
    retry: {
      maxAttempts: 1,
      backoff: "linear",
    },
  },
};

/**
 * Default step options applied to individual steps.
 *
 * These values are used when step options are not specified at either
 * the step level or scenario level. The option resolution order is:
 * 1. Step-level option (passed to `.step()`)
 * 2. Scenario-level `stepOptions`
 * 3. This constant
 *
 * @remarks
 * Default values:
 * - `timeout`: 30000ms (30 seconds) - Maximum execution time per step
 * - `retry.maxAttempts`: 1 (no retry) - Number of execution attempts
 * - `retry.backoff`: "linear" - Backoff strategy between retries
 *
 * @example
 * ```ts
 * import { scenario } from "@probitas/builder";
 *
 * scenario("API Test")
 *   // This step overrides timeout but inherits retry settings
 *   .step("Slow API call", async () => {
 *     await fetch("https://slow-api.example.com");
 *   }, { timeout: 60000 })
 *   .build();
 * ```
 */
export const DEFAULT_STEP_OPTIONS: StepOptions = {
  timeout: 30000,
  retry: {
    maxAttempts: 1,
    backoff: "linear",
  },
};
