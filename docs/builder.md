# Builder Layer

The Builder layer provides a type-safe fluent API for defining test scenarios.
It focuses solely on **definition** — it does not execute tests.

## Design Philosophy

### Separation of Definition and Execution

The Builder captures user intent as an immutable data structure. This separation
enables:

- Static analysis of scenario structure before execution
- Reuse of definitions across different runners
- Serialization of definitions for distributed execution

### Type-Safe Chaining

The fluent API uses TypeScript's type system to:

- Infer result types throughout the chain automatically
- Provide compile-time errors for type mismatches
- Enable IDE autocompletion for `ctx.previous` and `ctx.results`

### Immutable Builder Pattern

Each method returns a new builder instance, enabling:

- Branching from a common base to create variants
- Safe sharing of partial definitions
- Predictable behavior without side effects

## Core Concepts

### Scenario

A named test case with optional tags for filtering. Created via
`scenario(name, options?)`.

### Entry

An atomic unit within a scenario. Three types exist:

| Entry      | Purpose                           | Returns                        |
| ---------- | --------------------------------- | ------------------------------ |
| `step`     | Test logic, receives context      | Value for next step            |
| `resource` | Creates lifecycle-managed object  | Added to `ctx.resources`       |
| `setup`    | Side effect with optional cleanup | Cleanup function or Disposable |

Entries execute in definition order. Cleanup runs in reverse order.

### Context

Each entry function receives a `StepContext` with:

| Property    | Description                             |
| ----------- | --------------------------------------- |
| `index`     | Entry index (0-based)                   |
| `previous`  | Previous step's return value (typed)    |
| `results`   | All step results as typed tuple         |
| `store`     | Shared `Map<string, unknown>` for state |
| `signal`    | AbortSignal for cancellation            |
| `resources` | Record of initialized resources         |

Note: `previous` and `results` only include `step` entries, not `resource` or
`setup`.

## API

### scenario(name, options?)

Creates a new scenario builder.

- `name` - Human-readable scenario name
- `options.tags` - String array for filtering

### .step(name, fn, options?) / .step(fn, options?)

Adds a test step. Anonymous steps are auto-named "Step N".

- `fn` receives `StepContext`, returns value passed to next step
- `options.timeout` - Step timeout in milliseconds
- `options.retry` - Retry configuration

### .resource(name, factory)

Adds a named resource with automatic lifecycle management.

- `name` - Unique identifier, becomes key in `ctx.resources`
- `factory` receives `StepContext`, returns resource object
- If resource implements `Disposable` or `AsyncDisposable`, automatically
  disposed

### .setup(fn)

Adds a setup entry for side effects.

- `fn` receives `StepContext`
- May return cleanup function, `Disposable`, or `AsyncDisposable`
- Cleanup guaranteed to run even on failure

### .build()

Finalizes and returns an immutable `ScenarioDefinition`.

## Best Practices

1. **Use `.resource()` for Disposables** - Database connections, file handles
2. **Use `.setup()` for procedural cleanup** - Temp files, test data seeding
3. **Keep steps focused** - One logical assertion per step
4. **Use descriptive names** - Aids debugging and reporting
5. **Leverage type inference** - Avoid explicit type annotations when possible

## Related

- [Architecture](./architecture.md) - Overall design
- [Runner](./runner.md) - Execution of built definitions
- [Guide](./guide.md) - Practical examples
