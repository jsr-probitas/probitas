import { assertThrows } from "@std/assert";
import { expectRedisResultBase } from "./result.ts";
import { mockRedisGetResult } from "./_test_utils.ts";

Deno.test("expectRedisResultBase", async (t) => {
  await t.step("toBeSuccessful", async (t) => {
    await t.step("passes when ok is true", () => {
      const result = mockRedisGetResult({ ok: true });
      expectRedisResultBase(result).toBeSuccessful();
    });

    await t.step("fails when ok is false", () => {
      const result = mockRedisGetResult({ ok: false });
      assertThrows(
        () => expectRedisResultBase(result).toBeSuccessful(),
        Error,
        "Expected ok result, but ok is false",
      );
    });
  });

  await t.step("toHaveData", async (t) => {
    await t.step("passes for matching data", () => {
      const result = mockRedisGetResult({ value: "test" });
      expectRedisResultBase(result).toHaveData("test");
    });

    await t.step("fails for non-matching data", () => {
      const result = mockRedisGetResult({ value: "test" });
      assertThrows(
        () => expectRedisResultBase(result).toHaveData("other"),
        Error,
        'Expected data "other", got "test"',
      );
    });
  });

  await t.step("toSatisfy", async (t) => {
    await t.step("passes when matcher succeeds", () => {
      const result = mockRedisGetResult({ value: "test" });
      expectRedisResultBase(result).toSatisfy((value) => {
        if (value !== "test") throw new Error("Expected test");
      });
    });

    await t.step("fails when matcher throws", () => {
      const result = mockRedisGetResult({ value: "other" });
      assertThrows(
        () =>
          expectRedisResultBase(result).toSatisfy((value) => {
            if (value !== "test") throw new Error("Expected test");
          }),
        Error,
        "Expected test",
      );
    });
  });

  await t.step("duration methods", () => {
    const result = mockRedisGetResult({ duration: 50 });
    expectRedisResultBase(result)
      .toHaveDurationLessThan(100)
      .toHaveDurationLessThanOrEqual(50)
      .toHaveDurationGreaterThan(25)
      .toHaveDurationGreaterThanOrEqual(50);
  });
});
