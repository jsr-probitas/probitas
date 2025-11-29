/**
 * Skip - Exception for skipping scenario execution
 *
 * Throw this from resource/setup/step functions to skip the scenario.
 * Skipped scenarios are counted separately from passed/failed.
 *
 * @module
 */

/**
 * Skip exception for skipping scenario execution
 *
 * @example
 * ```ts
 * step("conditional step", (ctx) => {
 *   if (!ctx.resources.featureEnabled) {
 *     throw new Skip("Feature not enabled");
 *   }
 *   // ... step logic
 * });
 * ```
 */
export class Skip extends Error {
  /**
   * Optional reason for skipping
   */
  readonly reason?: string;

  /**
   * Create a Skip exception
   *
   * @param reason Optional reason for skipping
   */
  constructor(reason?: string) {
    super(reason ?? "Skipped");
    this.name = "Skip";
    this.reason = reason;
  }
}
