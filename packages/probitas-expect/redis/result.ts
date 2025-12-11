import { createDurationMethods } from "../common.ts";

/**
 * Base fluent API for Redis result validation.
 *
 * Provides chainable assertions for validating Redis operation results,
 * including success status, data values, and operation duration.
 */
export interface RedisResultExpectation<T> {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectRedisResult(result).not.toBeSuccessful();
   * expectRedisResult(result).not.toHaveData("unexpected");
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the Redis operation was successful (ok is true).
   *
   * @example
   * ```ts
   * expectRedisResult(result).toBeSuccessful();
   * ```
   */
  toBeSuccessful(): this;

  /**
   * Asserts that the result data matches the expected value using strict equality.
   *
   * @param expected - The expected data value
   * @example
   * ```ts
   * expectRedisResult(result).toHaveData("myValue");
   * expectRedisResult(result).toHaveData(null);
   * ```
   */
  toHaveData(expected: T): this;

  /**
   * Asserts that the result data satisfies a custom matcher function.
   *
   * The matcher function receives the result value and should throw
   * an error if the assertion fails.
   *
   * @param matcher - A function that validates the value
   * @example
   * ```ts
   * expectRedisResult(result).toSatisfy((value) => {
   *   if (value !== "expected") {
   *     throw new Error("Value mismatch");
   *   }
   * });
   * ```
   */
  toSatisfy(matcher: (value: T) => void): this;

  /**
   * Asserts that the operation duration is less than the specified threshold.
   *
   * @param ms - The maximum duration in milliseconds (exclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveDurationLessThan(100);
   * ```
   */
  toHaveDurationLessThan(ms: number): this;

  /**
   * Asserts that the operation duration is less than or equal to the specified threshold.
   *
   * @param ms - The maximum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveDurationLessThanOrEqual(100);
   * ```
   */
  toHaveDurationLessThanOrEqual(ms: number): this;

  /**
   * Asserts that the operation duration is greater than the specified threshold.
   *
   * @param ms - The minimum duration in milliseconds (exclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveDurationGreaterThan(10);
   * ```
   */
  toHaveDurationGreaterThan(ms: number): this;

  /**
   * Asserts that the operation duration is greater than or equal to the specified threshold.
   *
   * @param ms - The minimum duration in milliseconds (inclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveDurationGreaterThanOrEqual(10);
   * ```
   */
  toHaveDurationGreaterThanOrEqual(ms: number): this;
}

/**
 * Common shape for all Redis results (internal use only).
 */
export interface RedisResultShape<T> {
  readonly type: string;
  readonly ok: boolean;
  readonly value: T;
  readonly duration: number;
}

/**
 * Create base expectation for Redis result.
 */
export function expectRedisResultBase<T>(
  result: RedisResultShape<T>,
  negate = false,
): RedisResultExpectation<T> {
  const self: RedisResultExpectation<T> = {
    get not(): RedisResultExpectation<T> {
      return expectRedisResultBase(result, !negate);
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

    toHaveData(expected: T) {
      const match = result.value === expected;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected data to not be ${JSON.stringify(expected)}, got ${
              JSON.stringify(result.value)
            }`
            : `Expected data ${JSON.stringify(expected)}, got ${
              JSON.stringify(result.value)
            }`,
        );
      }
      return this;
    },

    toSatisfy(matcher: (value: T) => void) {
      matcher(result.value);
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
