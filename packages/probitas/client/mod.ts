/**
 * Pre-configured client factories for common external services.
 *
 * This module provides convenient wrappers around popular client libraries,
 * pre-configured for testing scenarios with sensible defaults.
 *
 * ## Available Clients
 *
 * | Client | Description | Usage |
 * |--------|-------------|-------|
 * | {@linkcode http} | HTTP/REST API client | `client.http({ baseUrl: "..." })` |
 * | {@linkcode graphql} | GraphQL client | `client.graphql({ endpoint: "..." })` |
 * | {@linkcode grpc} | gRPC client | `client.grpc({ ... })` |
 * | {@linkcode connectrpc} | Connect-RPC client | `client.connectrpc({ ... })` |
 * | {@linkcode mongodb} | MongoDB client | `client.mongodb({ uri: "..." })` |
 * | {@linkcode redis} | Redis client | `client.redis({ ... })` |
 * | {@linkcode sql} | SQL database client | `client.sql.postgres({ ... })` |
 * | {@linkcode rabbitmq} | RabbitMQ client | `client.rabbitmq({ ... })` |
 * | {@linkcode sqs} | AWS SQS client | `client.sqs({ ... })` |
 * | {@linkcode deno_kv} | Deno KV client | `client.deno_kv()` |
 *
 * @example HTTP client usage
 * ```ts
 * import { scenario, client, expect } from "@probitas/probitas";
 *
 * const api = client.http({ baseUrl: "https://api.example.com" });
 *
 * export default scenario("API Test")
 *   .step("Fetch users", async () => {
 *     const response = await api.get("/users");
 *     expect(response.status).toBe(200);
 *     return response.json();
 *   })
 *   .build();
 * ```
 *
 * @example MongoDB client usage
 * ```ts
 * import { scenario, client } from "@probitas/probitas";
 *
 * export default scenario("Database Test")
 *   .resource("db", async () => {
 *     return await client.mongodb({ uri: process.env.MONGO_URI });
 *   })
 *   .step("Query data", async (ctx) => {
 *     const users = await ctx.resources.db.collection("users").find().toArray();
 *     return { count: users.length };
 *   })
 *   .build();
 * ```
 *
 * @module
 */

import * as connectrpc from "./connectrpc.ts";
import * as deno_kv from "./deno_kv.ts";
import * as graphql from "./graphql.ts";
import * as grpc from "./grpc.ts";
import * as http from "./http.ts";
import * as mongodb from "./mongodb.ts";
import * as rabbitmq from "./rabbitmq.ts";
import * as redis from "./redis.ts";
import * as sql from "./sql/mod.ts";
import * as sqs from "./sqs.ts";

export {
  /** Connect-RPC client for type-safe RPC communication */
  connectrpc,
  /** Deno KV client for key-value storage */
  deno_kv,
  /** GraphQL client for query/mutation operations */
  graphql,
  /** gRPC client for RPC communication */
  grpc,
  /** HTTP client for REST API testing */
  http,
  /** MongoDB client for document database operations */
  mongodb,
  /** RabbitMQ client for message queue operations */
  rabbitmq,
  /** Redis client for cache and pub/sub operations */
  redis,
  /** SQL clients for relational databases (postgres, mysql, sqlite) */
  sql,
  /** AWS SQS client for queue operations */
  sqs,
};
