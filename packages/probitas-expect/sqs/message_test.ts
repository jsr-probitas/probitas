import { expectSqsMessage } from "./message.ts";
import { mockSqsMessage } from "./_test_utils.ts";

Deno.test("expectSqsMessage", async (t) => {
  await t.step("toHaveBodyContaining", () => {
    expectSqsMessage(mockSqsMessage({ body: "hello world" }))
      .toHaveBodyContaining("world");
  });

  await t.step("toHaveBodyMatching", () => {
    expectSqsMessage(mockSqsMessage()).toHaveBodyMatching((body) => {
      if (!body.includes("test")) throw new Error("Expected test");
    });
  });

  await t.step("toHaveBodyJsonEqualTo", () => {
    expectSqsMessage(mockSqsMessage({ body: '{"a":1}' })).toHaveBodyJsonEqualTo(
      { a: 1 },
    );
  });

  await t.step("toHaveBodyJsonContaining", () => {
    expectSqsMessage(mockSqsMessage({ body: '{"a":1,"b":2}' }))
      .toHaveBodyJsonContaining({ a: 1 });
  });

  await t.step("toHaveAttribute", () => {
    expectSqsMessage(mockSqsMessage({
      messageAttributes: {
        "correlationId": { stringValue: "123", dataType: "String" },
      },
    })).toHaveAttribute("correlationId");
  });

  await t.step("toHaveAttributesContaining", () => {
    expectSqsMessage(mockSqsMessage({
      messageAttributes: {
        "correlationId": { stringValue: "123", dataType: "String" },
      },
    })).toHaveAttributesContaining({ "correlationId": { stringValue: "123" } });
  });

  await t.step("toHaveMessageId", () => {
    expectSqsMessage(mockSqsMessage({ messageId: "msg-456" })).toHaveMessageId(
      "msg-456",
    );
  });
});
