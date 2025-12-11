import { expectSqsEnsureQueueResult } from "./ensure_queue.ts";
import { mockSqsEnsureQueueResult } from "./_test_utils.ts";

Deno.test("expectSqsEnsureQueueResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsEnsureQueueResult(mockSqsEnsureQueueResult({ ok: true }))
      .toBeSuccessful();
  });

  await t.step("toHaveQueueUrl - no arg", () => {
    expectSqsEnsureQueueResult(mockSqsEnsureQueueResult()).toHaveQueueUrl();
  });

  await t.step("toHaveQueueUrl - with expected", () => {
    const url = "https://sqs.us-east-1.amazonaws.com/123456/test-queue";
    expectSqsEnsureQueueResult(mockSqsEnsureQueueResult({ queueUrl: url }))
      .toHaveQueueUrl(
        url,
      );
  });

  await t.step("toHaveQueueUrlContaining", () => {
    expectSqsEnsureQueueResult(mockSqsEnsureQueueResult())
      .toHaveQueueUrlContaining(
        "test-queue",
      );
  });
});
