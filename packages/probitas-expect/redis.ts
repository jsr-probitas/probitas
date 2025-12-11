import type {
  RedisArrayResult,
  RedisCommonResult,
  RedisCountResult,
  RedisGetResult,
  RedisHashResult,
  RedisResult,
  RedisSetResult,
} from "@probitas/client-redis";
import {
  expectRedisResultBase,
  type RedisResultExpectation,
} from "./redis/result.ts";
import {
  expectRedisCountResult,
  type RedisCountResultExpectation,
} from "./redis/count.ts";
import {
  expectRedisArrayResult,
  type RedisArrayResultExpectation,
} from "./redis/array.ts";

// Re-export interfaces
export type {
  RedisArrayResultExpectation,
  RedisCountResultExpectation,
  RedisResultExpectation,
};

/**
 * Expectation type returned by expectRedisResult based on the result type.
 */
export type RedisExpectation<R extends RedisResult> = R extends RedisCountResult
  ? RedisCountResultExpectation
  : R extends RedisArrayResult<infer T> ? RedisArrayResultExpectation<T>
  : R extends RedisGetResult ? RedisResultExpectation<string | null>
  : R extends RedisSetResult ? RedisResultExpectation<"OK">
  : R extends RedisHashResult ? RedisResultExpectation<Record<string, string>>
  : R extends RedisCommonResult<infer T> ? RedisResultExpectation<T>
  : never;

/**
 * Create a fluent expectation chain for any Redis result validation.
 *
 * This unified function accepts any Redis result type and returns
 * the appropriate expectation interface based on the result's type discriminator.
 *
 * @example
 * ```ts
 * // For GET result - returns RedisResultExpectation<string | null>
 * const getResult = await client.get("key");
 * expectRedisResult(getResult).toBeSuccessful().toHaveValue("expected");
 *
 * // For COUNT result - returns RedisCountResultExpectation
 * const countResult = await client.del("key");
 * expectRedisResult(countResult).toBeSuccessful().toHaveCount(1);
 *
 * // For ARRAY result - returns RedisArrayResultExpectation
 * const arrayResult = await client.lrange("list", 0, -1);
 * expectRedisResult(arrayResult).toBeSuccessful().toHaveLength(3).toContain("item");
 * ```
 */
// deno-lint-ignore no-explicit-any
export function expectRedisResult<R extends RedisResult<any>>(
  result: R,
): RedisExpectation<R> {
  switch (result.type) {
    case "redis:count":
      return expectRedisCountResult(
        result as RedisCountResult,
      ) as unknown as RedisExpectation<R>;
    case "redis:array":
      return expectRedisArrayResult(
        // deno-lint-ignore no-explicit-any
        result as RedisArrayResult<any>,
      ) as unknown as RedisExpectation<R>;
    case "redis:get":
    case "redis:set":
    case "redis:hash":
    case "redis:common":
      return expectRedisResultBase(
        result,
      ) as unknown as RedisExpectation<R>;
    default:
      throw new Error(
        `Unknown Redis result type: ${(result as { type: string }).type}`,
      );
  }
}
