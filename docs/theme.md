# Theme Specification

The Theme layer provides semantic coloring used in the Reporter layer. Reporters
can format output based on semantics (success, failure, skip, etc.) rather than
color implementation details.

## Overview

The Theme layer separates the Reporter layer from visual representation,
enabling customizable coloring. Reporters use semantic coloring methods (like
`success`, `failure`, `skip`) without depending on specific color
implementations.

This abstraction allows:

- Reporters to remain agnostic about colors (they only know "this is a success"
  not "this should be green")
- Users to customize themes without modifying reporters
- Automatic NO_COLOR environment variable support

## Core Responsibilities

- Facilitate Reporters in visually distinguishing output
- Provide semantic coloring interface
- Support custom theme implementation
- Support NO_COLOR environment variable

## Interface

### Theme

Theme interface.

```typescript
interface Theme {
  /** Success state (e.g., test passed) */
  readonly success: ThemeFunction;

  /** Failure state (e.g., test failed) */
  readonly failure: ThemeFunction;

  /** Skip/pending state */
  readonly skip: ThemeFunction;

  /** Auxiliary/secondary information (e.g., file path, timestamp) */
  readonly dim: ThemeFunction;

  /** Title/header text */
  readonly title: ThemeFunction;

  /** Informational/neutral text */
  readonly info: ThemeFunction;

  /** Warning state */
  readonly warning: ThemeFunction;
}

type ThemeFunction = (text: string) => string;
```

## Built-in Theme

Visual effects of the default theme:

| Method    | Visual Effect |
| --------- | ------------- |
| `success` | Green         |
| `failure` | Red           |
| `skip`    | Yellow        |
| `dim`     | Gray          |
| `title`   | Bold          |
| `info`    | Cyan          |
| `warning` | Yellow        |

## Usage Examples

### Usage in Reporter

```typescript
class ListReporter extends BaseReporter {
  override async onStepEnd(step: StepDefinition, result: StepResult) {
    const icon = this.theme.success("✓");
    const location = this.theme.dim(
      `(${result.metadata.location.file}:${result.metadata.location.line})`,
    );
    const time = this.theme.dim(`[${result.duration}ms]`);

    await this.write(
      `${icon} ${step.name} ${location} ${time}\n`,
    );
  }

  override async onStepError(step: StepDefinition, error: Error) {
    const icon = this.theme.failure("✗");
    await this.write(`${icon} ${this.theme.failure(step.name)}\n`);
    await this.write(`  ${this.theme.failure(error.message)}\n`);
  }
}
```

## Customization/Extension

### Custom Theme Implementation

#### High Contrast

```typescript
import { bold, cyan, green, red, yellow } from "@std/fmt/colors";
import type { Theme } from "probitas";

const highContrastTheme: Theme = {
  success: (text) => bold(green(text)),
  failure: (text) => bold(red(text)),
  skip: (text) => bold(yellow(text)),
  dim: (text) => text,
  title: (text) => bold(cyan(text)),
  info: (text) => bold(cyan(text)),
  warning: (text) => bold(yellow(text)),
};

const reporter = new ListReporter({ theme: highContrastTheme });
```

#### Bright Colors

```typescript
import { blue, bold, brightGreen, brightRed, magenta } from "@std/fmt/colors";
import type { Theme } from "probitas";

const brightTheme: Theme = {
  success: brightGreen,
  failure: brightRed,
  skip: magenta,
  dim: blue,
  title: (text) => bold(brightGreen(text)),
  info: blue,
  warning: magenta,
};

const reporter = new ListReporter({ theme: brightTheme });
```

#### NO_COLOR Support

```typescript
const noColorTheme: Theme = {
  success: (text) => text,
  failure: (text) => text,
  skip: (text) => text,
  dim: (text) => text,
  title: (text) => text,
  info: (text) => text,
  warning: (text) => text,
};

const noColor = Deno.env.get("NO_COLOR");
const theme = noColor ? noColorTheme : defaultTheme;
const reporter = new ListReporter({ theme });
```

### Theme Composition

```typescript
function combineThemes(...themes: Theme[]): Theme {
  return {
    success: (text) => themes.reduce((t, theme) => theme.success(t), text),
    failure: (text) => themes.reduce((t, theme) => theme.failure(t), text),
    skip: (text) => themes.reduce((t, theme) => theme.skip(t), text),
    dim: (text) => themes.reduce((t, theme) => theme.dim(t), text),
    title: (text) => themes.reduce((t, theme) => theme.title(t), text),
    info: (text) => themes.reduce((t, theme) => theme.info(t), text),
    warning: (text) => themes.reduce((t, theme) => theme.warning(t), text),
  };
}

const combined = combineThemes(boldTheme, colorTheme);
```

## Best Practices

### 1. Semantic-based Usage

Use appropriate methods based on semantics:

```typescript
// For success results
this.theme.success("✓ Passed");

// For failure results
this.theme.failure("✗ Failed");

// For skipped tests
this.theme.skip("⊝ Skipped");

// For auxiliary info (file paths, etc.)
this.theme.dim("(src/test.ts:12)");

// For section titles
this.theme.title("Test Results");

// For informational messages
this.theme.info("Info: Running 10 tests");

// For information requiring attention
this.theme.warning("Warning: Timeout approaching");
```

### 2. Theme Validation

Theme implementations must provide all methods:

```typescript
function validateTheme(theme: unknown): theme is Theme {
  if (!theme || typeof theme !== "object") return false;
  const t = theme as Record<string, unknown>;
  const methods = [
    "success",
    "failure",
    "skip",
    "dim",
    "title",
    "info",
    "warning",
  ];
  return methods.every((m) => typeof t[m] === "function");
}
```

### 3. Compatibility When Customizing

When customizing themes, implement all methods:

```typescript
// Correct implementation
const customTheme: Theme = {
  success: (text) => `✓ ${text}`,
  failure: (text) => `✗ ${text}`,
  skip: (text) => `⊝ ${text}`,
  dim: (text) => `(${text})`,
  title: (text) => `## ${text}`,
  info: (text) => `ℹ ${text}`,
  warning: (text) => `⚠ ${text}`,
};
```

## Related Resources

- [Reporter Specification](./reporter.md) - Test result output
- [Architecture](./architecture.md) - Overall design
