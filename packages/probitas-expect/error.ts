/**
 * Expectation error generation utilities.
 *
 * This module provides utilities to create errors with source code context
 * for more informative assertion failure messages.
 *
 * @module
 */

import type { Origin } from "@probitas/core/origin";
import type { Theme } from "@probitas/core/theme";
import {
  captureOrigin,
  formatSourceContext,
  getSourceContext,
} from "./context.ts";

/**
 * Options for creating an expectation error.
 */
export interface ExpectationErrorOptions {
  /** The error message */
  readonly message: string;
  /** The expect() call site origin */
  readonly expectOrigin?: Origin;
  /** Theme for styling the error message */
  readonly theme?: Theme;
}

/**
 * Create an error with source code context.
 *
 * The matcher origin is captured automatically from the call stack.
 * If a theme is provided, the error message is styled with theme.failure
 * and the source context is styled with theme.dim.
 *
 * @param options - Error options
 * @returns Error with formatted message including source context
 */
export function createExpectationError(
  options: ExpectationErrorOptions,
): Error {
  const { message, expectOrigin, theme } = options;

  // Apply theme styling if provided (failure color + bold)
  const styledMessage = theme ? theme.title(theme.failure(message)) : message;

  // Capture matcher origin from current call stack
  const matcherOrigin = captureOrigin();

  // If we have both origins, add source context
  if (expectOrigin && matcherOrigin) {
    const ctx = getSourceContext(expectOrigin, matcherOrigin);
    if (ctx) {
      const contextStr = formatSourceContext(ctx, { cwd: Deno.cwd(), theme });
      return new Error(`${styledMessage}\n\n${contextStr}`);
    }
  }

  // Fallback to plain message
  return new Error(styledMessage);
}
