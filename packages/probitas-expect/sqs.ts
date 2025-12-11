import type {
  SqsDeleteBatchResult,
  SqsDeleteQueueResult,
  SqsDeleteResult,
  SqsEnsureQueueResult,
  SqsReceiveResult,
  SqsResult,
  SqsSendBatchResult,
  SqsSendResult,
} from "@probitas/client-sqs";
import {
  expectSqsSendResult,
  type SqsSendResultExpectation,
} from "./sqs/send.ts";
import {
  expectSqsSendBatchResult,
  type SqsSendBatchResultExpectation,
} from "./sqs/send_batch.ts";
import {
  expectSqsReceiveResult,
  type SqsReceiveResultExpectation,
} from "./sqs/receive.ts";
import {
  expectSqsDeleteResult,
  type SqsDeleteResultExpectation,
} from "./sqs/delete.ts";
import { expectSqsDeleteBatchResult } from "./sqs/delete_batch.ts";
import {
  expectSqsEnsureQueueResult,
  type SqsEnsureQueueResultExpectation,
} from "./sqs/ensure_queue.ts";
import {
  expectSqsDeleteQueueResult,
  type SqsDeleteQueueResultExpectation,
} from "./sqs/delete_queue.ts";

// Re-export interfaces
export type {
  SqsDeleteQueueResultExpectation,
  SqsDeleteResultExpectation,
  SqsEnsureQueueResultExpectation,
  SqsReceiveResultExpectation,
  SqsSendBatchResultExpectation,
  SqsSendResultExpectation,
};

// Re-export message expectation
export { expectSqsMessage, type SqsMessageExpectation } from "./sqs/message.ts";

/**
 * Expectation type returned by expectSqsResult based on the result type.
 */
export type SqsExpectation<R extends SqsResult> = R extends SqsSendResult
  ? SqsSendResultExpectation
  : R extends SqsSendBatchResult ? SqsSendBatchResultExpectation
  : R extends SqsReceiveResult ? SqsReceiveResultExpectation
  : R extends SqsDeleteResult ? SqsDeleteResultExpectation
  : R extends SqsDeleteBatchResult ? SqsSendBatchResultExpectation
  : R extends SqsEnsureQueueResult ? SqsEnsureQueueResultExpectation
  : R extends SqsDeleteQueueResult ? SqsDeleteQueueResultExpectation
  : never;

/**
 * Create a fluent expectation chain for any SQS result validation.
 *
 * This unified function accepts any SQS result type and returns
 * the appropriate expectation interface based on the result's type discriminator.
 * Supports send, sendBatch, receive, delete, deleteBatch, ensureQueue, and deleteQueue results.
 *
 * @param result - The SQS result to create expectations for
 * @returns A typed expectation object matching the result type
 *
 * @example Send result validation
 * ```ts
 * const sendResult = await sqs.send(JSON.stringify({ orderId: "123" }));
 * expectSqsResult(sendResult)
 *   .toBeSuccessful()
 *   .hasMessageId()
 *   .toHaveDurationLessThan(1000);
 * ```
 *
 * @example Receive result validation
 * ```ts
 * const receiveResult = await sqs.receive({ maxMessages: 10 });
 * expectSqsResult(receiveResult)
 *   .toBeSuccessful()
 *   .toHaveContent()
 *   .countAtLeast(1)
 *   .toMatchObject({ body: "orderId" });
 * ```
 *
 * @example Batch operations
 * ```ts
 * // Send batch
 * const batchResult = await sqs.sendBatch([
 *   { id: "1", body: "msg1" },
 *   { id: "2", body: "msg2" },
 * ]);
 * expectSqsResult(batchResult)
 *   .toBeSuccessful()
 *   .allSuccessful()
 *   .noFailures();
 *
 * // Delete batch
 * const deleteResult = await sqs.deleteBatch(receiptHandles);
 * expectSqsResult(deleteResult)
 *   .toBeSuccessful()
 *   .successfulCount(2);
 * ```
 *
 * @example Queue management
 * ```ts
 * // Ensure queue exists
 * const ensureResult = await sqs.ensureQueue("test-queue");
 * expectSqsResult(ensureResult)
 *   .toBeSuccessful()
 *   .hasQueueUrl()
 *   .queueUrlContains("test-queue");
 *
 * // Delete queue
 * const deleteResult = await sqs.deleteQueue(queueUrl);
 * expectSqsResult(deleteResult).toBeSuccessful();
 * ```
 *
 * @example Individual message validation
 * ```ts
 * const receiveResult = await sqs.receive();
 * for (const msg of receiveResult.messages) {
 *   expectSqsMessage(msg)
 *     .bodyJsonContains({ type: "ORDER" })
 *     .hasAttribute("correlationId");
 * }
 * ```
 */
export function expectSqsResult<R extends SqsResult>(
  result: R,
): SqsExpectation<R> {
  switch (result.type) {
    case "sqs:send":
      return expectSqsSendResult(
        result as SqsSendResult,
      ) as unknown as SqsExpectation<R>;
    case "sqs:send-batch":
      return expectSqsSendBatchResult(
        result as SqsSendBatchResult,
      ) as unknown as SqsExpectation<R>;
    case "sqs:receive":
      return expectSqsReceiveResult(
        result as SqsReceiveResult,
      ) as unknown as SqsExpectation<R>;
    case "sqs:delete":
      return expectSqsDeleteResult(
        result as SqsDeleteResult,
      ) as unknown as SqsExpectation<R>;
    case "sqs:delete-batch":
      return expectSqsDeleteBatchResult(
        result as SqsDeleteBatchResult,
      ) as unknown as SqsExpectation<R>;
    case "sqs:ensure-queue":
      return expectSqsEnsureQueueResult(
        result as SqsEnsureQueueResult,
      ) as unknown as SqsExpectation<R>;
    case "sqs:delete-queue":
      return expectSqsDeleteQueueResult(
        result as SqsDeleteQueueResult,
      ) as unknown as SqsExpectation<R>;
    default:
      throw new Error(
        `Unknown SQS result type: ${(result as { type: string }).type}`,
      );
  }
}
