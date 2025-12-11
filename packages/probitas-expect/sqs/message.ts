import { containsSubset } from "../common.ts";
import type { SqsMessage, SqsMessageAttribute } from "@probitas/client-sqs";

export interface SqsMessageExpectation {
  /**
   * Asserts that the message body contains the given substring.
   *
   * @param substring - The substring to search for in the body
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveBodyContaining("orderId");
   * ```
   */
  toHaveBodyContaining(substring: string): this;

  /**
   * Asserts the message body using a custom matcher function.
   *
   * @param matcher - Custom function to validate the body
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveBodyMatching((body) => {
   *   if (!body.startsWith("{")) throw new Error("Body must be JSON");
   * });
   * ```
   */
  toHaveBodyMatching(matcher: (body: string) => void): this;

  /**
   * Asserts that the message body equals the expected JSON (deep equality).
   *
   * @param expected - The expected JSON object
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveBodyJsonEqualTo({
   *   orderId: "123",
   *   status: "pending",
   * });
   * ```
   */
  // deno-lint-ignore no-explicit-any
  toHaveBodyJsonEqualTo<T = any>(expected: T): this;

  /**
   * Asserts that the message body JSON contains the given subset of properties.
   *
   * @param subset - Partial object to match against the body JSON
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveBodyJsonContaining({ orderId: "123" });
   * ```
   */
  // deno-lint-ignore no-explicit-any
  toHaveBodyJsonContaining<T = any>(subset: Partial<T>): this;

  /**
   * Asserts that the message has the given attribute.
   *
   * @param name - The attribute name to check for
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveAttribute("correlationId");
   * ```
   */
  toHaveAttribute(name: string): this;

  /**
   * Asserts that the message attributes contain the given subset.
   *
   * @param subset - Record of attribute names to partial attribute values
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveAttributesContaining({
   *   correlationId: { stringValue: "abc-123" },
   *   messageType: { stringValue: "ORDER" },
   * });
   * ```
   */
  toHaveAttributesContaining(
    subset: Record<string, Partial<SqsMessageAttribute>>,
  ): this;

  /**
   * Asserts that the messageId matches the expected value.
   *
   * @param expected - The expected messageId
   * @example
   * ```ts
   * expectSqsMessage(message).toHaveMessageId("msg-12345");
   * ```
   */
  toHaveMessageId(expected: string): this;
}

export function expectSqsMessage(
  message: SqsMessage,
): SqsMessageExpectation {
  const self: SqsMessageExpectation = {
    toHaveBodyContaining(substring: string) {
      if (!message.body.includes(substring)) {
        throw new Error(
          `Expected body to contain "${substring}", but got "${message.body}"`,
        );
      }
      return this;
    },

    toHaveBodyMatching(matcher: (body: string) => void) {
      matcher(message.body);
      return this;
    },

    // deno-lint-ignore no-explicit-any
    toHaveBodyJsonEqualTo<T = any>(expected: T) {
      const actual = JSON.parse(message.body);
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected body JSON to equal ${JSON.stringify(expected)}, got ${
            JSON.stringify(actual)
          }`,
        );
      }
      return this;
    },

    // deno-lint-ignore no-explicit-any
    toHaveBodyJsonContaining<T = any>(subset: Partial<T>) {
      const actual = JSON.parse(message.body);
      if (!containsSubset(actual, subset)) {
        throw new Error(
          `Expected body JSON to contain ${JSON.stringify(subset)}, got ${
            JSON.stringify(actual)
          }`,
        );
      }
      return this;
    },

    toHaveAttribute(name: string) {
      if (!message.messageAttributes?.[name]) {
        throw new Error(`Expected message to have attribute "${name}"`);
      }
      return this;
    },

    toHaveAttributesContaining(
      subset: Record<string, Partial<SqsMessageAttribute>>,
    ) {
      const attrs = message.messageAttributes ?? {};
      for (const [key, expected] of Object.entries(subset)) {
        const actual = attrs[key];
        if (!actual) {
          throw new Error(`Expected attribute "${key}" to exist`);
        }
        if (!containsSubset(actual, expected)) {
          throw new Error(
            `Expected attribute "${key}" to contain ${
              JSON.stringify(expected)
            }, got ${JSON.stringify(actual)}`,
          );
        }
      }
      return this;
    },

    toHaveMessageId(expected: string) {
      if (message.messageId !== expected) {
        throw new Error(
          `Expected messageId "${expected}", got "${message.messageId}"`,
        );
      }
      return this;
    },
  };

  return self;
}
