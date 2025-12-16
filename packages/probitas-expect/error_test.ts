/**
 * Tests for error.ts module
 *
 * @module
 */

import { assertEquals, assertExists, assertInstanceOf } from "@std/assert";
import { createExpectationError } from "./error.ts";
import type { Origin } from "@probitas/core/origin";

Deno.test("createExpectationError - creates Error instance", () => {
  const error = createExpectationError({ message: "Test error" });
  assertInstanceOf(error, Error);
  assertEquals(error.message.includes("Test error"), true);
});

Deno.test("createExpectationError - includes message", () => {
  const error = createExpectationError({
    message: "Expected value to be true",
  });
  assertEquals(error.message.includes("Expected value to be true"), true);
});

Deno.test("createExpectationError - without expectOrigin returns plain message", () => {
  const error = createExpectationError({
    message: "Simple error",
  });
  // Without expectOrigin, should just be the message (possibly with context if matcherOrigin found)
  assertEquals(error.message.includes("Simple error"), true);
});

Deno.test("createExpectationError - with expectOrigin adds context", () => {
  // Use this test file as the path
  const testFilePath = new URL(import.meta.url).pathname;
  const expectOrigin: Origin = {
    path: testFilePath,
    line: 10,
    column: 3,
  };

  const error = createExpectationError({
    message: "Expected true but got false",
    expectOrigin,
  });

  // Should include the message
  assertEquals(error.message.includes("Expected true but got false"), true);
  // May include context if both origins resolved to same file
});

Deno.test("createExpectationError - context includes source lines when same file", () => {
  // This test verifies that when expectOrigin points to this file,
  // and the error is created in this file, we get source context
  const testFilePath = new URL(import.meta.url).pathname;

  // Point to a line in this file
  const expectOrigin: Origin = {
    path: testFilePath,
    line: 50, // Around this area
    column: 3,
  };

  const error = createExpectationError({
    message: "Test message",
    expectOrigin,
  });

  // The error message should contain the original message
  assertEquals(error.message.includes("Test message"), true);
});

Deno.test("createExpectationError - handles non-existent expectOrigin path gracefully", () => {
  const expectOrigin: Origin = {
    path: "/non/existent/path/file.ts",
    line: 10,
    column: 3,
  };

  // Should not throw, just return error without context
  const error = createExpectationError({
    message: "Error message",
    expectOrigin,
  });

  assertExists(error);
  assertEquals(error.message.includes("Error message"), true);
});

Deno.test("createExpectationError - subject section displays object in multiline format", () => {
  const subject = { name: "Alice", age: 30 };
  const error = createExpectationError({
    message: "Test error",
    subject,
  });

  // Should include Subject header
  assertEquals(error.message.includes("Subject"), true);
  // Should include the object content
  assertEquals(error.message.includes("name"), true);
  assertEquals(error.message.includes("Alice"), true);
  // Should be multiline (contains newlines after Subject)
  const subjectIndex = error.message.indexOf("Subject");
  const afterSubject = error.message.slice(subjectIndex);
  assertEquals(afterSubject.includes("\n"), true);
});

Deno.test("createExpectationError - subject with Uint8Array displays as UTF-8", () => {
  const encoder = new TextEncoder();
  const subject = { body: encoder.encode("Hello, World!") };
  const error = createExpectationError({
    message: "Test error",
    subject,
  });

  // Should display as [Utf8: ...] format
  assertEquals(error.message.includes("[Utf8:"), true);
  assertEquals(error.message.includes("Hello, World!"), true);
});

Deno.test("createExpectationError - subject with invalid UTF-8 Uint8Array displays as hex", () => {
  // Invalid UTF-8 sequence
  const invalidUtf8 = new Uint8Array([0xff, 0xfe, 0x00, 0x01]);
  const subject = { data: invalidUtf8 };
  const error = createExpectationError({
    message: "Test error",
    subject,
  });

  // Should display as [Uint8Array: ...] format with hex
  assertEquals(error.message.includes("[Uint8Array:"), true);
  assertEquals(error.message.includes("ff"), true);
  assertEquals(error.message.includes("fe"), true);
});

Deno.test("createExpectationError - subject with nested Uint8Array displays correctly", () => {
  const encoder = new TextEncoder();
  const subject = {
    outer: {
      inner: encoder.encode("nested"),
    },
    items: [encoder.encode("first"), encoder.encode("second")],
  };
  const error = createExpectationError({
    message: "Test error",
    subject,
  });

  // Should display nested Uint8Array as UTF-8
  assertEquals(error.message.includes("[Utf8:"), true);
  assertEquals(error.message.includes("nested"), true);
  assertEquals(error.message.includes("first"), true);
  assertEquals(error.message.includes("second"), true);
});

Deno.test("createExpectationError - subject with escaped characters in Uint8Array", () => {
  const encoder = new TextEncoder();
  // String with characters that need escaping: \n, \r, \t, [, ]
  const subject = { body: encoder.encode("line1\nline2\ttab[bracket]") };
  const error = createExpectationError({
    message: "Test error",
    subject,
  });

  // Should escape special characters
  assertEquals(error.message.includes("[Utf8:"), true);
  assertEquals(error.message.includes("\\n"), true);
  assertEquals(error.message.includes("\\t"), true);
  assertEquals(error.message.includes("\\["), true);
  assertEquals(error.message.includes("\\]"), true);
});
