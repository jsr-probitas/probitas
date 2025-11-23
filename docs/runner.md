# Runner Specification

The Runner layer executes scenario definitions and orchestrates the test
lifecycle. It coordinates between scenarios, steps, and reporters.

## Overview

The Runner layer receives immutable scenario definitions created by the Builder
layer and manages the execution flow, lifecycle hooks, parallel execution,
timeouts, and reporting.

See [Architecture - Execution Flow](./architecture.md#execution-flow) for a
detailed sequence diagram of the execution process.

## Core Responsibilities

- Receive and execute scenario definitions from Builder
- Manage test lifecycle hooks (setup, teardown)
- Control parallel/sequential execution
- Handle timeouts and abort signals
- Coordinate with Reporter to notify events

## Interface

The Runner layer works with complete, immutable definitions created by the
Builder layer. All types here represent the final form after defaults are
applied.

### SourceLocation

Source file location information for debugging.

```typescript
interface SourceLocation {
  /** File path */
  file: string;

  /** Line number */
  line: number;
}
```

### ScenarioOptions

Complete scenario option definition with all required fields. The Builder layer
uses `Partial<ScenarioOptions>` and fills in defaults.

```typescript
interface ScenarioOptions {
  /** Tags (for filtering) */
  tags: string[];

  /** Skip condition (string is used as skip reason) */
  skip:
    | boolean
    | string
    | (() => boolean | string | Promise<boolean | string>)
    | null;

  /** Setup hook */
  setup: ((ctx: ScenarioContext) => void | Promise<void>) | null;

  /** Teardown hook */
  teardown: ((ctx: ScenarioContext) => void | Promise<void>) | null;

  /** Default options for all steps */
  stepOptions: StepOptions;
}
```

### StepOptions

Complete step option definition with all required fields. The Builder layer uses
`Partial<StepOptions>` and fills in defaults.

```typescript
interface StepOptions {
  /** Timeout (milliseconds) */
  timeout: number;

  /** Retry configuration */
  retry: {
    maxAttempts: number;
    backoff: "linear" | "exponential";
  };
}
```

### RetryOptions

Configuration for step retry behavior.

```typescript
interface RetryOptions {
  /**
   * Maximum number of retry attempts
   * @default 1 (no retries)
   */
  maxAttempts: number;

  /**
   * Backoff strategy between retries
   * - "linear": Fixed delay between retries
   * - "exponential": Exponentially increasing delay
   * @default "linear"
   */
  backoff: "linear" | "exponential";
}
```

**Usage:**

```typescript
import { retry } from "probitas";

const result = await retry(
  async () => {
    // Operation that might fail
    return await fetchData();
  },
  {
    maxAttempts: 3,
    backoff: "exponential",
  },
);
```

The `retry` function is also used internally by the Runner for step execution
retries.

### ScenarioDefinition

Scenario definition passed from Builder layer.

```typescript
interface ScenarioDefinition {
  /** Scenario name */
  name: string;

  /** Scenario options (final form) */
  options: ScenarioOptions;

  /** Array of step definitions */
  steps: readonly StepDefinition[];

  /** Source file location (for debugging) */
  location?: SourceLocation;
}
```

### StepDefinition

Definition of each step.

```typescript
interface StepDefinition {
  /** Step name */
  name: string;

  /** Step function */
  fn: AnyStepFunction;

  /** Step options (required, defaults already applied) */
  options: StepOptions;

  /** Source file location (for debugging) */
  location?: SourceLocation;
}
```

### ScenarioRunner

Basic runner interface that all implementations should follow.

```typescript
interface ScenarioRunner {
  /**
   * Execute scenarios
   */
  run(
    scenarios: readonly ScenarioDefinition[],
    options?: RunOptions,
  ): Promise<RunSummary>;
}
```

### RunOptions

Runtime options.

```typescript
interface RunOptions {
  /** Reporter to receive execution events */
  reporter?: Reporter;

  /**
   * Maximum concurrent scenarios (default: 0 = unlimited)
   * - 0 or undefined: Unlimited parallel execution
   * - 1: Sequential execution
   * - N: Execute up to N scenarios in parallel
   */
  maxConcurrency?: number;

  /**
   * Maximum number of failures before stopping (default: 0 = continue all)
   * - 0 or undefined: Execute all scenarios (continueAll)
   * - 1: Stop at first failure (failFast)
   * - N: Stop after N failures
   */
  maxFailures?: number;

  /** Abort signal for execution cancellation */
  signal?: AbortSignal;
}
```

### StepResult

Execution result of each step.

```typescript
interface StepResult {
  /** Step metadata */
  metadata: StepMetadata;

  /** Execution status */
  status: "passed" | "failed" | "skipped";

  /** Execution time (milliseconds) */
  duration: number;

  /** Retry count */
  retries: number;

  /** Step return value */
  value?: unknown;

  /** Error (on failure) */
  error?: Error;
}
```

### ScenarioMetadata

Metadata about a scenario definition, used in results.

```typescript
interface ScenarioMetadata {
  name: string;
  location?: SourceLocation;
  options: {
    tags: readonly string[];
    skip: boolean | null;
    stepOptions: StepOptions;
  };
  steps: readonly StepMetadata[];
}
```

Note: This is a simplified version of ScenarioDefinition where:

- `skip` is normalized to boolean or null (function results are evaluated)
- `setup` and `teardown` are excluded (not needed in results)

### ScenarioResult

Execution result of each scenario.

```typescript
interface ScenarioResult {
  /** Scenario metadata */
  metadata: ScenarioMetadata;

  /** Execution status */
  status: "passed" | "failed" | "skipped";

  /** Execution time (milliseconds) */
  duration: number;

  /** Result of each step */
  steps: StepResult[];

  /** Error (on failure) */
  error?: Error;
}
```

### RunSummary

Overall execution result summary.

```typescript
interface RunSummary {
  /** Total number of executed scenarios */
  total: number;

  /** Number of successful scenarios */
  passed: number;

  /** Number of failed scenarios */
  failed: number;

  /** Number of skipped scenarios */
  skipped: number;

  /** Total execution time (milliseconds) */
  duration: number;

  /** Result of each scenario */
  scenarios: ScenarioResult[];
}
```

### ScenarioContext

Created once per scenario and passed to setup/teardown.

```typescript
interface ScenarioContext {
  name: string;
  options: ScenarioOptions;
  results: unknown[]; // Accumulated step results
  store: Map<string, unknown>; // Shared storage
  signal: AbortSignal; // For cancellation
}
```

## Usage Examples

### Basic Execution

```typescript
const runner = new ScenarioRunner();
const summary = await runner.run([definition]);

console.log(`${summary.passed}/${summary.total} passed`);
```

### With Custom Reporter

```typescript
const runner = new ScenarioRunner();
const summary = await runner.run([definition], {
  reporter: new ListReporter(),
});
```

### Parallel Execution

```typescript
const runner = new ScenarioRunner();
const summary = await runner.run(scenarios, {
  maxConcurrency: 5, // Limit to 5 parallel scenarios
});
```

### Stop on Failure

```typescript
const runner = new ScenarioRunner();
const summary = await runner.run(scenarios, {
  maxFailures: 1, // Stop at first failure (failFast)
});

// Or stop after multiple failures
const summary2 = await runner.run(scenarios, {
  maxFailures: 3, // Stop after 3 failures
});
```

## Customization/Extension

### Custom Runner

You can create custom execution engines by implementing the `ScenarioRunner`
interface.

### Concurrency Modes

```typescript
// Unlimited parallel execution (default)
maxConcurrency: 0; // or undefined

// Sequential execution
maxConcurrency: 1;

// Limited parallel execution
maxConcurrency: 10;
```

### Failure Modes

```typescript
// Execute all scenarios (default)
maxFailures: 0; // or undefined

// Stop at first failure (failFast)
maxFailures: 1;

// Stop after specified number of failures
maxFailures: 3;
```

### Error Handling

```typescript
class ScenarioError extends Error {
  constructor(
    message: string,
    public scenario: ScenarioDefinition,
    public cause?: Error,
  ) {}
}

class StepError extends Error {
  constructor(
    message: string,
    public step: StepDefinition,
    public attempt: number,
    public cause?: Error,
  ) {}
}

class TimeoutError extends Error {
  constructor(
    message: string,
    public timeout: number,
  ) {}
}
```

## Best Practices

### 1. Use Appropriate Strategy

- **When debugging**: Sequential execution guarantees output order
- **Performance focused**: Parallel execution improves throughput

### 2. Set Reasonable Timeouts

Balance between slow tests and false positives.

### 3. Resource Cleanup

Always use teardown hooks to clean up resources:

```typescript
scenario("Test", {
  teardown: async (ctx) => {
    // Always executed (even on error)
  },
});
```

### 4. Signal Handling

Respect abort signals to implement graceful shutdown:

```typescript
await runner.run(scenarios, {
  signal: abortController.signal,
});
```

### 5. Utilize Metadata

Result types are fully serializable:

```typescript
const summary = await runner.run(scenarios);
const json = JSON.stringify(summary);
await Deno.writeTextFile("results.json", json);
```

## Related Resources

- [Builder Specification](./builder.md) - Scenario definition
- [Reporter Specification](./reporter.md) - Test result output
- [Architecture](./architecture.md) - Overall design
