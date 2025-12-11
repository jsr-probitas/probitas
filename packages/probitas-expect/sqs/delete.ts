import { createDurationMethods } from "../common.ts";
import type { SqsDeleteResult } from "@probitas/client-sqs";

export interface SqsDeleteResultExpectation {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectSqsResult(deleteResult).not.toBeSuccessful();
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the delete operation completed successfully.
   *
   * @example
   * ```ts
   * expectSqsResult(deleteResult).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(deleteResult).toHaveDurationLessThan(1000);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(deleteResult).toHaveDurationLessThanOrEqual(1000);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(deleteResult).toHaveDurationGreaterThan(50);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(deleteResult).toHaveDurationGreaterThanOrEqual(50);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

export function expectSqsDeleteResult(
  result: SqsDeleteResult,
  negate = false,
): SqsDeleteResultExpectation {
  const self: SqsDeleteResultExpectation = {
    get not(): SqsDeleteResultExpectation {
      return expectSqsDeleteResult(result, !negate);
    },

    toBeSuccessful() {
      const isSuccess = result.ok;
      if (negate ? isSuccess : !isSuccess) {
        throw new Error(
          negate
            ? "Expected not ok result, but ok is true"
            : "Expected ok result, but ok is false",
        );
      }
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
