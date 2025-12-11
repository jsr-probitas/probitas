import { expectSqsReceiveResult } from "./receive.ts";
import { mockSqsMessage, mockSqsReceiveResult } from "./_test_utils.ts";

Deno.test("expectSqsReceiveResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    expectSqsReceiveResult(mockSqsReceiveResult({ ok: true })).toBeSuccessful();
  });

  await t.step("toHaveContent", () => {
    expectSqsReceiveResult(mockSqsReceiveResult()).toHaveContent();
    expectSqsReceiveResult(mockSqsReceiveResult({ messages: [] })).not
      .toHaveContent();
  });

  await t.step("toHaveLength", () => {
    expectSqsReceiveResult(
      mockSqsReceiveResult({ messages: [mockSqsMessage(), mockSqsMessage()] }),
    ).toHaveLength(2);
  });

  await t.step("toHaveLengthGreaterThanOrEqual", () => {
    expectSqsReceiveResult(mockSqsReceiveResult())
      .toHaveLengthGreaterThanOrEqual(1);
  });

  await t.step("toHaveLengthLessThanOrEqual", () => {
    expectSqsReceiveResult(mockSqsReceiveResult()).toHaveLengthLessThanOrEqual(
      5,
    );
  });

  await t.step("toMatchObject", () => {
    expectSqsReceiveResult(mockSqsReceiveResult()).toMatchObject({
      body: "123",
    });
  });

  await t.step("toSatisfy", () => {
    expectSqsReceiveResult(mockSqsReceiveResult()).toSatisfy((messages) => {
      if (messages.length !== 1) throw new Error("Expected 1 message");
    });
  });
});
