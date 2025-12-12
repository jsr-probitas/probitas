import type {
  RedisArrayResult,
  RedisCommonResult,
  RedisCountResult,
  RedisGetResult,
  RedisHashResult,
  RedisSetResult,
} from "@probitas/client-redis";

export const mockRedisGetResult = (
  overrides: Partial<RedisGetResult> = {},
): RedisGetResult => ({
  kind: "redis:get" as const,
  ok: true,
  value: "test-value",
  duration: 100,
  ...overrides,
});

export const mockRedisSetResult = (
  overrides: Partial<RedisSetResult> = {},
): RedisSetResult => ({
  kind: "redis:set" as const,
  ok: true,
  value: "OK" as const,
  duration: 100,
  ...overrides,
});

export const mockRedisCountResult = (
  overrides: Partial<RedisCountResult> = {},
): RedisCountResult => ({
  kind: "redis:count" as const,
  ok: true,
  value: 5,
  duration: 100,
  ...overrides,
});

export const mockRedisArrayResult = <T>(
  overrides: Partial<RedisArrayResult<T>> = {},
): RedisArrayResult<T> => ({
  kind: "redis:array" as const,
  ok: true,
  value: [] as readonly T[],
  duration: 100,
  ...overrides,
});

export const mockRedisHashResult = (
  overrides: Partial<RedisHashResult> = {},
): RedisHashResult => ({
  kind: "redis:hash" as const,
  ok: true,
  value: { field1: "value1", field2: "value2" },
  duration: 100,
  ...overrides,
});

export const mockRedisCommonResult = <T>(
  overrides: Partial<RedisCommonResult<T>> = {},
): RedisCommonResult<T> => ({
  kind: "redis:common" as const,
  ok: true,
  value: null as T,
  duration: 100,
  ...overrides,
});
