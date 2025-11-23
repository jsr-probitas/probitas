# Builder Specification

The Builder layer provides a type-safe Fluent API for defining test scenarios.
It focuses solely on **definition** and does not execute tests.

## Overview

The Builder layer transforms user intent into immutable scenario definitions
that can be executed by the Runner layer. It achieves both compile-time type
checking and runtime flexibility.

## Core Responsibilities

- Transform user intent into scenario definitions executable by the Runner layer
- Build scenarios incrementally with type-safe Fluent API
- Automatically infer result types throughout the chain
- Generate immutable scenario definitions

## Interface

### scenario(name, options?)

Creates a new scenario builder instance.

```typescript
function scenario(
  name: string,
  options?: ScenarioOptions,
): ScenarioBuilder<unknown, readonly []>;
```

**Parameters**:

- `name` - Human-readable scenario name
- `options` - Optional configuration

**Returns**: `ScenarioBuilder` with empty result chain

### ScenarioBuilder<P, A>

Fluent Builder with generic type parameters:

- `P` - Result type of the previous step
- `A` - Tuple of all accumulated results

#### Methods

##### .step(name, fn, options?)

Adds a named step to the scenario.

```typescript
step<T>(
  name: string,
  fn: StepFunction<P, T, A>,
  options?: StepOptions
): ScenarioBuilder<T, readonly [...A, T]>
```

**Type Inference**:

- Input: `P` (previous result type)
- Output: New builder with `P = T` and `T` added to `A`

##### .step(fn, options?)

Adds an anonymous step (uses auto-generated name in "Step N" format, e.g., "Step
1", "Step 2").

```typescript
step<T>(
  fn: StepFunction<P, T, A>,
  options?: StepOptions
): ScenarioBuilder<T, readonly [...A, T]>
```

##### .build()

Finalizes and returns an immutable scenario definition.

```typescript
build(): ScenarioDefinition
```

**Returns**: Immutable object used by the Runner layer.

### Type Definitions

#### StepFunction<P, T, A>

Step function signature.

```typescript
type StepFunction<
  P = unknown, // Previous step result type
  T = unknown, // This step's return type
  A extends readonly unknown[] = readonly [], // Accumulated result tuple
> = (ctx: StepContext<P, A>) => T | Promise<T>;
```

#### StepContext<P, A>

Context available to each step.

```typescript
interface StepContext<P, A extends readonly unknown[]> {
  index: number; // Step index (0-based)
  previous: P; // Previous step result (typed)
  results: A; // All accumulated results (typed tuple)
  store: Map<string, unknown>; // Shared storage
  signal: AbortSignal; // Abort signal
}
```

### ScenarioOptions & StepOptions

During scenario building, all options are optional (using `Partial<>`). The
Builder applies defaults before passing to the Runner.

```typescript
type BuilderScenarioOptions = Partial<ScenarioOptions>;
type BuilderStepOptions = Partial<StepOptions>;
```

For complete option definitions with all fields, see
[Runner Specification - ScenarioOptions](./runner.md#scenariooptions) and
[Runner Specification - StepOptions](./runner.md#stepoptions).

## Usage Examples

### Basic Usage

```typescript
const definition = scenario("Example")
  .step("Get ID", () => 123)
  .step("Fetch", (ctx) => {
    ctx.previous; // number type
    return { name: "John" };
  })
  .step("Validate", (ctx) => {
    ctx.previous.name; // string type
    ctx.results[0]; // number type
    ctx.results[1]; // { name: string } type
  })
  .build();

// Pass to Runner for execution
const runner = new ScenarioRunner();
await runner.run([definition]);
```

### Type Inference Example

```typescript
const builder = scenario("Flow")
  .step("A", () => 1)
  // builder type: ScenarioBuilder<number, readonly [number]>

  .step("B", (ctx) => {
    console.log(`Step ${ctx.index + 1}`); // "Step 2"
    const prev: number = ctx.previous; // Inferred
    const [a]: readonly [number] = ctx.results; // Inferred
    return "hello";
  })
  // builder type: ScenarioBuilder<string, readonly [number, string]>

  .step("C", (ctx) => {
    console.log(`Step ${ctx.index + 1}`); // "Step 3"
    const prev: string = ctx.previous; // Inferred
    const [a, b]: readonly [number, string] = ctx.results; // Inferred
  });
// builder type: ScenarioBuilder<void, readonly [number, string, void]>
```

### With Setup/Teardown

```typescript
const definition = scenario("Database Test", {
  setup: async (ctx) => {
    const db = await connectDB();
    ctx.store.set("db", db);
  },
  teardown: async (ctx) => {
    const db = ctx.store.get("db");
    await db.close();
  }
})
  .step("Insert", async (ctx) => {
    const db = ctx.store.get("db");
    await db.insert(...);
  })
  .build();
```

### Conditional Skip

```typescript
const definition = scenario("Integration Test", {
  skip: () => !Deno.env.get("RUN_INTEGRATION"),
})
  .step("API Test", async () => {
    // Only runs when RUN_INTEGRATION is set
  })
  .build();
```

## Best Practices

### 1. Type Annotations (Optional)

The builder automatically infers types, but explicit annotations can be added:

```typescript
scenario("Example")
  .step("Get Number", (): number => 123)
  .step("Use Number", (ctx): string => {
    const n: number = ctx.previous;
    return n.toString();
  });
```

### 2. Extract Step Functions

For complex logic, extract step functions:

```typescript
const getUserId = (): number => {
  // Complex logic
  return 123;
};

const fetchUser = (ctx: StepContext<number, [number]>) => {
  return { id: ctx.previous, name: "John" };
};

scenario("User Flow")
  .step("Get ID", getUserId)
  .step("Fetch", fetchUser);
```

### 3. Shared Resource Management

Use setup/teardown to manage shared resources:

```typescript
const definition = scenario("Test", {
  setup: async (ctx) => {
    ctx.store.set("resource", await setupResource());
  },
  teardown: async (ctx) => {
    await cleanupResource(ctx.store.get("resource"));
  },
})
  .step("Use Resource", async (ctx) => {
    const resource = ctx.store.get("resource");
    // Use resource
  })
  .build();
```

### 4. Error Handling

The builder validates at compile time:

```typescript
const definition = scenario("Example")
  .step("Get Number", () => 123)
  .step("Use String", (ctx) => {
    ctx.previous.toUpperCase(); // ❌ Compile error: number doesn't have toUpperCase
  })
  .build();
```

Runtime errors occur in the Runner layer, not the Builder layer.

## Related Resources

- [Runner Specification](./runner.md) - Scenario execution
- [Architecture](./architecture.md) - Overall design
