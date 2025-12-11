import type {
  RedisArrayResult,
  RedisCountResult,
  RedisGetResult,
} from "@probitas/client-redis";

export const mockRedisGetResult = (
  overrides: Partial<RedisGetResult> = {},
): RedisGetResult => ({
  type: "redis:get" as const,
  ok: true,
  value: "test-value",
  duration: 100,
  ...overrides,
});

export const mockRedisCountResult = (
  overrides: Partial<RedisCountResult> = {},
): RedisCountResult => ({
  type: "redis:count" as const,
  ok: true,
  value: 5,
  duration: 100,
  ...overrides,
});

export const mockRedisArrayResult = <T>(
  overrides: Partial<RedisArrayResult<T>> = {},
): RedisArrayResult<T> => ({
  type: "redis:array" as const,
  ok: true,
  value: [] as readonly T[],
  duration: 100,
  ...overrides,
});
