import type {
  MongoCountResult,
  MongoDeleteResult,
  MongoDocs,
  MongoFindOneResult,
  MongoFindResult,
  MongoInsertManyResult,
  MongoInsertOneResult,
  MongoUpdateResult,
} from "@probitas/client-mongodb";

// Helper to create MongoDocs (array with helper methods)
export function createMockMongoDocs<T>(docs: T[]): MongoDocs<T> {
  const arr = [...docs] as T[] & {
    first(): T | undefined;
    firstOrThrow(): T;
    last(): T | undefined;
    lastOrThrow(): T;
  };
  arr.first = function () {
    return this[0];
  };
  arr.firstOrThrow = function () {
    if (this.length === 0) throw new Error("No documents available");
    return this[0];
  };
  arr.last = function () {
    return this[this.length - 1];
  };
  arr.lastOrThrow = function () {
    if (this.length === 0) throw new Error("No documents available");
    return this[this.length - 1];
  };
  return arr as unknown as MongoDocs<T>;
}

export const mockMongoFindResult = <T>(
  overrides: Partial<Omit<MongoFindResult<T>, "docs">> & { docs?: T[] } = {},
): MongoFindResult<T> => {
  const { docs: rawDocs, ...rest } = overrides;
  const defaultDocs: T[] = [{ id: "1", name: "Alice" }] as T[];
  return {
    kind: "mongo:find" as const,
    processed: true,
    ok: true,
    error: null,
    docs: createMockMongoDocs(rawDocs ?? defaultDocs),
    duration: 100,
    ...rest,
  };
};

export const mockMongoInsertOneResult = (
  overrides: Partial<MongoInsertOneResult> = {},
): MongoInsertOneResult => ({
  kind: "mongo:insert-one" as const,
  processed: true,
  ok: true,
  error: null,
  insertedId: "123",
  duration: 100,
  ...overrides,
});

export const mockMongoInsertManyResult = (
  overrides: Partial<MongoInsertManyResult> = {},
): MongoInsertManyResult => ({
  kind: "mongo:insert-many" as const,
  processed: true,
  ok: true,
  error: null,
  insertedIds: ["123", "456", "789"],
  insertedCount: 3,
  duration: 100,
  ...overrides,
});

export const mockMongoUpdateResult = (
  overrides: Partial<MongoUpdateResult> = {},
): MongoUpdateResult => ({
  kind: "mongo:update" as const,
  processed: true,
  ok: true,
  error: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedId: undefined,
  duration: 100,
  ...overrides,
});

export const mockMongoDeleteResult = (
  overrides: Partial<MongoDeleteResult> = {},
): MongoDeleteResult => ({
  kind: "mongo:delete" as const,
  processed: true,
  ok: true,
  error: null,
  deletedCount: 1,
  duration: 100,
  ...overrides,
});

export const mockMongoFindOneResult = <T>(
  overrides: Partial<MongoFindOneResult<T>> = {},
): MongoFindOneResult<T> => ({
  kind: "mongo:find-one" as const,
  processed: true,
  ok: true,
  error: null,
  doc: { id: "1", name: "Alice" } as T,
  duration: 100,
  ...overrides,
});

export const mockMongoCountResult = (
  overrides: Partial<MongoCountResult> = {},
): MongoCountResult => ({
  kind: "mongo:count" as const,
  processed: true,
  ok: true,
  error: null,
  count: 10,
  duration: 100,
  ...overrides,
});
