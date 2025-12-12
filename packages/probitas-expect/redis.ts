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
  expectRedisCountResult,
  type RedisCountResultExpectation,
} from "./redis/count.ts";
import {
  expectRedisArrayResult,
  type RedisArrayResultExpectation,
} from "./redis/array.ts";
import {
  expectRedisGetResult,
  type RedisGetResultExpectation,
} from "./redis/get.ts";
import {
  expectRedisSetResult,
  type RedisSetResultExpectation,
} from "./redis/set.ts";
import {
  expectRedisCommonResult,
  type RedisCommonResultExpectation,
} from "./redis/common.ts";
import {
  expectRedisHashResult,
  type RedisHashResultExpectation,
} from "./redis/hash.ts";

// Re-export interfaces
export type {
  RedisArrayResultExpectation,
  RedisCommonResultExpectation,
  RedisCountResultExpectation,
  RedisGetResultExpectation,
  RedisHashResultExpectation,
  RedisSetResultExpectation,
};

/**
 * Expectation type returned by expectRedisResult based on the result type.
 */
export type RedisExpectation<R extends RedisResult> = R extends RedisCountResult
  ? RedisCountResultExpectation
  : R extends RedisArrayResult ? RedisArrayResultExpectation
  : R extends RedisGetResult ? RedisGetResultExpectation
  : R extends RedisSetResult ? RedisSetResultExpectation
  : R extends RedisHashResult ? RedisHashResultExpectation
  : R extends RedisCommonResult ? RedisCommonResultExpectation
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
 * expectRedisResult(getResult).toBeOk().toHaveValue("expected");
 *
 * // For COUNT result - returns RedisCountResultExpectation
 * const countResult = await client.del("key");
 * expectRedisResult(countResult).toBeOk().toHaveCount(1);
 *
 * // For ARRAY result - returns RedisArrayResultExpectation
 * const arrayResult = await client.lrange("list", 0, -1);
 * expectRedisResult(arrayResult).toBeOk().toHaveLength(3).toContain("item");
 * ```
 */
// deno-lint-ignore no-explicit-any
export function expectRedisResult<R extends RedisResult<any>>(
  result: R,
): RedisExpectation<R> {
  switch (result.kind) {
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
      return expectRedisGetResult(
        result as RedisGetResult,
      ) as unknown as RedisExpectation<R>;
    case "redis:set":
      return expectRedisSetResult(
        result as RedisSetResult,
      ) as unknown as RedisExpectation<R>;
    case "redis:hash":
      return expectRedisHashResult(
        result as RedisHashResult,
      ) as unknown as RedisExpectation<R>;
    case "redis:common":
      return expectRedisCommonResult(
        result as RedisCommonResult<unknown>,
      ) as unknown as RedisExpectation<R>;
    default:
      throw new Error(
        `Unknown Redis result kind: ${(result as { kind: string }).kind}`,
      );
  }
}
