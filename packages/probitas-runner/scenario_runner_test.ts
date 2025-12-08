/**
 * Tests for ScenarioRunner
 *
 * @module
 */

import { assertEquals, assertExists } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { ScenarioRunner } from "./scenario_runner.ts";
import type {
  ScenarioDefinition,
  ScenarioOptions,
  StepDefinition,
} from "./types.ts";

const createTestScenario = (
  params?: {
    name?: string;
    options?: ScenarioOptions;
    steps?: StepDefinition[];
  },
): ScenarioDefinition => {
  return {
    name: params?.name ?? "Test Scenario",
    tags: params?.options?.tags ?? [],
    steps: params?.steps ?? [],
  };
};

const createTestStep = (
  overrides?: Partial<StepDefinition>,
): StepDefinition => ({
  kind: "step",
  name: "Test Exec Step",
  fn: () => "result",
  timeout: 5000,
  retry: {
    maxAttempts: 1,
    backoff: "linear",
  },
  ...overrides,
});

describe("ScenarioRunner", () => {
  describe("execution", () => {
    it("runs multiple scenarios", async () => {
      const runner = new ScenarioRunner();
      const scenarios = [
        createTestScenario({
          name: "Scenario 1",
          steps: [createTestStep()],
        }),
        createTestScenario({
          name: "Scenario 2",
          steps: [createTestStep()],
        }),
        createTestScenario({
          name: "Scenario 3",
          steps: [createTestStep()],
        }),
      ];

      const summary = await runner.run(scenarios);

      assertEquals(summary.total, 3);
      assertEquals(summary.passed, 3);
      assertEquals(summary.failed, 0);
    });
  });

  describe("hooks", () => {
    it("executes cleanup from setup even on step failure", async () => {
      const runner = new ScenarioRunner();
      const cleanupExecuted: boolean[] = [];

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "setup",
              fn: () => {
                // Return cleanup function
                return () => {
                  cleanupExecuted.push(true);
                };
              },
            }),
            createTestStep({
              fn: () => {
                throw new Error("Step failed");
              },
            }),
          ],
        }),
      ];

      const summary = await runner.run(scenarios);

      assertEquals(cleanupExecuted.length, 1);
      assertEquals(summary.scenarios[0].status, "failed");
    });
  });

  describe("contexts", () => {
    it("provides step context to resources and setups", async () => {
      const runner = new ScenarioRunner();
      const resourceSnapshots: Array<{
        readonly index: number;
        readonly previous: unknown;
        readonly results: readonly unknown[];
      }> = [];
      const setupSnapshots: Array<{
        readonly index: number;
        readonly previous: unknown;
        readonly results: readonly unknown[];
      }> = [];

      const steps: StepDefinition[] = [
        createTestStep({
          name: "Step 1",
          fn: () => "first",
        }),
        createTestStep({
          kind: "resource",
          name: "lateResource",
          fn: (ctx) => {
            resourceSnapshots.push({
              index: ctx.index,
              previous: ctx.previous,
              results: [...ctx.results],
            });
            return { ready: true };
          },
        }),
        createTestStep({
          kind: "setup",
          fn: (ctx) => {
            setupSnapshots.push({
              index: ctx.index,
              previous: ctx.previous,
              results: [...ctx.results],
            });
          },
        }),
        createTestStep({
          name: "Step 2",
          fn: (ctx) => ctx.previous,
        }),
      ];

      const summary = await runner.run([
        createTestScenario({ steps }),
      ]);

      assertEquals(summary.scenarios[0].status, "passed");
      assertEquals(resourceSnapshots, [{
        index: 1,
        previous: "first",
        results: ["first"],
      }]);
      assertEquals(setupSnapshots, [{
        index: 1,
        previous: "first",
        results: ["first"],
      }]);
    });
  });

  describe("failure handling", () => {
    it("marks scenario as failed when step fails", async () => {
      const runner = new ScenarioRunner();
      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              name: "Failing step",
              fn: () => {
                throw new Error("Test failed");
              },
            }),
          ],
        }),
      ];

      const summary = await runner.run(scenarios);

      assertEquals(summary.failed, 1);
      assertEquals(summary.passed, 0);
      assertEquals(summary.scenarios[0].status, "failed");
      assertEquals(summary.scenarios[0].steps.length, 1);
      assertEquals(summary.scenarios[0].steps[0].status, "failed");
      assertExists(summary.scenarios[0].steps[0].error);
      assertEquals(summary.scenarios[0].steps[0].error?.message, "Test failed");
    });

    it("stops executing remaining steps when a step fails", async () => {
      const runner = new ScenarioRunner();
      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({ name: "Step 1" }),
            createTestStep({ name: "Step 2" }),
            createTestStep({
              name: "Failing step",
              fn: () => {
                throw new Error("Step 3 failed");
              },
            }),
            createTestStep({ name: "Step 4" }),
            createTestStep({ name: "Step 5" }),
          ],
        }),
      ];

      const summary = await runner.run(scenarios);

      assertEquals(summary.scenarios[0].status, "failed");
      // Only 3 steps are executed (remaining steps are not included in results)
      assertEquals(summary.scenarios[0].steps.length, 3);
      assertEquals(summary.scenarios[0].steps[0].status, "passed");
      assertEquals(summary.scenarios[0].steps[1].status, "passed");
      assertEquals(summary.scenarios[0].steps[2].status, "failed");
    });
  });

  describe("execution strategies", () => {
    it("parallel execution with maxConcurrency=0 (unlimited)", async () => {
      const runner = new ScenarioRunner();

      const scenarios = [
        createTestScenario({
          name: "Parallel 1",
          steps: [createTestStep()],
        }),
        createTestScenario({
          name: "Parallel 2",
          steps: [createTestStep()],
        }),
      ];

      const summary = await runner.run(scenarios, {
        maxConcurrency: 0,
      });

      assertEquals(summary.total, 2);
      assertEquals(summary.passed, 2);
    });
  });

  describe("failure strategies", () => {
    it("maxFailures stops after count", async () => {
      const runner = new ScenarioRunner();
      const executed: string[] = [];

      const scenarios = [
        createTestScenario({
          name: "Test 1",
          steps: [
            createTestStep({
              fn: () => {
                executed.push("Test 1");
                throw new Error("Failed");
              },
            }),
          ],
        }),
        createTestScenario({
          name: "Test 2",
          steps: [
            createTestStep({
              fn: () => {
                executed.push("Test 2");
                throw new Error("Failed");
              },
            }),
          ],
        }),
        createTestScenario({
          name: "Test 3",
          steps: [
            createTestStep({
              fn: () => {
                executed.push("Test 3");
              },
            }),
          ],
        }),
      ];

      const summary = await runner.run(scenarios, {
        maxConcurrency: 1,
        maxFailures: 2,
      });

      assertEquals(summary.failed, 2);
      assertEquals(executed.includes("Test 3"), false);
    });

    it("continueAll (maxFailures=0) executes all scenarios", async () => {
      const runner = new ScenarioRunner();

      const scenarios = [
        createTestScenario({
          name: "Test 1",
          steps: [
            createTestStep({
              fn: () => {
                throw new Error("Failed");
              },
            }),
          ],
        }),
        createTestScenario({
          name: "Test 2",
          steps: [createTestStep()],
        }),
        createTestScenario({
          name: "Test 3",
          steps: [createTestStep()],
        }),
      ];

      const summary = await runner.run(scenarios, {
        maxConcurrency: 1,
        maxFailures: 0,
      });

      assertEquals(summary.total, 3);
      assertEquals(summary.failed, 1);
      assertEquals(summary.passed, 2);
    });
  });

  describe("context/store", () => {
    it("includes step results in scenario result", async () => {
      const runner = new ScenarioRunner();

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              name: "Step 1",
              fn: () => "value1",
            }),
            createTestStep({
              name: "Step 2",
              fn: () => "value2",
            }),
          ],
        }),
      ];

      const summary = await runner.run(scenarios);

      assertEquals(summary.scenarios[0].steps.length, 2);
      assertEquals(summary.scenarios[0].steps[0].metadata.name, "Step 1");
      assertEquals(summary.scenarios[0].steps[1].metadata.name, "Step 2");
      assertEquals(summary.scenarios[0].steps[0].value, "value1");
      assertEquals(summary.scenarios[0].steps[1].value, "value2");
    });

    it("shares store between steps", async () => {
      const runner = new ScenarioRunner();

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              fn: (ctx) => {
                ctx.store.set("key", "value");
              },
            }),
            createTestStep({
              fn: (ctx) => {
                return ctx.store.get("key");
              },
            }),
          ],
        }),
      ];

      const summary = await runner.run(scenarios);

      assertEquals(summary.scenarios[0].steps[1].value, "value");
    });
  });

  describe("resource lifecycle", () => {
    it("initializes resources before setup", async () => {
      const order: string[] = [];

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "api",
              fn: () => {
                order.push("resource-init");
                return { [Symbol.dispose]() {} };
              },
            }),
            createTestStep({
              kind: "setup",
              fn: () => {
                order.push("setup");
              },
            }),
            createTestStep({
              fn: () => {
                order.push("step");
              },
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      await runner.run(scenarios);

      assertEquals(order[0], "resource-init");
      assertEquals(order[1], "setup");
      assertEquals(order[2], "step");
    });

    it("disposes resources after cleanup", async () => {
      const order: string[] = [];

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "api",
              fn: () => ({
                [Symbol.dispose]() {
                  order.push("resource-dispose");
                },
              }),
            }),
            createTestStep({
              kind: "setup",
              fn: () => {
                // Return cleanup function
                return () => {
                  order.push("cleanup");
                };
              },
            }),
            createTestStep({
              fn: () => {
                order.push("step");
              },
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      await runner.run(scenarios);

      assertEquals(order, ["step", "cleanup", "resource-dispose"]);
    });

    it("executes full lifecycle in correct order", async () => {
      const order: string[] = [];

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "api",
              fn: () => {
                order.push("resource-init");
                return {
                  [Symbol.dispose]() {
                    order.push("resource-dispose");
                  },
                };
              },
            }),
            createTestStep({
              kind: "setup",
              fn: () => {
                order.push("setup");
                // Return cleanup function
                return () => {
                  order.push("cleanup");
                };
              },
            }),
            createTestStep({
              fn: () => {
                order.push("step");
              },
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      await runner.run(scenarios);

      assertEquals(order, [
        "resource-init",
        "setup",
        "step",
        "cleanup",
        "resource-dispose",
      ]);
    });

    it("disposes resources in reverse order", async () => {
      const disposeOrder: string[] = [];

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "first",
              fn: () => ({
                [Symbol.dispose]() {
                  disposeOrder.push("first");
                },
              }),
            }),
            createTestStep({
              kind: "resource",
              name: "second",
              fn: () => ({
                [Symbol.dispose]() {
                  disposeOrder.push("second");
                },
              }),
            }),
            createTestStep({
              kind: "resource",
              name: "third",
              fn: () => ({
                [Symbol.dispose]() {
                  disposeOrder.push("third");
                },
              }),
            }),
            createTestStep({
              fn: () => {},
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      await runner.run(scenarios);

      assertEquals(disposeOrder, ["third", "second", "first"]);
    });

    it("disposes resources even when scenario fails", async () => {
      let disposed = false;

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "api",
              fn: () => ({
                [Symbol.dispose]() {
                  disposed = true;
                },
              }),
            }),
            createTestStep({
              fn: () => {
                throw new Error("Test error");
              },
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      const summary = await runner.run(scenarios);

      assertEquals(summary.failed, 1);
      assertEquals(disposed, true);
    });

    it("allows resources to depend on earlier resources", async () => {
      let poolValue: unknown;
      let poolDisposed = false;

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "pool",
              fn: () => ({
                type: "pool",
                [Symbol.dispose]() {
                  poolDisposed = true;
                },
              }),
            }),
            createTestStep({
              kind: "resource",
              name: "api",
              fn: (ctx) => {
                const resources = ctx.resources as { pool: { type: string } };
                poolValue = resources.pool;
                return {
                  type: "api",
                  pool: resources.pool,
                  [Symbol.dispose]() {
                    // When api is disposed, pool should still be alive
                    assertEquals(poolDisposed, false);
                  },
                };
              },
            }),
            createTestStep({
              fn: (ctx) => {
                const resources = ctx.resources as {
                  api: { pool: unknown };
                  pool: unknown;
                };
                assertEquals(resources.api.pool, resources.pool);
              },
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      await runner.run(scenarios);

      assertExists(poolValue);
      assertEquals(poolDisposed, true);
    });

    it("allows setup to use resources", async () => {
      const lifecycleLog: string[] = [];

      const scenarios = [
        createTestScenario({
          steps: [
            createTestStep({
              kind: "resource",
              name: "api",
              fn: () => {
                lifecycleLog.push("resource-init");
                return {
                  type: "api",
                  [Symbol.dispose]() {
                    lifecycleLog.push("resource-dispose");
                  },
                };
              },
            }),
            createTestStep({
              kind: "setup",
              fn: (ctx) => {
                lifecycleLog.push("setup");
                const apiResource = ctx.resources.api as { type: string };
                assertEquals(apiResource.type, "api");
                // Return cleanup that also uses resources
                return () => {
                  lifecycleLog.push("cleanup");
                  const cleanupApi = ctx.resources.api as { type: string };
                  assertEquals(cleanupApi.type, "api");
                };
              },
            }),
            createTestStep({
              fn: () => {
                lifecycleLog.push("step");
              },
            }),
          ],
        }),
      ];

      const runner = new ScenarioRunner();
      await runner.run(scenarios);

      assertEquals(lifecycleLog, [
        "resource-init",
        "setup",
        "step",
        "cleanup",
        "resource-dispose",
      ]);
    });
  });
});
