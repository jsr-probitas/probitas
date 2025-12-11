import { expectSqsDeleteResult } from "./delete.ts";
import { mockSqsDeleteResult } from "./_test_utils.ts";

Deno.test("expectSqsDeleteResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsDeleteResult(mockSqsDeleteResult({ ok: true })).toBeSuccessful();
  });

  await t.step("duration methods", () => {
    expectSqsDeleteResult(mockSqsDeleteResult({ duration: 50 }))
      .toHaveDurationLessThan(100);
  });
});
