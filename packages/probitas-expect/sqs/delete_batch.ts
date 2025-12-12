import type { SqsDeleteBatchResult } from "@probitas/client-sqs";
import * as mixin from "../mixin.ts";

export interface SqsDeleteBatchResultExpectation {
  /**
   * Negates the next assertion.
   */
  readonly not: this;

  toBeOk(): this;

  toHaveSuccessful(expected: unknown): this;
  toHaveSuccessfulEqual(expected: unknown): this;
  toHaveSuccessfulStrictEqual(expected: unknown): this;
  toHaveSuccessfulSatisfying(
    matcher: (value: unknown[]) => void,
  ): this;
  toHaveSuccessfulContaining(item: unknown): this;
  toHaveSuccessfulContainingEqual(item: unknown): this;
  toHaveSuccessfulMatching(
    subset: Record<PropertyKey, unknown> | Record<PropertyKey, unknown>[],
  ): this;
  toHaveSuccessfulEmpty(): this;
  toHaveSuccessfulCount(expected: unknown): this;
  toHaveSuccessfulCountEqual(expected: unknown): this;
  toHaveSuccessfulCountStrictEqual(expected: unknown): this;
  toHaveSuccessfulCountSatisfying(matcher: (value: number) => void): this;
  toHaveSuccessfulCountNaN(): this;
  toHaveSuccessfulCountGreaterThan(expected: number): this;
  toHaveSuccessfulCountGreaterThanOrEqual(expected: number): this;
  toHaveSuccessfulCountLessThan(expected: number): this;
  toHaveSuccessfulCountLessThanOrEqual(expected: number): this;
  toHaveSuccessfulCountCloseTo(expected: number, numDigits?: number): this;

  toHaveFailed(expected: unknown): this;
  toHaveFailedEqual(expected: unknown): this;
  toHaveFailedStrictEqual(expected: unknown): this;
  toHaveFailedSatisfying(matcher: (value: unknown[]) => void): this;
  toHaveFailedContaining(item: unknown): this;
  toHaveFailedContainingEqual(item: unknown): this;
  toHaveFailedMatching(
    subset: Record<PropertyKey, unknown> | Record<PropertyKey, unknown>[],
  ): this;
  toHaveFailedEmpty(): this;
  toHaveFailedCount(expected: unknown): this;
  toHaveFailedCountEqual(expected: unknown): this;
  toHaveFailedCountStrictEqual(expected: unknown): this;
  toHaveFailedCountSatisfying(matcher: (value: number) => void): this;
  toHaveFailedCountNaN(): this;
  toHaveFailedCountGreaterThan(expected: number): this;
  toHaveFailedCountGreaterThanOrEqual(expected: number): this;
  toHaveFailedCountLessThan(expected: number): this;
  toHaveFailedCountLessThanOrEqual(expected: number): this;
  toHaveFailedCountCloseTo(expected: number, numDigits?: number): this;

  toHaveDuration(expected: unknown): this;
  toHaveDurationEqual(expected: unknown): this;
  toHaveDurationStrictEqual(expected: unknown): this;
  toHaveDurationSatisfying(matcher: (value: number) => void): this;
  toHaveDurationNaN(): this;
  toHaveDurationGreaterThan(expected: number): this;
  toHaveDurationGreaterThanOrEqual(expected: number): this;
  toHaveDurationLessThan(expected: number): this;
  toHaveDurationLessThanOrEqual(expected: number): this;
  toHaveDurationCloseTo(expected: number, numDigits?: number): this;
}

export function expectSqsDeleteBatchResult(
  result: SqsDeleteBatchResult,
): SqsDeleteBatchResultExpectation {
  return mixin.defineExpectation((negate) => [
    mixin.createOkMixin(
      () => result.ok,
      negate,
      { valueName: "delete batch result" },
    ),
    // Successful
    mixin.createValueMixin(
      () => result.successful,
      negate,
      { valueName: "successful" },
    ),
    mixin.createArrayValueMixin(
      () => result.successful,
      negate,
      { valueName: "successful" },
    ),
    mixin.createValueMixin(
      () => result.successful.length,
      negate,
      { valueName: "successful count" },
    ),
    mixin.createNumberValueMixin(
      () => result.successful.length,
      negate,
      { valueName: "successful count" },
    ),
    // Failed
    mixin.createValueMixin(
      () => result.failed,
      negate,
      { valueName: "failed" },
    ),
    mixin.createArrayValueMixin(
      () => result.failed,
      negate,
      { valueName: "failed" },
    ),
    mixin.createValueMixin(
      () => result.failed.length,
      negate,
      { valueName: "failed count" },
    ),
    mixin.createNumberValueMixin(
      () => result.failed.length,
      negate,
      { valueName: "failed count" },
    ),
    // Duration
    mixin.createValueMixin(
      () => result.duration,
      negate,
      { valueName: "duration" },
    ),
    mixin.createNumberValueMixin(
      () => result.duration,
      negate,
      { valueName: "duration" },
    ),
  ]);
}
