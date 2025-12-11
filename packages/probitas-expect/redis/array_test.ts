import { assertThrows } from "@std/assert";
import { expectRedisArrayResult } from "./array.ts";
import { mockRedisArrayResult } from "./_test_utils.ts";

Deno.test("expectRedisArrayResult", async (t) => {
  await t.step("toBeSuccessful", () => {
    const result = mockRedisArrayResult({ ok: true });
    expectRedisArrayResult(result).toBeSuccessful();
  });

  await t.step("toHaveContent", async (t) => {
    await t.step("passes when array is not empty", () => {
      const result = mockRedisArrayResult({ value: ["item1", "item2"] });
      expectRedisArrayResult(result).toHaveContent();
    });

    await t.step("fails when array is empty", () => {
      const result = mockRedisArrayResult({ value: [] });
      assertThrows(
        () => expectRedisArrayResult(result).toHaveContent(),
        Error,
        "Expected non-empty array, but array is empty",
      );
    });

    await t.step("negated - passes when array is empty", () => {
      const result = mockRedisArrayResult({ value: [] });
      expectRedisArrayResult(result).not.toHaveContent();
    });
  });

  await t.step("toHaveLength", async (t) => {
    await t.step("passes for matching count", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c"] });
      expectRedisArrayResult(result).toHaveLength(3);
    });

    await t.step("fails for non-matching count", () => {
      const result = mockRedisArrayResult({ value: ["a", "b"] });
      assertThrows(
        () => expectRedisArrayResult(result).toHaveLength(3),
        Error,
        "Expected 3 array count, got 2",
      );
    });
  });

  await t.step("toHaveLengthGreaterThanOrEqual", async (t) => {
    await t.step("passes when count is greater", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c"] });
      expectRedisArrayResult(result).toHaveLengthGreaterThanOrEqual(2);
    });

    await t.step("passes when count is equal", () => {
      const result = mockRedisArrayResult({ value: ["a", "b"] });
      expectRedisArrayResult(result).toHaveLengthGreaterThanOrEqual(2);
    });

    await t.step("fails when count is less", () => {
      const result = mockRedisArrayResult({ value: ["a"] });
      assertThrows(
        () => expectRedisArrayResult(result).toHaveLengthGreaterThanOrEqual(3),
        Error,
        "Expected at least 3 array count, got 1",
      );
    });
  });

  await t.step("toHaveLengthLessThanOrEqual", async (t) => {
    await t.step("passes when count is less", () => {
      const result = mockRedisArrayResult({ value: ["a"] });
      expectRedisArrayResult(result).toHaveLengthLessThanOrEqual(3);
    });

    await t.step("passes when count is equal", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c"] });
      expectRedisArrayResult(result).toHaveLengthLessThanOrEqual(3);
    });

    await t.step("fails when count is greater", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c", "d"] });
      assertThrows(
        () => expectRedisArrayResult(result).toHaveLengthLessThanOrEqual(3),
        Error,
        "Expected at most 3 array count, got 4",
      );
    });
  });

  await t.step("toContain", async (t) => {
    await t.step("passes when item exists", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c"] });
      expectRedisArrayResult(result).toContain("b");
    });

    await t.step("fails when item does not exist", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c"] });
      assertThrows(
        () => expectRedisArrayResult(result).toContain("d"),
        Error,
        'Expected array to contain "d"',
      );
    });

    await t.step("negated - passes when item does not exist", () => {
      const result = mockRedisArrayResult({ value: ["a", "b", "c"] });
      expectRedisArrayResult(result).not.toContain("d");
    });
  });

  await t.step("method chaining", () => {
    const result = mockRedisArrayResult({
      ok: true,
      value: ["a", "b", "c"],
      duration: 50,
    });
    expectRedisArrayResult(result)
      .toBeSuccessful()
      .toHaveContent()
      .toHaveLength(3)
      .toContain("b")
      .toHaveDurationLessThan(100);
  });
});
