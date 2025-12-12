# Migration Guide from 0.4.0 to 0.5.0

This guide helps you migrate from Probitas 0.4.0 to 0.5.0, which includes a
complete overhaul of the expectation API using a composable mixin-based
architecture.

## Breaking Changes Overview

Version 0.5.0 introduces a fundamental architectural shift from focused,
hand-coded assertion methods to a comprehensive property-based mixin system.
This change provides:

- **Consistency**: Uniform `toHave<Property><Assertion>()` naming across all
  modules
- **Completeness**: Every property automatically gets a full suite of assertions
  (equality, comparisons, nullish checks, custom matchers)
- **Type Safety**: Improved IDE autocomplete with dedicated expectation types
- **Composability**: ~2000 lines of duplicated code replaced with reusable
  mixins

## API Philosophy Shift

**FROM**: Focused methods targeting specific use cases

**TO**: Property-based mixins providing comprehensive access to all properties

### Example: HTTP Response

**Before (0.4.0):**

```typescript
expectHttpResponse(response)
  .toHaveHeader("x-request-id")
  .toMatchObject({ status: "ok" });
```

**After (0.5.0):**

```typescript
expectHttpResponse(response)
  .toHaveHeadersProperty("x-request-id")
  .toHaveDataMatching({ status: "ok" });
```

## Core Breaking Changes

### 1. Method Renaming

All modules have renamed the success check method:

| Old Method (0.4.0) | New Method (0.5.0) |
| ------------------ | ------------------ |
| `toBeSuccessful()` | `toBeOk()`         |

**Before (0.4.0):**

```typescript
expectHttpResponse(response).toBeSuccessful();
expectGraphqlResponse(response).toBeSuccessful();
expectSqlQueryResult(result).toBeSuccessful();
```

**After (0.5.0):**

```typescript
expectHttpResponse(response).toBeOk();
expectGraphqlResponse(response).toBeOk();
expectSqlQueryResult(result).toBeOk();
```

### 2. Result Discrimination Field

The discriminator field has changed across all client types:

| Old Field (0.4.0) | New Field (0.5.0) |
| ----------------- | ----------------- |
| `result.type`     | `result.kind`     |

This affects all client result types: HTTP, GraphQL, SQL, Redis, MongoDB, Deno
KV, RabbitMQ, SQS.

## HTTP Response Expectations

**Version Change:** 19 methods → 92 methods (7 continue, 12 changed, 85 added)

### Key Changes

| 0.4.0 Method             | 0.5.0 Equivalent                             |
| ------------------------ | -------------------------------------------- |
| `toBeSuccessful()`       | `toBeOk()`                                   |
| `toHaveContent()`        | `toHaveDataPresent()`                        |
| `toMatchObject(...)`     | `toHaveDataMatching(...)`                    |
| `toHaveHeader(name)`     | `toHaveHeadersProperty(name)`                |
| `toHaveContentType(...)` | `toHaveHeadersProperty("content-type", ...)` |

### Continuing Methods

`toHaveDurationGreaterThan`, `toHaveDurationGreaterThanOrEqual`,
`toHaveDurationLessThan`, `toHaveDurationLessThanOrEqual`, `toHaveStatus`,
`toHaveStatusOneOf`, `toHaveTextContaining`

**See [complete tables](./migration-from-0.4.0-detailed-tables.md#http-client)
for all method mappings (including 85 new methods).**

### Migration Examples

**Before (0.4.0):**

```typescript
expectHttpResponse(response)
  .toBeSuccessful()
  .toHaveHeader("x-request-id")
  .toHaveContentType("application/json")
  .toMatchObject({ status: "ok", data: { id: 123 } });
```

**After (0.5.0):**

```typescript
expectHttpResponse(response)
  .toBeOk()
  .toHaveHeadersProperty("x-request-id")
  .toHaveHeadersProperty("content-type", "application/json")
  .toHaveDataMatching({ status: "ok", data: { id: 123 } });
```

## GraphQL Response Expectations

**Version Change:** 18 methods → 76 methods (11 continue, 7 changed, 65 added)

### Key Changes

| 0.4.0 Method            | 0.5.0 Equivalent                 |
| ----------------------- | -------------------------------- |
| `toBeSuccessful()`      | `toBeOk()`                       |
| `toHaveContent()`       | `toHaveDataPresent()`            |
| `toHaveError()`         | `toHaveErrorsPresent()`          |
| `toHaveExtension(name)` | `toHaveExtensionsProperty(name)` |

### Continuing Methods

`toHaveDurationGreaterThan`, `toHaveDurationGreaterThanOrEqual`,
`toHaveDurationLessThan`, `toHaveDurationLessThanOrEqual`, `toHaveErrorCount`,
`toHaveErrorCountGreaterThan`, `toHaveErrorCountGreaterThanOrEqual`,
`toHaveErrorCountLessThan`, `toHaveErrorCountLessThanOrEqual`, `toHaveStatus`,
`toHaveStatusOneOf`

**See
[complete tables](./migration-from-0.4.0-detailed-tables.md#graphql-client) for
all method mappings (including 65 new methods).**

## SQL Query Result Expectations

**Version Change:** 15 methods → 49 methods (8 continue, 7 changed, 41 added)

### Key Changes

| 0.4.0 Method         | 0.5.0 Equivalent          |
| -------------------- | ------------------------- |
| `toBeSuccessful()`   | `toBeOk()`                |
| `toHaveContent()`    | `toHaveRowsPresent()`     |
| `toHaveLength(...)`  | `toHaveRowsCount(...)`    |
| `toMatchObject(...)` | `toHaveRowsMatching(...)` |

### Continuing Methods

`toHaveDurationGreaterThan`, `toHaveDurationGreaterThanOrEqual`,
`toHaveDurationLessThan`, `toHaveDurationLessThanOrEqual`, `toHaveLastInsertId`,
`toHaveRowCount`, `toHaveRowCountGreaterThanOrEqual`,
`toHaveRowCountLessThanOrEqual`

**See [complete tables](./migration-from-0.4.0-detailed-tables.md#sql-client)
for all method mappings (including 41 new methods).**

## MongoDB Result Expectations

**Version Change:** 33 methods → 115 methods (26 continue, 7 changed, 89 added)

### Key Changes

| 0.4.0 Method         | 0.5.0 Equivalent                                     |
| -------------------- | ---------------------------------------------------- |
| `toBeSuccessful()`   | `toBeOk()`                                           |
| `toHaveContent()`    | `toHaveDocsPresent()` / `toHaveDocPresent()`         |
| `toHaveLength(...)`  | `toHaveDocsCount(...)`                               |
| `toMatchObject(...)` | `toHaveDocsMatching(...)` / `toHaveDocMatching(...)` |

### Continuing Methods

All count-related methods continue with the same name: `toHaveDeletedCount*`,
`toHaveDurationGreaterThan*`, `toHaveInsertedCount*`, `toHaveInsertedId`,
`toHaveMatchedCount*`, `toHaveModifiedCount*`, `toHaveUpsertedId`

**See
[complete tables](./migration-from-0.4.0-detailed-tables.md#mongodb-client) for
all method mappings (including 89 new methods).**

## Redis Result Expectations

**Version Change:** 12 methods → 42 methods (4 continue, 8 changed, 38 added)

### Key Changes

| 0.4.0 Method        | 0.5.0 Equivalent             |
| ------------------- | ---------------------------- |
| `toBeSuccessful()`  | `toBeOk()`                   |
| `toHaveContent()`   | `toHaveValuePresent()`       |
| `toHaveData(...)`   | `toHaveValue(...)`           |
| `toContain(...)`    | `toHaveValueContaining(...)` |
| `toHaveLength(...)` | `toHaveValueCount(...)`      |
| `toSatisfy(...)`    | `toHaveValueSatisfying(...)` |

### Continuing Methods

`toHaveDurationGreaterThan`, `toHaveDurationGreaterThanOrEqual`,
`toHaveDurationLessThan`, `toHaveDurationLessThanOrEqual`

**See [complete tables](./migration-from-0.4.0-detailed-tables.md#redis-client)
for all method mappings (including 38 new methods).**

## RabbitMQ Result Expectations

**Version Change:** 21 methods → 67 methods (15 continue, 4 changed, 2 removed,
52 added)

### Key Changes

| 0.4.0 Method                    | 0.5.0 Equivalent                       |
| ------------------------------- | -------------------------------------- |
| `toBeSuccessful()`              | `toBeOk()`                             |
| `toHaveBodyContaining(...)`     | `toHaveContentSatisfying(...)`         |
| `toHavePropertyContaining(...)` | `toHaveMessagePropertyContaining(...)` |
| `toSatisfy(...)`                | `toHaveMessageSatisfying(...)`         |

### Removed Methods

`toHaveExchange()`, `toHaveRoutingKey()`

### Continuing Methods

`toHaveContent`, `toHaveConsumerCount*`, `toHaveDurationGreaterThan*`,
`toHaveMessageCount*`

**See
[complete tables](./migration-from-0.4.0-detailed-tables.md#rabbitmq-client) for
all method mappings (including 52 new methods).**

## SQS Result Expectations

**Version Change:** 29 methods → 83 methods (17 continue, 8 changed, 4 removed,
66 added)

### Key Changes

| 0.4.0 Method                | 0.5.0 Equivalent                |
| --------------------------- | ------------------------------- |
| `toBeSuccessful()`          | `toBeOk()`                      |
| `toHaveContent()`           | `toHaveMessagesPresent()`       |
| `toHaveLength(...)`         | `toHaveMessagesCount(...)`      |
| `toHaveBodyContaining(...)` | `toHaveMessagesSatisfying(...)` |
| `toHaveBodyMatching(...)`   | `toHaveMessagesMatching(...)`   |
| `toMatchObject(...)`        | `toHaveMessagesMatching(...)`   |
| `toSatisfy(...)`            | `toHaveMessagesSatisfying(...)` |

### Removed Methods

`toBeAllSuccessful()`, `toHaveAttribute()`, `toHaveAttributesContaining()`

### Continuing Methods

`toHaveDurationGreaterThan*`, `toHaveFailedCount*`, `toHaveMessageId`,
`toHaveQueueUrl`, `toHaveQueueUrlContaining`, `toHaveSuccessfulCount*`

**See [complete tables](./migration-from-0.4.0-detailed-tables.md#sqs-client)
for all method mappings (including 66 new methods).**

## Automated Migration

We recommend the following migration approach:

1. **Search and Replace** for common patterns:

   ```bash
   # Success checks
   find . -name "*.ts" -exec sed -i '' 's/\.toBeSuccessful()/.toBeOk()/g' {} +

   # HTTP headers (simple cases)
   find . -name "*.ts" -exec sed -i '' 's/\.toHaveHeader(\([^)]*\))/.toHaveHeadersProperty(\1)/g' {} +

   # HTTP content type
   find . -name "*.ts" -exec sed -i '' 's/\.toHaveContentType(\([^)]*\))/.toHaveHeadersProperty("content-type", \1)/g' {} +

   # Data matching
   find . -name "*.ts" -exec sed -i '' 's/\.toMatchObject(/.toHaveDataMatching(/g' {} +
   find . -name "*.ts" -exec sed -i '' 's/\.toSatisfy(/.toHaveDataSatisfying(/g' {} +
   ```

2. **Manual Review** for complex patterns requiring `Satisfying` callbacks:

   - `toHaveHeaderContaining()` → custom `toHaveHeadersPropertySatisfying()`
   - `toHaveBodyContaining()` → custom `toHaveBodySatisfying()`
   - Client-specific matcher functions

3. **Run Tests** to identify remaining incompatibilities

4. **Update Type Annotations** if using explicit expectation types

## Benefits of the New Architecture

### 1. Consistency Across All Properties

Every property now has a consistent set of assertions:

```typescript
// Status property (number)
.toHaveStatus(200)                    // Equality
.toHaveStatusGreaterThan(199)         // Comparison
.toHaveStatusSatisfying((s) => ...)   // Custom logic

// Headers property (object)
.toHaveHeadersProperty("x-id")        // Property existence
.toHaveHeadersPropertyContaining("x-id", "prefix")
.toHaveHeadersPropertySatisfying("x-id", (v) => ...)
```

### 2. Improved Discoverability

IDE autocomplete now groups methods by property:

- Type `toHaveStatus` → see all status-related assertions
- Type `toHaveData` → see all data-related assertions
- Type `toHaveHeaders` → see all header-related assertions

### 3. Reduced Code Duplication

The mixin architecture eliminates ~2000 lines of duplicated assertion logic
across different client types, making the codebase more maintainable.

### 4. Extensibility

Adding new client types or properties now requires minimal code - just compose
existing mixins rather than hand-coding each assertion.

## Getting Help

If you encounter migration challenges:

1. Check the [API documentation](https://jsr.io/@probitas/expect)
2. Review test files in `packages/probitas-expect/**/*_test.ts` for examples
3. Open an issue at https://github.com/probitas/probitas/issues
