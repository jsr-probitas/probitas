import {
  buildCountAtLeastError,
  buildCountAtMostError,
  buildCountError,
} from "../common.ts";
import type { RedisArrayResult } from "@probitas/client-redis";
import {
  expectRedisResultBase,
  type RedisResultExpectation,
} from "./result.ts";

/**
 * Fluent API for Redis array result validation.
 *
 * Extends {@linkcode RedisResultExpectation} with additional assertions
 * specific to array-based results (e.g., LRANGE, SMEMBERS, KEYS operations).
 */
export interface RedisArrayResultExpectation<T>
  extends RedisResultExpectation<readonly T[]> {
  /**
   * Negates the next assertion.
   *
   * @example
   * ```ts
   * expectRedisResult(result).not.toHaveContent();
   * expectRedisResult(result).not.toContain("item");
   * ```
   */
  readonly not: this;

  /**
   * Asserts that the array is not empty (contains at least one item).
   *
   * @example
   * ```ts
   * expectRedisResult(result).toHaveContent();
   * ```
   */
  toHaveContent(): this;

  /**
   * Asserts that the array length equals the expected value.
   *
   * @param expected - The expected array length
   * @example
   * ```ts
   * expectRedisResult(result).toHaveLength(3);
   * ```
   */
  toHaveLength(expected: number): this;

  /**
   * Asserts that the array length is greater than or equal to the minimum value.
   *
   * @param min - The minimum array length (inclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveLengthGreaterThanOrEqual(1);
   * ```
   */
  toHaveLengthGreaterThanOrEqual(min: number): this;

  /**
   * Asserts that the array length is less than or equal to the maximum value.
   *
   * @param max - The maximum array length (inclusive)
   * @example
   * ```ts
   * expectRedisResult(result).toHaveLengthLessThanOrEqual(100);
   * ```
   */
  toHaveLengthLessThanOrEqual(max: number): this;

  /**
   * Asserts that the array contains the specified item.
   *
   * @param item - The item to check for
   * @example
   * ```ts
   * expectRedisResult(result).toContain("myItem");
   * expectRedisResult(result).toContain("value1").toContain("value2");
   * ```
   */
  toContain(item: T): this;
}

export function expectRedisArrayResult<T>(
  result: RedisArrayResult<T>,
  negate = false,
): RedisArrayResultExpectation<T> {
  const base = expectRedisResultBase(result, negate);

  const self: RedisArrayResultExpectation<T> = {
    get not(): RedisArrayResultExpectation<T> {
      return expectRedisArrayResult(result, !negate);
    },

    toBeSuccessful() {
      base.toBeSuccessful();
      return this;
    },

    toHaveData(expected: readonly T[]) {
      base.toHaveData(expected);
      return this;
    },

    toSatisfy(matcher: (value: readonly T[]) => void) {
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

    toHaveContent() {
      const hasContent = result.value.length > 0;
      if (negate ? hasContent : !hasContent) {
        throw new Error(
          negate
            ? `Expected empty array, got ${result.value.length} items`
            : "Expected non-empty array, but array is empty",
        );
      }
      return this;
    },

    toHaveLength(expected: number) {
      const match = result.value.length === expected;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected array count to not be ${expected}, got ${result.value.length}`
            : buildCountError(expected, result.value.length, "array count"),
        );
      }
      return this;
    },

    toHaveLengthGreaterThanOrEqual(min: number) {
      const match = result.value.length >= min;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected array count to not be >= ${min}, got ${result.value.length}`
            : buildCountAtLeastError(min, result.value.length, "array count"),
        );
      }
      return this;
    },

    toHaveLengthLessThanOrEqual(max: number) {
      const match = result.value.length <= max;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected array count to not be <= ${max}, got ${result.value.length}`
            : buildCountAtMostError(max, result.value.length, "array count"),
        );
      }
      return this;
    },

    toContain(item: T) {
      const found = result.value.includes(item);
      if (negate ? found : !found) {
        throw new Error(
          negate
            ? `Expected array to not contain ${JSON.stringify(item)}`
            : `Expected array to contain ${JSON.stringify(item)}`,
        );
      }
      return this;
    },
  };

  return self;
}
