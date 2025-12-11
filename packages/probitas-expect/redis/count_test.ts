import { assertThrows } from "@std/assert";
import { expectRedisCountResult } from "./count.ts";
import { mockRedisCountResult } from "./_test_utils.ts";

Deno.test("expectRedisCountResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    const result = mockRedisCountResult({ ok: true });
    expectRedisCountResult(result).toBeSuccessful();
  });

  await t.step("toHaveData", () => {
    const result = mockRedisCountResult({ value: 5 });
    expectRedisCountResult(result).toHaveData(5);
  });

  await t.step("toHaveLength", async (t) => {
    await t.step("passes for matching count", () => {
      const result = mockRedisCountResult({ value: 5 });
      expectRedisCountResult(result).toHaveLength(5);
    });

    await t.step("fails for non-matching count", () => {
      const result = mockRedisCountResult({ value: 5 });
      assertThrows(
        () => expectRedisCountResult(result).toHaveLength(3),
        Error,
        "Expected 3 count, got 5",
      );
    });
  });

  await t.step("toHaveLengthGreaterThanOrEqual", async (t) => {
    await t.step("passes when count is greater", () => {
      const result = mockRedisCountResult({ value: 5 });
      expectRedisCountResult(result).toHaveLengthGreaterThanOrEqual(3);
    });

    await t.step("passes when count is equal", () => {
      const result = mockRedisCountResult({ value: 5 });
      expectRedisCountResult(result).toHaveLengthGreaterThanOrEqual(5);
    });

    await t.step("fails when count is less", () => {
      const result = mockRedisCountResult({ value: 2 });
      assertThrows(
        () => expectRedisCountResult(result).toHaveLengthGreaterThanOrEqual(5),
        Error,
        "Expected at least 5 count, got 2",
      );
    });
  });

  await t.step("toHaveLengthLessThanOrEqual", async (t) => {
    await t.step("passes when count is less", () => {
      const result = mockRedisCountResult({ value: 3 });
      expectRedisCountResult(result).toHaveLengthLessThanOrEqual(5);
    });

    await t.step("passes when count is equal", () => {
      const result = mockRedisCountResult({ value: 5 });
      expectRedisCountResult(result).toHaveLengthLessThanOrEqual(5);
    });

    await t.step("fails when count is greater", () => {
      const result = mockRedisCountResult({ value: 10 });
      assertThrows(
        () => expectRedisCountResult(result).toHaveLengthLessThanOrEqual(5),
        Error,
        "Expected at most 5 count, got 10",
      );
    });
  });

  await t.step("method chaining", () => {
    const result = mockRedisCountResult({ ok: true, value: 5, duration: 50 });
    expectRedisCountResult(result)
      .toBeSuccessful()
      .toHaveData(5)
      .toHaveLength(5)
      .toHaveLengthGreaterThanOrEqual(3)
      .toHaveDurationLessThan(100);
  });
});
