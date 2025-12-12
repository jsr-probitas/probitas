/**
 * Assertion helper functions for expect implementations.
 *
 * This module provides utility functions for common assertion patterns.
 *
 * @module
 */

/**
 * Gets a non-null value or throws an error.
 *
 * @param value - Value to check
 * @param valueName - Name of the value (for error messages)
 * @returns The value if not null/undefined
 * @throws Error if value is null or undefined
 */
export function getNonNull<T>(
  value: T,
  valueName: string,
): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${valueName} to exist, but got ${value}`);
  }
  return value;
}
