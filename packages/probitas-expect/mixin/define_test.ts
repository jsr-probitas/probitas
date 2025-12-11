import { assertEquals, assertThrows } from "@std/assert";
import { assertType, type IsExact } from "@std/testing/types";
import { defineExpectation } from "./define.ts";

const mixinA = <T extends object>(base: Readonly<T>) => ({
  ...base,
  methodA(this: T) {
    return this;
  },
});

const mixinB = <T extends object>(base: Readonly<T>) => ({
  ...base,
  methodB(this: T, _values: unknown[]) {
    return this;
  },
});

const mixinC = <T extends object>(base: Readonly<T>) => ({
  ...base,
  methodC(this: T, _substr: string) {
    return this;
  },
});

const mixinA2 = <T extends object>(base: Readonly<T>) => ({
  ...base,
  methodA(this: T, _substr: string) {
    return this;
  },
});

const createNegatingMixin = <T extends object>(negate: () => boolean) => {
  return (base: Readonly<T>) => ({
    ...base,
    check(value: boolean) {
      const isNegated = negate();
      const expected = isNegated ? !value : value;
      if (!expected) {
        throw new Error(
          isNegated
            ? "Expected value to be false, but got true"
            : "Expected value to be true, but got false",
        );
      }
      return this;
    },
  });
};

Deno.test("defineExpectation - type check", async (t) => {
  await t.step("single mixin", () => {
    const expectation = defineExpectation((_negate) => [mixinA]);
    type Expected = {
      readonly not: Expected;
      methodA: (this: Expected) => Expected;
    };
    type Actual = typeof expectation;
    assertType<IsExact<Actual, Expected>>(true);
  });

  await t.step("multiple mixins", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
      mixinB,
      mixinC,
    ]);
    type Expected = {
      readonly not: Expected;
      methodA: (this: Expected) => Expected;
      methodB: (this: Expected, _values: unknown[]) => Expected;
      methodC: (this: Expected, _substr: string) => Expected;
    };
    type Actual = typeof expectation;
    assertType<IsExact<Actual, Expected>>(true);
  });

  await t.step("multiple mixins with overwrite", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
      mixinB,
      mixinC,
      mixinA2,
    ]);
    type Expected = {
      readonly not: Expected;
      methodA: (this: Expected, _substr: string) => Expected;
      methodB: (this: Expected, _values: unknown[]) => Expected;
      methodC: (this: Expected, _substr: string) => Expected;
    };
    type Actual = typeof expectation;
    assertType<IsExact<Actual, Expected>>(true);
  });

  await t.step("negation preserves type", () => {
    const expectation = defineExpectation((_negate) => [mixinA, mixinB]);
    type Expected = {
      readonly not: Expected;
      methodA: (this: Expected) => Expected;
      methodB: (this: Expected, _values: unknown[]) => Expected;
    };
    type Actual = typeof expectation.not;
    assertType<IsExact<Actual, Expected>>(true);
  });
});

Deno.test("defineExpectation - runtime check", async (t) => {
  await t.step("single mixin", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
    ]);
    // Check all own properties including getter
    assertEquals(Object.getOwnPropertyNames(expectation).sort(), [
      "methodA",
      "not",
    ]);
    assertEquals(expectation.methodA(), expectation);
  });

  await t.step("multiple mixins", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
      mixinB,
      mixinC,
    ]);
    // Check all own properties including getter
    assertEquals(Object.getOwnPropertyNames(expectation).sort(), [
      "methodA",
      "methodB",
      "methodC",
      "not",
    ]);
    assertEquals(expectation.methodA(), expectation);
    assertEquals(expectation.methodB([]), expectation);
    assertEquals(expectation.methodC(""), expectation);
  });

  await t.step("multiple mixins with overwrite", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
      mixinB,
      mixinC,
      mixinA2,
    ]);
    // Check all own properties including getter
    assertEquals(Object.getOwnPropertyNames(expectation).sort(), [
      "methodA",
      "methodB",
      "methodC",
      "not",
    ]);
    assertEquals(expectation.methodA(""), expectation);
    assertEquals(expectation.methodB([]), expectation);
    assertEquals(expectation.methodC(""), expectation);
  });

  await t.step("negation returns same instance", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
    ]);
    const negated = expectation.not;
    // Verify they are the same instance
    assertEquals(expectation === negated, true);
    // Verify negated also has methods
    assertEquals(negated.methodA(), negated);
  });

  await t.step("double negation returns same instance", () => {
    const expectation = defineExpectation((_negate) => [
      mixinA,
    ]);
    const doubleNegated = expectation.not.not;
    // Verify they are the same instance
    assertEquals(expectation === doubleNegated, true);
    assertEquals(expectation.not === doubleNegated, true);
    // Verify double negated also has methods
    assertEquals(doubleNegated.methodA(), doubleNegated);
  });
});

Deno.test("defineExpectation - negation behavior", async (t) => {
  await t.step("positive assertion passes with true", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    expectation.check(true);
  });

  await t.step("positive assertion fails with false", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    assertThrows(
      () => expectation.check(false),
      Error,
      "Expected value to be true, but got false",
    );
  });

  await t.step("negative assertion passes with false", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    expectation.not.check(false);
  });

  await t.step("negative assertion fails with true", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    assertThrows(
      () => expectation.not.check(true),
      Error,
      "Expected value to be false, but got true",
    );
  });

  await t.step("double negation behaves like positive", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    // .not.not toggles twice, resulting in positive assertion
    expectation.not.not.check(true);
    assertThrows(
      () => expectation.not.not.check(false),
      Error,
      "Expected value to be true, but got false",
    );
  });

  await t.step("negation resets after method call", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    // First call with .not should negate
    expectation.not.check(false);
    // Second call without .not should be positive (negation was reset)
    expectation.check(true);
  });

  await t.step("chained methods with one negation", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    // .not.check(false) succeeds (negated assertion passes with false)
    // .check(true) succeeds (positive assertion passes with true)
    expectation.not.check(false).check(true);
  });

  await t.step("chained methods with multiple negations", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    // Both assertions are negated independently
    expectation.not.check(false).not.check(false);
  });

  await t.step(".not.check(true).check(true) fails", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    // First .not.check(true) fails because negated assertion expects false
    assertThrows(
      () => expectation.not.check(true).check(true),
      Error,
      "Expected value to be false, but got true",
    );
  });

  await t.step(".not.check(false).check(false) fails", () => {
    const expectation = defineExpectation((negate) => [
      createNegatingMixin(negate),
    ]);
    // First .not.check(false) succeeds (negated)
    // Second .check(false) fails (positive assertion expects true)
    assertThrows(
      () => expectation.not.check(false).check(false),
      Error,
      "Expected value to be true, but got false",
    );
  });
});
