/**
 * Type definitions for the Builder layer
 *
 * Types for building scenario definitions with type-safe fluent API.
 * Re-exports core types from the scenario module.
 *
 * @module
 */

import type { ScenarioOptions, StepOptions } from "@probitas/scenario";

/**
 * Deep partial type - makes all properties and nested properties optional.
 *
 * This utility type recursively makes all properties optional, allowing users
 * to specify only the options they want to override while inheriting defaults
 * for everything else.
 *
 * @typeParam T - The type to make deeply partial
 *
 * @remarks
 * - Functions are preserved as-is (not made partial)
 * - Arrays are preserved as-is (not made partial)
 * - Objects have all properties made optional recursively
 *
 * @example
 * ```ts
 * // Original type
 * interface Config {
 *   timeout: number;
 *   retry: { maxAttempts: number; backoff: string };
 * }
 *
 * // DeepPartial<Config> allows:
 * const partial: DeepPartial<Config> = {
 *   retry: { maxAttempts: 3 }  // backoff is optional
 * };
 * ```
 */
// deno-lint-ignore no-explicit-any
type DeepPartial<T> = T extends (...args: any[]) => any ? T
  // deno-lint-ignore no-explicit-any
  : T extends readonly any[] ? T
  : T extends object ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Partial scenario options used during building.
 *
 * All fields and nested fields are optional. When building a scenario,
 * unspecified options are filled with {@linkcode DEFAULT_SCENARIO_OPTIONS}.
 *
 * @example
 * ```ts
 * import { scenario } from "@probitas/builder";
 *
 * // Only specify what you need - rest uses defaults
 * scenario("My Test", {
 *   tags: ["api", "integration"],
 *   stepOptions: {
 *     timeout: 60000  // Override only timeout, keep default retry
 *   }
 * });
 * ```
 *
 * @see {@linkcode ScenarioOptions} for the complete options structure
 * @see {@linkcode DEFAULT_SCENARIO_OPTIONS} for default values
 */
export type BuilderScenarioOptions = DeepPartial<ScenarioOptions>;

/**
 * Partial step options used during building.
 *
 * All fields and nested fields are optional. When adding a step,
 * unspecified options inherit from scenario-level defaults, then
 * from {@linkcode DEFAULT_STEP_OPTIONS}.
 *
 * @example
 * ```ts
 * import { scenario } from "@probitas/builder";
 *
 * scenario("Payment Flow")
 *   .step("Process payment", async (ctx) => {
 *     // ... payment logic
 *   }, {
 *     timeout: 120000,  // 2 minutes for slow payment gateway
 *     retry: { maxAttempts: 3, backoff: "exponential" }
 *   })
 *   .build();
 * ```
 *
 * @see {@linkcode StepOptions} for the complete options structure
 * @see {@linkcode DEFAULT_STEP_OPTIONS} for default values
 */
export type BuilderStepOptions = DeepPartial<StepOptions>;

// Re-export core types used by builder consumers
export type {
  ResourceFactory,
  SetupCleanup,
  SetupFunction,
  StepContext,
  StepFunction,
} from "@probitas/scenario";
