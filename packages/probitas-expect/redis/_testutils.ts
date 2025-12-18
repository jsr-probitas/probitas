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
  processed: true,
  ok: true,
  error: null,
  value: "test-value",
  duration: 100,
  ...overrides,
});

export const mockRedisSetResult = (
  overrides: Partial<RedisSetResult> = {},
): RedisSetResult => ({
  kind: "redis:set" as const,
  processed: true,
  ok: true,
  error: null,
  value: "OK" as const,
  duration: 100,
  ...overrides,
});

export const mockRedisCountResult = (
  overrides: Partial<RedisCountResult> = {},
): RedisCountResult => ({
  kind: "redis:count" as const,
  processed: true,
  ok: true,
  error: null,
  value: 5,
  duration: 100,
  ...overrides,
});

export const mockRedisArrayResult = <T>(
  overrides: Partial<RedisArrayResult<T>> = {},
): RedisArrayResult<T> => ({
  kind: "redis:array" as const,
  processed: true,
  ok: true,
  error: null,
  value: [] as readonly T[],
  duration: 100,
  ...overrides,
});

export const mockRedisHashResult = (
  overrides: Partial<RedisHashResult> = {},
): RedisHashResult => ({
  kind: "redis:hash" as const,
  processed: true,
  ok: true,
  error: null,
  value: { field1: "value1", field2: "value2" },
  duration: 100,
  ...overrides,
});

export const mockRedisCommonResult = <T>(
  overrides: Partial<RedisCommonResult<T>> = {},
): RedisCommonResult<T> => ({
  kind: "redis:common" as const,
  processed: true,
  ok: true,
  error: null,
  value: null as T,
  duration: 100,
  ...overrides,
});
