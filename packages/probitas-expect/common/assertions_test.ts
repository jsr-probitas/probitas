/**
 * Tests for assertion helper functions.
 *
 * @module
 */

import { assertEquals, assertThrows } from "@std/assert";
import { getNonNull } from "./assertions.ts";

Deno.test("getNonNull", async (t) => {
  await t.step("returns value when not null or undefined", () => {
    assertEquals(getNonNull(42, "number"), 42);
    assertEquals(getNonNull("hello", "string"), "hello");
    assertEquals(getNonNull(true, "boolean"), true);
    assertEquals(getNonNull(0, "zero"), 0);
    assertEquals(getNonNull("", "empty string"), "");
    assertEquals(getNonNull(false, "false"), false);
  });

  await t.step("throws when value is null", () => {
    assertThrows(
      () => getNonNull(null, "value"),
      Error,
      "Expected value to exist, but got null",
    );
  });

  await t.step("throws when value is undefined", () => {
    assertThrows(
      () => getNonNull(undefined, "value"),
      Error,
      "Expected value to exist, but got undefined",
    );
  });

  await t.step("works with objects", () => {
    const obj = { key: "value" };
    assertEquals(getNonNull(obj, "object"), obj);
  });

  await t.step("works with arrays", () => {
    const arr = [1, 2, 3];
    assertEquals(getNonNull(arr, "array"), arr);
  });

  await t.step("preserves type information", () => {
    const value: string | null = "test";
    const result: string = getNonNull(value, "value");
    assertEquals(result, "test");
  });
});
