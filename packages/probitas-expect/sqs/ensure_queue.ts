import { createDurationMethods } from "../common.ts";
import type { SqsEnsureQueueResult } from "@probitas/client-sqs";

export interface SqsEnsureQueueResultExpectation {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).not.toBeSuccessful();
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the ensure queue operation completed successfully.
   *
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that the queue URL is present in the result.
   *
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveQueueUrl();
   * ```
   */
  toHaveQueueUrl(): this;

  /**
   * Asserts that the queue URL matches the expected value.
   *
   * @param expected - The expected queue URL
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveQueueUrl(
   *   "http://localhost:4566/000000000000/my-queue"
   * );
   * ```
   */
  toHaveQueueUrl(expected: string): this;

  /**
   * Asserts that the queue URL contains the given substring.
   *
   * @param substring - The substring to search for in the queue URL
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveQueueUrlContaining("my-queue");
   * ```
   */
  toHaveQueueUrlContaining(substring: string): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveDurationLessThan(2000);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveDurationLessThanOrEqual(2000);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveDurationGreaterThan(100);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(ensureQueueResult).toHaveDurationGreaterThanOrEqual(100);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

export function expectSqsEnsureQueueResult(
  result: SqsEnsureQueueResult,
  negate = false,
): SqsEnsureQueueResultExpectation {
  const self: SqsEnsureQueueResultExpectation = {
    get not(): SqsEnsureQueueResultExpectation {
      return expectSqsEnsureQueueResult(result, !negate);
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

    toHaveQueueUrl(expected?: string) {
      if (expected !== undefined) {
        const match = result.queueUrl === expected;
        if (negate ? match : !match) {
          throw new Error(
            negate
              ? `Expected queueUrl to not be "${expected}", got "${result.queueUrl}"`
              : `Expected queueUrl "${expected}", got "${result.queueUrl}"`,
          );
        }
      } else {
        const hasUrl = !!result.queueUrl;
        if (negate ? hasUrl : !hasUrl) {
          throw new Error(
            negate
              ? "Expected no queueUrl, but queueUrl exists"
              : "Expected queueUrl, but queueUrl is empty",
          );
        }
      }
      return this;
    },

    toHaveQueueUrlContaining(substring: string) {
      const contains = result.queueUrl.includes(substring);
      if (negate ? contains : !contains) {
        throw new Error(
          negate
            ? `Expected queueUrl to not contain "${substring}", got "${result.queueUrl}"`
            : `Expected queueUrl to contain "${substring}", got "${result.queueUrl}"`,
        );
      }
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
