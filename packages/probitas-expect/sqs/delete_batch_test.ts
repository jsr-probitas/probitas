import { expectSqsDeleteBatchResult } from "./delete_batch.ts";
import { mockSqsDeleteBatchResult } from "./_test_utils.ts";

Deno.test("expectSqsDeleteBatchResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsDeleteBatchResult(mockSqsDeleteBatchResult({ ok: true }))
      .toBeSuccessful();
  });

  await t.step("toBeAllSuccessful", () => {
    expectSqsDeleteBatchResult(mockSqsDeleteBatchResult({ failed: [] }))
      .toBeAllSuccessful();
  });

  await t.step("toHaveSuccessfulCount", () => {
    expectSqsDeleteBatchResult(
      mockSqsDeleteBatchResult({ successful: ["1", "2"] }),
    ).toHaveSuccessfulCount(2);
  });

  await t.step("toHaveFailedCount", () => {
    expectSqsDeleteBatchResult(
      mockSqsDeleteBatchResult({
        failed: [{ id: "1", code: "error", message: "Delete failed" }],
      }),
    ).toHaveFailedCount(1);
  });
});
