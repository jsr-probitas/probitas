import { assertType, type IsExact } from "@std/testing/types";
import type {
  IntersectReturnTypes,
  PatchTypedChainMethod,
  Simplify,
} from "./_typeutils.ts";

Deno.test("Simplify - type check", () => {
  type Original = {
    a: number;
  } & {
    b: {
      c: string;
    };
  };
  type Simplified = Simplify<Original>;
  type Expected = {
    a: number;
    b: {
      c: string;
    };
  };
  assertType<IsExact<Simplified, Expected>>(true);
});

Deno.test("PatchChainMethod - type check", () => {
  type Original = {
    chainMethod: (this: Original, arg: string) => Original;
    normalMethod: (arg: number) => number;
    value: boolean;
  };
  type Extended = {
    extraProp: string;
  };
  type Patched = PatchTypedChainMethod<Original & Extended>;
  type Expected = {
    chainMethod: (this: Expected, arg: string) => Expected;
    normalMethod: (arg: number) => number;
    value: boolean;
    extraProp: string;
  };
  assertType<IsExact<Patched, Expected>>(true);
});

Deno.test("IntersectReturnTypes - type check", () => {
  // deno-lint-ignore no-explicit-any
  type Func1 = (arg: any) => { a: number };
  // deno-lint-ignore no-explicit-any
  type Func2 = (arg: any) => { b: string };
  // deno-lint-ignore no-explicit-any
  type Func3 = (arg: any) => { c: boolean };

  type Funcs = [Func1, Func2, Func3];
  type Intersected = Simplify<IntersectReturnTypes<Funcs>>;
  type Expected = {
    a: number;
    b: string;
    c: boolean;
  };
  assertType<IsExact<Intersected, Expected>>(true);
});
