import { expectSqsDeleteQueueResult } from "./delete_queue.ts";
import { mockSqsDeleteQueueResult } from "./_test_utils.ts";

Deno.test("expectSqsDeleteQueueResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsDeleteQueueResult(mockSqsDeleteQueueResult({ ok: true }))
      .toBeSuccessful();
  });

  await t.step("duration methods", () => {
    expectSqsDeleteQueueResult(mockSqsDeleteQueueResult({ duration: 50 }))
      .toHaveDurationLessThan(100);
  });
});
