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
 * Options for creating an expectation error.
 */
export interface ExpectationErrorOptions {
  /** The error message */
  readonly message: string;
  /** The expect() call site origin */
  readonly expectOrigin?: Origin;
  /** Theme for styling (defaults to defaultTheme) */
  readonly theme?: Theme;
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
 *
 * @param options - Error options
 * @returns ExpectationError with styled and formatted message
 */
export function createExpectationError(
  options: ExpectationErrorOptions,
): ExpectationError {
  const { message, expectOrigin, theme = defaultTheme } = options;

  // Style the error message: bold + red
  const styledMessage = theme.title(theme.failure(message));

  // Capture matcher origin from current call stack
  const matcherOrigin = captureOrigin();

  // If we have both origins, include source context in message
  if (expectOrigin && matcherOrigin) {
    const ctx = getSourceContext(expectOrigin, matcherOrigin);
    if (ctx) {
      const contextStr = formatSourceContext(ctx, { cwd: Deno.cwd(), theme });
      return new ExpectationError(`${styledMessage}\n\n${contextStr}`);
    }
  }

  // Fallback to styled message without context
  return new ExpectationError(styledMessage);
}
