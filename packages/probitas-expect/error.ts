/**
 * Expectation error generation utilities.
 *
 * This module provides utilities to create errors with source code context
 * for more informative assertion failure messages.
 *
 * @module
 */

import type { Origin } from "@probitas/core/origin";
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
}

/**
 * Create an error with source code context.
 *
 * The matcher origin is captured automatically from the call stack.
 *
 * @param options - Error options
 * @returns Error with formatted message including source context
 */
export function createExpectationError(
  options: ExpectationErrorOptions,
): Error {
  const { message, expectOrigin } = options;

  // Capture matcher origin from current call stack
  const matcherOrigin = captureOrigin();

  // If we have both origins, add source context
  if (expectOrigin && matcherOrigin) {
    const ctx = getSourceContext(expectOrigin, matcherOrigin);
    if (ctx) {
      const contextStr = formatSourceContext(ctx, { cwd: Deno.cwd() });
      return new Error(`${message}\n\n${contextStr}`);
    }
  }

  // Fallback to plain message
  return new Error(message);
}
