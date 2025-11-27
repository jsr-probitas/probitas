/**
 * Tests for utility functions
 *
 * @module
 */

import {
  assertEquals,
  assertInstanceOf,
  assertStringIncludes,
  assertThrows,
} from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  getVersion,
  parsePositiveInteger,
  readAsset,
  readTemplate,
  resolveReporter,
} from "./utils.ts";
import {
  DotReporter,
  JSONReporter,
  ListReporter,
  TAPReporter,
} from "../src/reporter/mod.ts";

describe("utils", () => {
  describe("resolveReporter", () => {
    const reporters = [
      { name: "list", class: ListReporter },
      { name: "dot", class: DotReporter },
      { name: "json", class: JSONReporter },
      { name: "tap", class: TAPReporter },
    ];

    for (const { name, class: ReporterClass } of reporters) {
      it(`resolves '${name}' to ${ReporterClass.name}`, () => {
        const reporter = resolveReporter(name);
        assertInstanceOf(reporter, ReporterClass);
      });
    }

    it("returns ListReporter as default", () => {
      assertEquals(resolveReporter(undefined) instanceof ListReporter, true);
      assertEquals(resolveReporter("") instanceof ListReporter, true);
    });

    it("throws error for unknown reporter name", () => {
      assertThrows(
        () => resolveReporter("unknown"),
        Error,
        "Unknown reporter: unknown",
      );
    });
  });

  describe("parsePositiveInteger", () => {
    it("parses string number", () => {
      const result = parsePositiveInteger("10", "test");
      assertEquals(result, 10);
    });

    it("parses numeric value", () => {
      const result = parsePositiveInteger(5, "test");
      assertEquals(result, 5);
    });

    it("returns undefined when undefined is passed", () => {
      const result = parsePositiveInteger(undefined, "test");
      assertEquals(result, undefined);
    });

    it("throws error for invalid number string", () => {
      assertThrows(
        () => parsePositiveInteger("abc", "test"),
        Error,
        "test must be a positive integer",
      );
    });

    it("throws error for decimal number", () => {
      assertThrows(
        () => parsePositiveInteger("1.5", "test"),
        Error,
        "test must be a positive integer",
      );
    });

    it("throws error for zero", () => {
      assertThrows(
        () => parsePositiveInteger("0", "test"),
        Error,
        "test must be a positive integer",
      );
    });

    it("throws error for negative number", () => {
      assertThrows(
        () => parsePositiveInteger("-1", "test"),
        Error,
        "test must be a positive integer",
      );
    });
  });

  describe("readTemplate", () => {
    it("reads template files", async () => {
      const config = await readTemplate("probitas.config.ts");
      assertStringIncludes(config, "ProbitasConfig");

      const denoJson = await readTemplate("deno.jsonc");
      assertStringIncludes(denoJson, "imports");

      const example = await readTemplate("example.scenario.ts");
      assertStringIncludes(example, "Example Scenario");
    });
  });

  describe("readAsset", () => {
    it("reads asset files", async () => {
      const usage = await readAsset("usage.txt");
      assertStringIncludes(usage, "Probitas");

      const usageRun = await readAsset("usage-run.txt");
      assertStringIncludes(usageRun, "probitas run");
    });
  });

  describe("getVersion", () => {
    it("reads version from deno.jsonc", () => {
      const version = getVersion();
      assertEquals(typeof version, "string");
      // Should be a version or "unknown"
    });
  });
});
