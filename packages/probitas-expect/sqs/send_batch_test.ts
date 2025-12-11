import { assertThrows } from "@std/assert";
import { expectSqsSendBatchResult } from "./send_batch.ts";
import { mockSqsSendBatchResult } from "./_test_utils.ts";

Deno.test("expectSqsSendBatchResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsSendBatchResult(mockSqsSendBatchResult({ ok: true }))
      .toBeSuccessful();
  });

  await t.step("toBeAllSuccessful", () => {
    expectSqsSendBatchResult(mockSqsSendBatchResult({ failed: [] }))
      .toBeAllSuccessful();
    assertThrows(
      () =>
        expectSqsSendBatchResult(
          mockSqsSendBatchResult({
            failed: [{ id: "1", code: "error", message: "Send failed" }],
          }),
        ).toBeAllSuccessful(),
      Error,
    );
  });

  await t.step("toHaveSuccessfulCount", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        successful: [{ id: "1", messageId: "m1" }, {
          id: "2",
          messageId: "m2",
        }],
      }),
    ).toHaveSuccessfulCount(2);
  });

  await t.step("toHaveSuccessfulCountGreaterThan", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        successful: [{ id: "1", messageId: "m1" }, {
          id: "2",
          messageId: "m2",
        }],
      }),
    ).toHaveSuccessfulCountGreaterThan(1);
  });

  await t.step("toHaveSuccessfulCountGreaterThanOrEqual", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({ successful: [{ id: "1", messageId: "m1" }] }),
    ).toHaveSuccessfulCountGreaterThanOrEqual(1);
  });

  await t.step("toHaveSuccessfulCountLessThan", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({ successful: [{ id: "1", messageId: "m1" }] }),
    ).toHaveSuccessfulCountLessThan(5);
  });

  await t.step("toHaveSuccessfulCountLessThanOrEqual", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({ successful: [{ id: "1", messageId: "m1" }] }),
    ).toHaveSuccessfulCountLessThanOrEqual(1);
  });

  await t.step("toHaveFailedCount", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        failed: [{ id: "1", code: "error", message: "Send failed" }],
      }),
    ).toHaveFailedCount(1);
  });

  await t.step("toHaveFailedCountGreaterThan", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        failed: [
          { id: "1", code: "e1", message: "Error 1" },
          { id: "2", code: "e2", message: "Error 2" },
        ],
      }),
    ).toHaveFailedCountGreaterThan(1);
  });

  await t.step("toHaveFailedCountGreaterThanOrEqual", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        failed: [{ id: "1", code: "error", message: "Send failed" }],
      }),
    ).toHaveFailedCountGreaterThanOrEqual(1);
  });

  await t.step("toHaveFailedCountLessThan", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        failed: [{ id: "1", code: "error", message: "Send failed" }],
      }),
    ).toHaveFailedCountLessThan(5);
  });

  await t.step("toHaveFailedCountLessThanOrEqual", () => {
    expectSqsSendBatchResult(
      mockSqsSendBatchResult({
        failed: [{ id: "1", code: "error", message: "Send failed" }],
      }),
    ).toHaveFailedCountLessThanOrEqual(1);
  });
});
