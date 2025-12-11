import {
  buildCountAtLeastError,
  buildCountAtMostError,
  buildCountError,
} from "../common.ts";
import type { RedisCountResult } from "@probitas/client-redis";
import {
  expectRedisResultBase,
  type RedisResultExpectation,
} from "./result.ts";

/**
 * Fluent API for Redis count result validation.
 *
 * Extends {@linkcode RedisResultExpectation} with additional assertions
 * specific to count-based results (e.g., DEL, LPUSH, SCARD operations).
 */
export interface RedisCountResultExpectation
  extends RedisResultExpectation<number> {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectRedisResult(result).not.toHaveLength(0);
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the count equals the expected value.
   *
   * @param expected - The expected count value
   * @example
   * ```ts
   * expectRedisResult(result).toHaveLength(5);
   * ```
   */
  toHaveLength(expected: number): this;

  /**
   * Asserts that the count is greater than or equal to the minimum value.
   *
   * @param min - The minimum count value (inclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveLengthGreaterThanOrEqual(1);
   * ```
   */
  toHaveLengthGreaterThanOrEqual(min: number): this;

  /**
   * Asserts that the count is less than or equal to the maximum value.
   *
   * @param max - The maximum count value (inclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveLengthLessThanOrEqual(10);
   * ```
   */
  toHaveLengthLessThanOrEqual(max: number): this;
}

export function expectRedisCountResult(
  result: RedisCountResult,
  negate = false,
): RedisCountResultExpectation {
  const base = expectRedisResultBase(result, negate);

  const self: RedisCountResultExpectation = {
    get not(): RedisCountResultExpectation {
      return expectRedisCountResult(result, !negate);
    },

    toBeSuccessful() {
      base.toBeSuccessful();
      return this;
    },

    toHaveData(expected: number) {
      base.toHaveData(expected);
      return this;
    },

    toSatisfy(matcher: (value: number) => void) {
      base.toSatisfy(matcher);
      return this;
    },

    toHaveDurationLessThan(ms: number) {
      base.toHaveDurationLessThan(ms);
      return this;
    },

    toHaveDurationLessThanOrEqual(ms: number) {
      base.toHaveDurationLessThanOrEqual(ms);
      return this;
    },

    toHaveDurationGreaterThan(ms: number) {
      base.toHaveDurationGreaterThan(ms);
      return this;
    },

    toHaveDurationGreaterThanOrEqual(ms: number) {
      base.toHaveDurationGreaterThanOrEqual(ms);
      return this;
    },

    toHaveLength(expected: number) {
      const match = result.value === expected;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected count to not be ${expected}, got ${result.value}`
            : buildCountError(expected, result.value, "count"),
        );
      }
      return this;
    },

    toHaveLengthGreaterThanOrEqual(min: number) {
      const match = result.value >= min;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected count to not be >= ${min}, got ${result.value}`
            : buildCountAtLeastError(min, result.value, "count"),
        );
      }
      return this;
    },

    toHaveLengthLessThanOrEqual(max: number) {
      const match = result.value <= max;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected count to not be <= ${max}, got ${result.value}`
            : buildCountAtMostError(max, result.value, "count"),
        );
      }
      return this;
    },
  };

  return self;
}
