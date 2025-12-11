import { createDurationMethods } from "../common.ts";
import type { SqsDeleteQueueResult } from "@probitas/client-sqs";

export interface SqsDeleteQueueResultExpectation {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectSqsResult(deleteQueueResult).not.toBeSuccessful();
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the delete queue operation completed successfully.
   *
   * @example
   * ```ts
   * expectSqsResult(deleteQueueResult).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(deleteQueueResult).toHaveDurationLessThan(1000);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(deleteQueueResult).toHaveDurationLessThanOrEqual(1000);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(deleteQueueResult).toHaveDurationGreaterThan(50);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(deleteQueueResult).toHaveDurationGreaterThanOrEqual(50);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

export function expectSqsDeleteQueueResult(
  result: SqsDeleteQueueResult,
  negate = false,
): SqsDeleteQueueResultExpectation {
  const self: SqsDeleteQueueResultExpectation = {
    get not(): SqsDeleteQueueResultExpectation {
      return expectSqsDeleteQueueResult(result, !negate);
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
