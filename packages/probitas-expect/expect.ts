/**
 * Unified expect function that dispatches to the appropriate expectation function
 * based on the type of the input object.
 *
 * @module
 */

import {
  type ConnectRpcResponseExpectation,
  expectConnectRpcResponse,
} from "./connectrpc.ts";
import { type DenoKvExpectation, expectDenoKvResult } from "./deno_kv.ts";
import {
  expectGraphqlResponse,
  type GraphqlResponseExpectation,
} from "./graphql.ts";
import { expectHttpResponse, type HttpResponseExpectation } from "./http.ts";
import { expectMongoResult, type MongoExpectation } from "./mongodb.ts";
import { expectRabbitMqResult, type RabbitMqExpectation } from "./rabbitmq.ts";
import { expectRedisResult, type RedisExpectation } from "./redis.ts";
import { expectSqlQueryResult, type SqlQueryResultExpectation } from "./sql.ts";
import { expectSqsResult, type SqsExpectation } from "./sqs.ts";
import { type AnythingExpectation, expectAnything } from "./anything.ts";

import type { ConnectRpcResponse } from "@probitas/client-connectrpc";
import type { DenoKvResult } from "@probitas/client-deno-kv";
import type { GraphqlResponse } from "@probitas/client-graphql";
import type { HttpResponse } from "@probitas/client-http";
import type { MongoResult } from "@probitas/client-mongodb";
import type { RabbitMqResult } from "@probitas/client-rabbitmq";
import type { RedisResult } from "@probitas/client-redis";
import type { SqlQueryResult } from "@probitas/client-sql";
import type { SqsResult } from "@probitas/client-sqs";

/**
 * Type guard for objects with a `kind` property
 */
function hasKind(value: unknown): value is { kind: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    typeof (value as { kind: unknown }).kind === "string"
  );
}

/**
 * Unified expect function that dispatches to the appropriate expectation function
 * based on the type of the input object.
 *
 * @example
 * ```ts
 * import { expect } from "./expect.ts";
 *
 * // Falls back to expectAnything (chainable @std/expect) for other values
 * expect(42).toBe(42).toBeGreaterThan(40);
 * expect("hello world").toContain("world");
 * expect({ a: 1, b: 2 }).toMatchObject({ a: 1 });
 * ```
 */
export function expect<T extends HttpResponse>(
  value: T,
): HttpResponseExpectation;
export function expect<T extends ConnectRpcResponse>(
  value: T,
): ConnectRpcResponseExpectation;
export function expect<T extends GraphqlResponse>(
  value: T,
): GraphqlResponseExpectation;
export function expect<T extends SqlQueryResult>(
  value: T,
): SqlQueryResultExpectation;
export function expect<T extends DenoKvResult>(
  value: T,
): DenoKvExpectation<T>;
export function expect<T extends RedisResult>(
  value: T,
): RedisExpectation<T>;
export function expect<T extends MongoResult>(
  value: T,
): MongoExpectation<T>;
export function expect<T extends RabbitMqResult>(
  value: T,
): RabbitMqExpectation<T>;
export function expect<T extends SqsResult>(
  value: T,
): SqsExpectation<T>;
export function expect(value: unknown): AnythingExpectation;
export function expect(value: unknown): unknown {
  if (hasKind(value)) {
    const { kind } = value;

    // Exact kind matches
    if (kind === "http") {
      return expectHttpResponse(value as unknown as HttpResponse);
    }
    if (kind === "connectrpc") {
      return expectConnectRpcResponse(value as unknown as ConnectRpcResponse);
    }
    if (kind === "graphql") {
      return expectGraphqlResponse(value as unknown as GraphqlResponse);
    }
    if (kind === "sql") {
      return expectSqlQueryResult(value as unknown as SqlQueryResult);
    }

    // Prefix-based kind matches
    if (kind.startsWith("deno-kv:")) {
      return expectDenoKvResult(value as unknown as DenoKvResult);
    }
    if (kind.startsWith("redis:")) {
      return expectRedisResult(value as unknown as RedisResult);
    }
    if (kind.startsWith("mongo:")) {
      return expectMongoResult(value as unknown as MongoResult);
    }
    if (kind.startsWith("rabbitmq:")) {
      return expectRabbitMqResult(value as unknown as RabbitMqResult);
    }
    if (kind.startsWith("sqs:")) {
      return expectSqsResult(value as unknown as SqsResult);
    }
  }

  // Fallback to expectAnything (chainable @std/expect wrapper)
  return expectAnything(value);
}
