# Probitas Overview

Probitas is a scenario-based testing and workflow execution framework for Deno.

## Write a Basic Scenario
Create `probitas/hello.probitas.ts`:
```typescript
import { scenario, Skip } from "probitas";

export default scenario("Hello Probitas", { tags: ["example"] })
  .step(() => {
    // unnamed steps auto-label as "Step N"
    if (!Deno.env.get("RUN_EXAMPLE")) {
      throw new Skip("Example skipped");
    }
    return { message: "Hello, World!" };
  })
  .step("Verify message", (ctx) => {
    if (ctx.previous.message !== "Hello, World!") {
      throw new Error("Unexpected message");
    }
  })
  .build();
```

### Step Pointers
- Return values to pass to the next step (`ctx.previous`) or share via `ctx.store`.
- Use tags for filtering: `{ tags: ["smoke"] }`.
- Configure retry per step: `.step("Name", fn, { retry: { maxAttempts: 3 } })`.

### Resources and Cleanup
```typescript
export default scenario("DB example")
  .resource("db", async () => {
    const conn = await Database.connect();
    return conn; // disposed automatically
  })
  .step("Query users", (ctx) => ctx.resources.db.query("SELECT * FROM users"))
  .build();
```

## Run Scenarios
- All: `probitas run`
- By tag: `probitas run -s tag:example`
- By name: `probitas run -s "Hello Probitas"`
- Change reporter: `probitas run --reporter dot`

## Configuration (deno.json/deno.jsonc)
```json
{
  "imports": { "probitas": "jsr:@probitas/probitas" },
  "probitas": {
    "includes": ["probitas/**/*.probitas.ts"],
    "excludes": ["**/node_modules/**", "**/.git/**"],
    "reporter": "list"
  }
}
```

## Useful Commands
- `probitas init --force` — overwrite existing config/examples
- `probitas run --reload` — reload imports before execution
- `probitas run -s "!tag:slow"` — exclude tagged scenarios

## Documentation
Full docs: https://jsr-probitas.github.io/documents/index.md
