import type {
  MongoCountResult,
  MongoDeleteResult,
  MongoFindOneResult,
  MongoFindResult,
  MongoInsertManyResult,
  MongoInsertOneResult,
  MongoResult,
  MongoUpdateResult,
} from "@probitas/client-mongodb";
import {
  expectMongoFindResult,
  type MongoFindResultExpectation,
} from "./mongodb/find.ts";
import {
  expectMongoInsertOneResult,
  type MongoInsertOneResultExpectation,
} from "./mongodb/insert_one.ts";
import {
  expectMongoInsertManyResult,
  type MongoInsertManyResultExpectation,
} from "./mongodb/insert_many.ts";
import {
  expectMongoUpdateResult,
  type MongoUpdateResultExpectation,
} from "./mongodb/update.ts";
import {
  expectMongoDeleteResult,
  type MongoDeleteResultExpectation,
} from "./mongodb/delete.ts";
import {
  expectMongoFindOneResult,
  type MongoFindOneResultExpectation,
} from "./mongodb/find_one.ts";
import {
  expectMongoCountResult,
  type MongoCountResultExpectation,
} from "./mongodb/count.ts";

// Re-export interfaces
export type {
  MongoCountResultExpectation,
  MongoDeleteResultExpectation,
  MongoFindOneResultExpectation,
  MongoFindResultExpectation,
  MongoInsertManyResultExpectation,
  MongoInsertOneResultExpectation,
  MongoUpdateResultExpectation,
};

/**
 * Expectation type returned by expectMongoResult based on the result type.
 */
export type MongoExpectation<R extends MongoResult> = R extends
  MongoFindResult<infer T> ? MongoFindResultExpectation<T>
  : R extends MongoInsertOneResult ? MongoInsertOneResultExpectation
  : R extends MongoInsertManyResult ? MongoInsertManyResultExpectation
  : R extends MongoUpdateResult ? MongoUpdateResultExpectation
  : R extends MongoDeleteResult ? MongoDeleteResultExpectation
  : R extends MongoFindOneResult<infer T> ? MongoFindOneResultExpectation<T>
  : R extends MongoCountResult ? MongoCountResultExpectation
  : never;

/**
 * Create a fluent expectation chain for any MongoDB result validation.
 *
 * This unified function accepts any MongoDB result type and returns
 * the appropriate expectation interface based on the result's type discriminator.
 *
 * @example
 * ```ts
 * // For find result - returns MongoFindResultExpectation
 * const findResult = await users.find({ age: { $gte: 30 } });
 * expectMongoResult(findResult).toBeOk().toHaveContent().toHaveLength(2);
 *
 * // For insert result - returns MongoInsertResultExpectation
 * const insertResult = await users.insertOne({ name: "Alice", age: 30 });
 * expectMongoResult(insertResult).toBeOk().toHaveInsertedId();
 *
 * // For update result - returns MongoUpdateResultExpectation
 * const updateResult = await users.updateOne({ name: "Alice" }, { $set: { age: 31 } });
 * expectMongoResult(updateResult).toBeOk().toHaveMatchedCount(1).toHaveModifiedCount(1);
 *
 * // For delete result - returns MongoDeleteResultExpectation
 * const deleteResult = await users.deleteOne({ name: "Alice" });
 * expectMongoResult(deleteResult).toBeOk().toHaveDeletedCount(1);
 *
 * // For findOne result - returns MongoFindOneResultExpectation
 * const findOneResult = await users.findOne({ name: "Alice" });
 * expectMongoResult(findOneResult).toBeOk().toHaveContent().toMatchObject({ name: "Alice" });
 *
 * // For count result - returns MongoCountResultExpectation
 * const countResult = await users.countDocuments();
 * expectMongoResult(countResult).toBeOk().toHaveLength(10);
 * ```
 */
// deno-lint-ignore no-explicit-any
export function expectMongoResult<R extends MongoResult<any>>(
  result: R,
): MongoExpectation<R> {
  switch (result.kind) {
    case "mongo:find":
      return expectMongoFindResult(
        result as MongoFindResult,
      ) as unknown as MongoExpectation<R>;
    case "mongo:insert-one":
      return expectMongoInsertOneResult(
        result as MongoInsertOneResult,
      ) as unknown as MongoExpectation<R>;
    case "mongo:insert-many":
      return expectMongoInsertManyResult(
        result as MongoInsertManyResult,
      ) as unknown as MongoExpectation<R>;
    case "mongo:update":
      return expectMongoUpdateResult(
        result as MongoUpdateResult,
      ) as unknown as MongoExpectation<R>;
    case "mongo:delete":
      return expectMongoDeleteResult(
        result as MongoDeleteResult,
      ) as unknown as MongoExpectation<R>;
    case "mongo:find-one":
      return expectMongoFindOneResult(
        result as MongoFindOneResult,
      ) as unknown as MongoExpectation<R>;
    case "mongo:count":
      return expectMongoCountResult(
        result as MongoCountResult,
      ) as unknown as MongoExpectation<R>;
    default:
      throw new Error(
        `Unknown MongoDB result kind: ${(result as { kind: string }).kind}`,
      );
  }
}
