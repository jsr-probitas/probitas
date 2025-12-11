import { buildCountError, createDurationMethods } from "../common.ts";
import type { SqsDeleteBatchResult } from "@probitas/client-sqs";
import type { SqsSendBatchResultExpectation } from "./send_batch.ts";

export function expectSqsDeleteBatchResult(
  result: SqsDeleteBatchResult,
  negate = false,
): SqsSendBatchResultExpectation {
  const self: SqsSendBatchResultExpectation = {
    get not(): SqsSendBatchResultExpectation {
      return expectSqsDeleteBatchResult(result, !negate);
    },

    toBeSuccessful() {
      const isSuccess = result.ok;
      if (negate ? isSuccess : !isSuccess) {
        throw new Error(
          negate
            ? "Expected not ok result, but ok is true"
            : "Expected ok result, but ok is false",
        );
      }
      return this;
    },

    toBeAllSuccessful() {
      const allSuccess = result.failed.length === 0;
      if (negate ? allSuccess : !allSuccess) {
        throw new Error(
          negate
            ? "Expected some failures, but all deletions were successful"
            : `Expected all deletions successful, but ${result.failed.length} failed`,
        );
      }
      return this;
    },

    toHaveSuccessfulCount(count: number) {
      const match = result.successful.length === count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be ${count}, got ${result.successful.length}`
            : buildCountError(count, result.successful.length, "successful"),
        );
      }
      return this;
    },

    toHaveSuccessfulCountGreaterThan(count: number) {
      const match = result.successful.length > count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be > ${count}, got ${result.successful.length}`
            : `Expected successful count > ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveSuccessfulCountGreaterThanOrEqual(count: number) {
      const match = result.successful.length >= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be >= ${count}, got ${result.successful.length}`
            : `Expected successful count >= ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveSuccessfulCountLessThan(count: number) {
      const match = result.successful.length < count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be < ${count}, got ${result.successful.length}`
            : `Expected successful count < ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveSuccessfulCountLessThanOrEqual(count: number) {
      const match = result.successful.length <= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected successful count to not be <= ${count}, got ${result.successful.length}`
            : `Expected successful count <= ${count}, but got ${result.successful.length}`,
        );
      }
      return this;
    },

    toHaveFailedCount(count: number) {
      const match = result.failed.length === count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be ${count}, got ${result.failed.length}`
            : buildCountError(count, result.failed.length, "failed"),
        );
      }
      return this;
    },

    toHaveFailedCountGreaterThan(count: number) {
      const match = result.failed.length > count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be > ${count}, got ${result.failed.length}`
            : `Expected failed count > ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    toHaveFailedCountGreaterThanOrEqual(count: number) {
      const match = result.failed.length >= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be >= ${count}, got ${result.failed.length}`
            : `Expected failed count >= ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    toHaveFailedCountLessThan(count: number) {
      const match = result.failed.length < count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be < ${count}, got ${result.failed.length}`
            : `Expected failed count < ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    toHaveFailedCountLessThanOrEqual(count: number) {
      const match = result.failed.length <= count;
      if (negate ? match : !match) {
        throw new Error(
          negate
            ? `Expected failed count to not be <= ${count}, got ${result.failed.length}`
            : `Expected failed count <= ${count}, but got ${result.failed.length}`,
        );
      }
      return this;
    },

    ...createDurationMethods(result.duration, negate),
  };

  return self;
}
