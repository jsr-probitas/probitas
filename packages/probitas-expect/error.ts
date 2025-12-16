/**
 * Expectation error generation utilities.
 *
 * This module provides utilities to create errors with source code context
 * for more informative assertion failure messages.
 *
 * @module
 */

import type { Origin } from "@probitas/core/origin";
import { defaultTheme, type Theme } from "@probitas/core/theme";
import {
  captureOrigin,
  formatSourceContext,
  getSourceContext,
} from "./context.ts";
import { formatDiff } from "./utils/format_diff.ts";

/**
 * Custom error class for expectation failures.
 *
 * This class is used to identify expectation errors and format them differently
 * from regular errors (e.g., without "Error:" prefix in reporters).
 */
export class ExpectationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpectationError";
  }
}

/**
 * Check if an error is an ExpectationError.
 *
 * Handles both same-process (instanceof) and cross-process (name check)
 * scenarios, supporting worker serialization.
 */
export function isExpectationError(err: unknown): boolean {
  // Check by instanceof first (same process)
  if (err instanceof ExpectationError) {
    return true;
  }
  // Fallback to name check (cross-process serialization)
  if (err instanceof Error && err.name === "ExpectationError") {
    return true;
  }
  return false;
}

/**
 * Diff information for expectation errors.
 */
export interface DiffInfo {
  /** The actual value */
  readonly actual: unknown;
  /** The expected value */
  readonly expected: unknown;
  /** Whether this is a negated assertion (show actual only) */
  readonly negated?: boolean;
}

/**
 * Options for creating an expectation error.
 */
export interface ExpectationErrorOptions {
  /** The error message */
  readonly message: string;
  /** The expect() call site origin */
  readonly expectOrigin?: Origin;
  /** Theme for styling (defaults to defaultTheme) */
  readonly theme?: Theme;
  /** Diff information for showing actual vs expected */
  readonly diff?: DiffInfo;
}

/**
 * Create an error with source code context.
 *
 * The matcher origin is captured automatically from the call stack.
 * Returns an ExpectationError with styled message including:
 * - Error message: bold + red (failure color)
 * - Context title: bold
 * - Context path: dim (gray)
 * - Context body: dim (gray)
 * - Diff section (if diff option is provided):
 *   - For normal assertions: shows diff between actual and expected
 *   - For negated assertions: shows actual value only
 *
 * @param options - Error options
 * @returns ExpectationError with styled and formatted message
 */
export function createExpectationError(
  options: ExpectationErrorOptions,
): ExpectationError {
  const { message, expectOrigin, theme = defaultTheme, diff } = options;

  // Style the error message: bold + red
  const styledMessage = theme.title(theme.failure(message));

  // Build message parts
  const parts: string[] = [styledMessage];

  // Add diff section if provided
  if (diff) {
    const diffSection = buildDiffSection(diff, theme);
    if (diffSection) {
      parts.push(diffSection);
    }
  }

  // Capture matcher origin from current call stack
  const matcherOrigin = captureOrigin();

  // If we have both origins, include source context in message
  if (expectOrigin && matcherOrigin) {
    const ctx = getSourceContext(expectOrigin, matcherOrigin);
    if (ctx) {
      const contextStr = formatSourceContext(ctx, { cwd: Deno.cwd(), theme });
      parts.push(contextStr);
    }
  }

  return new ExpectationError(parts.join("\n\n"));
}

/**
 * Build the diff section for an error message.
 *
 * For negated assertions, shows "Actual:" section only.
 * For normal assertions, shows "Diff (-Actual / +Expected):" section.
 */
function buildDiffSection(diff: DiffInfo, theme: Theme): string | undefined {
  const { actual, expected, negated } = diff;

  if (negated) {
    // Negated assertion - show actual value only (no diff)
    // Skip for primitives - they're already clear in the message
    if (typeof actual !== "object" || actual === null) {
      return undefined;
    }
    const actualStr = Deno.inspect(actual, { depth: Infinity, colors: false });
    const lines = actualStr.split("\n").map((line) => theme.dim(`    ${line}`));
    return `${theme.title("Actual:")}\n${lines.join("\n")}`;
  }

  // Normal assertion - show diff
  const diffStr = formatDiff(actual, expected, { theme });
  if (diffStr) {
    // Format header with colored -Actual (red) and +Expected (green)
    const header = `Diff (${theme.failure("-Actual")} / ${
      theme.success("+Expected")
    }):`;
    return `${theme.title(header)}\n\n${diffStr}`;
  }
  return undefined;
}
