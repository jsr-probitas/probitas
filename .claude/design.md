# Design Philosophy

This document describes the design principles and architectural decisions for
each layer of Probitas.

## Overall Principles

1. **Single Responsibility** - Each layer has one clear purpose
2. **Immutability** - Scenario definitions are immutable after building
3. **Type Safety** - Compile-time guarantees via TypeScript's type system
4. **Semantic Abstraction** - Theme layer decouples reporters from color details
5. **Extensibility** - Custom reporters and themes via well-defined interfaces

## Builder Layer

The Builder layer provides a type-safe fluent API for defining test scenarios.
It focuses solely on **definition** — it does not execute tests.

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

## Runner Layer

The Runner layer executes scenario definitions and orchestrates the test
lifecycle.

### Definition-Execution Separation

The Runner receives immutable `ScenarioDefinition` objects from the Builder. It
never modifies definitions — only reads and executes them.

### Event-Driven Reporting

The Runner emits lifecycle events to the Reporter rather than formatting output
directly. This enables:

- Multiple output formats from the same execution
- Real-time streaming of results
- Custom reporters without modifying Runner

### Controlled Concurrency

The execution model provides two orthogonal controls:

- **maxConcurrency** - How many scenarios run in parallel
- **maxFailures** - When to stop on failures

### Cleanup Guarantee

Cleanups are guaranteed to run even when:

- A step throws an error
- The scenario is aborted via signal
- A timeout occurs

Cleanup errors are collected but don't prevent other cleanups from running.

## Reporter Layer

The Reporter layer formats and displays test execution results.

### Event-Driven Architecture

Reporters implement a simple event interface. The Runner calls event methods at
appropriate times, and reporters decide how to present the information.

This decoupling enables:

- Multiple output formats without changing Runner
- Real-time output as tests execute
- Custom reporters for specific needs (CI/CD, IDEs, dashboards)

### Semantic Coloring via Theme

Reporters use the Theme layer for coloring. Instead of hardcoding colors,
reporters call semantic methods like `theme.success()` or `theme.failure()`.

Benefits:

- Reporters remain color-agnostic
- Users can customize themes without modifying reporters
- Automatic NO_COLOR environment variable support

## Theme Layer

The Theme layer provides semantic coloring for the Reporter layer.

### Semantic Abstraction

Theme methods are named for meaning, not appearance:

- `success` - Test passed (default: green)
- `failure` - Test failed (default: red)
- `warning` - Needs attention (default: yellow)
- `info` - Informational (default: cyan)
- `dim` - Secondary/auxiliary (default: gray)
- `title` - Heading/emphasis (default: bold)

This abstraction provides:

- **Consistency** - Same meaning always styled the same way
- **Customization** - Change colors without modifying reporters
- **Accessibility** - Easy to create high-contrast or colorblind-friendly themes

## Discover Layer

The Discover layer provides functions for finding scenario files in the
filesystem.

### Path Resolution Strategy

The discovery process follows a simple strategy:

- **File path** → Returns that file directly
- **Directory path** → Searches within using include patterns

This allows users to specify exact files or let the system discover them.

### Glob-Based Filtering

Uses standard glob patterns for flexible file matching:

- Include patterns determine which files to discover
- Exclude patterns filter out unwanted paths
- Patterns are evaluated relative to each directory
