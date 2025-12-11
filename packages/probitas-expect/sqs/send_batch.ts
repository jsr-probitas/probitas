import { buildCountError, createDurationMethods } from "../common.ts";
import type { SqsSendBatchResult } from "@probitas/client-sqs";

export interface SqsSendBatchResultExpectation {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectSqsResult(batchResult).not.toBeSuccessful();
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the batch send operation completed successfully.
   *
   * @example
   * ```ts
   * expectSqsResult(batchResult).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that all messages in the batch were sent successfully (no failures).
   *
   * @example
   * ```ts
   * expectSqsResult(batchResult).toBeAllSuccessful();
   * ```
   */
  toBeAllSuccessful(): this;

  /**
   * Asserts that the count of successfully sent messages matches the expected value.
   *
   * @param count - The expected number of successful messages
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveSuccessfulCount(5);
   * ```
   */
  toHaveSuccessfulCount(count: number): this;

  /**
   * Asserts that the count of successfully sent messages is greater than the threshold.
   *
   * @param count - The threshold value
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveSuccessfulCountGreaterThan(3);
   * ```
   */
  toHaveSuccessfulCountGreaterThan(count: number): this;

  /**
   * Asserts that the count of successfully sent messages is at least the minimum.
   *
   * @param count - The minimum count (inclusive)
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveSuccessfulCountGreaterThanOrEqual(5);
   * ```
   */
  toHaveSuccessfulCountGreaterThanOrEqual(count: number): this;

  /**
   * Asserts that the count of successfully sent messages is less than the threshold.
   *
   * @param count - The threshold value
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveSuccessfulCountLessThan(10);
   * ```
   */
  toHaveSuccessfulCountLessThan(count: number): this;

  /**
   * Asserts that the count of successfully sent messages is at most the maximum.
   *
   * @param count - The maximum count (inclusive)
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveSuccessfulCountLessThanOrEqual(10);
   * ```
   */
  toHaveSuccessfulCountLessThanOrEqual(count: number): this;

  /**
   * Asserts that the count of failed messages matches the expected value.
   *
   * @param count - The expected number of failed messages
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveFailedCount(0);
   * ```
   */
  toHaveFailedCount(count: number): this;

  /**
   * Asserts that the count of failed messages is greater than the threshold.
   *
   * @param count - The threshold value
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveFailedCountGreaterThan(0);
   * ```
   */
  toHaveFailedCountGreaterThan(count: number): this;

  /**
   * Asserts that the count of failed messages is at least the minimum.
   *
   * @param count - The minimum count (inclusive)
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveFailedCountGreaterThanOrEqual(1);
   * ```
   */
  toHaveFailedCountGreaterThanOrEqual(count: number): this;

  /**
   * Asserts that the count of failed messages is less than the threshold.
   *
   * @param count - The threshold value
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveFailedCountLessThan(5);
   * ```
   */
  toHaveFailedCountLessThan(count: number): this;

  /**
   * Asserts that the count of failed messages is at most the maximum.
   *
   * @param count - The maximum count (inclusive)
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveFailedCountLessThanOrEqual(2);
   * ```
   */
  toHaveFailedCountLessThanOrEqual(count: number): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveDurationLessThan(2000);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveDurationLessThanOrEqual(2000);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveDurationGreaterThan(100);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(batchResult).toHaveDurationGreaterThanOrEqual(100);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

export function expectSqsSendBatchResult(
  result: SqsSendBatchResult,
  negate = false,
): SqsSendBatchResultExpectation {
  const self: SqsSendBatchResultExpectation = {
    get not(): SqsSendBatchResultExpectation {
      return expectSqsSendBatchResult(result, !negate);
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

    toBeAllSuccessful() {
      const allSuccess = result.failed.length === 0;
      if (negate ? allSuccess : !allSuccess) {
        throw new Error(
          negate
            ? "Expected some failures, but all messages were successful"
            : `Expected all messages successful, but ${result.failed.length} failed`,
        );
      }
      return this;
    },

    toHaveSuccessfulCount(count: number) {
      const match = result.successful.length === count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be ${count}, got ${result.successful.length}`
            : buildCountError(count, result.successful.length, "successful"),
        );
      }
      return this;
    },

    toHaveSuccessfulCountGreaterThan(count: number) {
      const match = result.successful.length > count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be > ${count}, got ${result.successful.length}`
            : `Expected successful count > ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveSuccessfulCountGreaterThanOrEqual(count: number) {
      const match = result.successful.length >= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be >= ${count}, got ${result.successful.length}`
            : `Expected successful count >= ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveSuccessfulCountLessThan(count: number) {
      const match = result.successful.length < count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be < ${count}, got ${result.successful.length}`
            : `Expected successful count < ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveSuccessfulCountLessThanOrEqual(count: number) {
      const match = result.successful.length <= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be <= ${count}, got ${result.successful.length}`
            : `Expected successful count <= ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveFailedCount(count: number) {
      const match = result.failed.length === count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be ${count}, got ${result.failed.length}`
            : buildCountError(count, result.failed.length, "failed"),
        );
      }
      return this;
    },

    toHaveFailedCountGreaterThan(count: number) {
      const match = result.failed.length > count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be > ${count}, got ${result.failed.length}`
            : `Expected failed count > ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    toHaveFailedCountGreaterThanOrEqual(count: number) {
      const match = result.failed.length >= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be >= ${count}, got ${result.failed.length}`
            : `Expected failed count >= ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    toHaveFailedCountLessThan(count: number) {
      const match = result.failed.length < count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be < ${count}, got ${result.failed.length}`
            : `Expected failed count < ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    toHaveFailedCountLessThanOrEqual(count: number) {
      const match = result.failed.length <= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be <= ${count}, got ${result.failed.length}`
            : `Expected failed count <= ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
