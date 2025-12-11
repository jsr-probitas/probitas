import {
  buildCountAtLeastError,
  buildCountAtMostError,
  buildCountError,
  createDurationMethods,
} from "../common.ts";
import type { SqsMessages, SqsReceiveResult } from "@probitas/client-sqs";

export interface SqsReceiveResultExpectation {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectSqsResult(receiveResult).not.toHaveContent();
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the receive operation completed successfully.
   *
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that at least one message was received.
   *
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveContent();
   * ```
   */
  toHaveContent(): this;

  /**
   * Asserts that the message count matches the expected value.
   *
   * @param expected - The expected number of messages
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveLength(5);
   * ```
   */
  toHaveLength(expected: number): this;

  /**
   * Asserts that the message count is at least the minimum.
   *
   * @param min - The minimum count (inclusive)
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveLengthGreaterThanOrEqual(1);
   * ```
   */
  toHaveLengthGreaterThanOrEqual(min: number): this;

  /**
   * Asserts that the message count is at most the maximum.
   *
   * @param max - The maximum count (inclusive)
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveLengthLessThanOrEqual(10);
   * ```
   */
  toHaveLengthLessThanOrEqual(max: number): this;

  /**
   * Asserts that at least one message contains the given subset of properties.
   *
   * @param subset - Object containing optional body and attributes to match
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toMatchObject({
   *   body: "orderId",
   *   attributes: { type: "ORDER" },
   * });
   * ```
   */
  toMatchObject(
    subset: { body?: string; attributes?: Record<string, string> },
  ): this;

  /**
   * Asserts messages using a custom matcher function.
   *
   * @param matcher - Custom function to validate the messages array
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toSatisfy((messages) => {
   *   if (messages.length === 0) throw new Error("No messages");
   *   if (!messages[0].body.includes("order")) throw new Error("Missing order");
   * });
   * ```
   */
  toSatisfy(matcher: (messages: SqsMessages) => void): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveDurationLessThan(5000);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - Maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveDurationLessThanOrEqual(5000);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveDurationGreaterThan(100);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - Minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectSqsResult(receiveResult).toHaveDurationGreaterThanOrEqual(100);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

export function expectSqsReceiveResult(
  result: SqsReceiveResult,
  negate = false,
): SqsReceiveResultExpectation {
  const self: SqsReceiveResultExpectation = {
    get not(): SqsReceiveResultExpectation {
      return expectSqsReceiveResult(result, !negate);
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

    toHaveContent() {
      const hasContent = result.messages.length > 0;
      if (negate ? hasContent : !hasContent) {
        throw new Error(
          negate
            ? `Expected no messages, but got ${result.messages.length} messages`
            : "Expected messages, but messages array is empty",
        );
      }
      return this;
    },

    toHaveLength(expected: number) {
      const match = result.messages.length === expected;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected message count to not be ${expected}, got ${result.messages.length}`
            : buildCountError(expected, result.messages.length, "messages"),
        );
      }
      return this;
    },

    toHaveLengthGreaterThanOrEqual(min: number) {
      const match = result.messages.length >= min;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected message count to not be >= ${min}, got ${result.messages.length}`
            : buildCountAtLeastError(min, result.messages.length, "messages"),
        );
      }
      return this;
    },

    toHaveLengthLessThanOrEqual(max: number) {
      const match = result.messages.length <= max;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected message count to not be <= ${max}, got ${result.messages.length}`
            : buildCountAtMostError(max, result.messages.length, "messages"),
        );
      }
      return this;
    },

    toMatchObject(
      subset: { body?: string; attributes?: Record<string, string> },
    ) {
      const found = result.messages.some((msg) => {
        if (subset.body !== undefined && !msg.body.includes(subset.body)) {
          return false;
        }
        if (subset.attributes !== undefined) {
          for (const [key, value] of Object.entries(subset.attributes)) {
            if (msg.attributes[key] !== value) {
              return false;
            }
          }
        }
        return true;
      });

      if (negate ? found : !found) {
        throw new Error(
          negate
            ? `Expected no message to contain ${
              JSON.stringify(subset)
            }, but found one`
            : `Expected at least one message to contain ${
              JSON.stringify(subset)
            }`,
        );
      }
      return this;
    },

    toSatisfy(matcher: (messages: SqsMessages) => void) {
      matcher(result.messages);
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
