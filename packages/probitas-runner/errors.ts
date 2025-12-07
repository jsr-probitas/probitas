/**
 * Error classes for the Runner layer
 *
 * Specialized error types for different failure scenarios during test execution.
 *
 * @module
 */

import type { ScenarioDefinition, StepDefinition } from "./types.ts";

/**
 * Error that occurs during scenario execution (setup, teardown, or resource handling).
 *
 * Wraps errors that happen outside of step execution, such as:
 * - Resource initialization failures
 * - Setup function errors
 * - Cleanup/teardown errors
 *
 * @example
 * ```ts
 * try {
 *   await runner.run(scenario);
 * } catch (err) {
 *   if (err instanceof ScenarioError) {
 *     console.error(`Scenario "${err.scenario.name}" failed: ${err.message}`);
 *     if (err.cause) {
 *       console.error("Caused by:", err.cause);
 *     }
 *   }
 * }
 * ```
 */
export class ScenarioError extends Error {
  /**
   * Create a scenario error.
   *
   * @param message - Descriptive error message
   * @param scenario - The scenario definition where the error occurred
   * @param cause - The underlying error that caused this error
   */
  constructor(
    message: string,
    public readonly scenario: ScenarioDefinition,
    public override readonly cause?: Error,
  ) {
    super(message);
    this.name = "ScenarioError";
  }
}

/**
 * Error that occurs during step execution.
 *
 * Wraps errors thrown by step functions, including retry information.
 * Provides access to the step definition for error reporting.
 *
 * @example
 * ```ts
 * try {
 *   await executeStep(step);
 * } catch (err) {
 *   if (err instanceof StepError) {
 *     console.error(`Step "${err.step.name}" failed on attempt ${err.attempt}`);
 *     console.error("Original error:", err.cause);
 *   }
 * }
 * ```
 */
export class StepError extends Error {
  /**
   * Create a step error.
   *
   * @param message - Descriptive error message
   * @param step - The step definition that failed
   * @param attempt - Which attempt failed (1-based, accounts for retries)
   * @param cause - The original error thrown by the step function
   */
  constructor(
    message: string,
    public readonly step: StepDefinition,
    public readonly attempt: number,
    public override readonly cause?: Error,
  ) {
    super(message);
    this.name = "StepError";
  }
}

/**
 * Error that occurs when a step exceeds its configured timeout.
 *
 * Thrown when a step's execution time exceeds its `timeout` option.
 * The timeout value is available for error messages and retry logic.
 *
 * @example Handling timeout errors
 * ```ts
 * try {
 *   await executeStep(step);
 * } catch (err) {
 *   if (err instanceof TimeoutError) {
 *     console.error(`Step timed out after ${err.timeout}ms`);
 *   }
 * }
 * ```
 *
 * @example Configuring step timeout
 * ```ts
 * scenario("Slow API")
 *   .step("Call API", async (ctx) => {
 *     const response = await fetch(url, { signal: ctx.signal });
 *     return response.json();
 *   }, { timeout: 60000 })  // 60 second timeout
 *   .build();
 * ```
 */
export class TimeoutError extends Error {
  /**
   * Create a timeout error.
   *
   * @param message - Descriptive error message
   * @param timeout - The timeout value in milliseconds that was exceeded
   */
  constructor(
    message: string,
    public readonly timeout: number,
  ) {
    super(message);
    this.name = "TimeoutError";
  }
}
