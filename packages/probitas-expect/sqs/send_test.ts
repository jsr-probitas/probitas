import { assertThrows } from "@std/assert";
import { expectSqsSendResult } from "./send.ts";
import { mockSqsSendResult } from "./_test_utils.ts";

Deno.test("expectSqsSendResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsSendResult(mockSqsSendResult({ ok: true })).toBeSuccessful();
    assertThrows(
      () =>
        expectSqsSendResult(mockSqsSendResult({ ok: false })).toBeSuccessful(),
      Error,
    );
  });

  await t.step("toHaveMessageId", () => {
    expectSqsSendResult(mockSqsSendResult({ messageId: "msg-123" }))
      .toHaveMessageId();
    assertThrows(
      () =>
        expectSqsSendResult(mockSqsSendResult({ messageId: undefined }))
          .toHaveMessageId(),
      Error,
    );
  });

  await t.step("duration methods", () => {
    expectSqsSendResult(mockSqsSendResult({ duration: 50 }))
      .toHaveDurationLessThan(
        100,
      );
  });
});
