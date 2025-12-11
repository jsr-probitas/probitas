import { createDurationMethods } from "../common.ts";
import type { SqsSendResult } from "@probitas/client-sqs";

export interface SqsSendResultExpectation {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectSqsResult(sendResult).not.toBeSuccessful();
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the send operation completed successfully.
   *
   * @example
   * ```ts
   * expectSqsResult(sendResult).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that the send result contains a messageId.
   *
   * @example
   * ```ts
   * expectSqsResult(sendResult).toHaveMessageId();
   * ```
   */
  toHaveMessageId(): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(sendResult).toHaveDurationLessThan(1000);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(sendResult).toHaveDurationLessThanOrEqual(1000);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(sendResult).toHaveDurationGreaterThan(100);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(sendResult).toHaveDurationGreaterThanOrEqual(100);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

export function expectSqsSendResult(
  result: SqsSendResult,
  negate = false,
): SqsSendResultExpectation {
  const self: SqsSendResultExpectation = {
    get not(): SqsSendResultExpectation {
      return expectSqsSendResult(result, !negate);
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

    toHaveMessageId() {
      const hasId = !!result.messageId;
      if (negate ? hasId : !hasId) {
        throw new Error(
          negate
            ? "Expected no messageId, but messageId exists"
            : "Expected messageId, but messageId is undefined",
        );
      }
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
