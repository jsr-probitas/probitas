# Development Patterns

Coding conventions and development practices for Probitas.

## Module Organization

- **Single entry point**: Each package exports through `mod.ts`
- **Use `export *`**: Prefer `export *` over explicit `export { ... }` in mod.ts
- **Type-only exports**: Use `export type *` for types (tree-shaking)
- **Colocated tests**: `*_test.ts` files adjacent to implementation

## Package Config (deno.json)

```json
{
  "name": "@probitas/{package-name}",
  "version": "0.2.2",
  "exports": "./mod.ts",
  "publish": {
    "exclude": ["**/*_test.ts", "**/*_bench.ts"]
  }
}
```

## User-Facing API

The `@probitas/probitas` package is the primary user-facing API:

```typescript
import { scenario, Skip } from "probitas";

export default scenario("My Test")
  .step("Step 1", () => ({ value: 42 }))
  .step("Step 2", (ctx) => {
    if (ctx.previous.value !== 42) throw new Error();
  })
  .build();
```

Key exports:

- `scenario` - Scenario builder function (from `@probitas/builder`)
- `Skip` - Skip class for conditional skipping (from `@probitas/runner`)
- `StepContext` - Type for step context (from `@probitas/builder`)

## Implementation Style (T-Wada Style)

Follow test-driven development principles:

1. Write a failing test first
2. Write minimal code to make the test pass
3. Refactor while keeping tests green
4. Repeat

## Testing Strategy

**Unit Tests (`*_test.ts`)**

- Test in isolation without external dependencies
- Run with `deno task test`

**Example Scenarios (`probitas/`)**

- Example scenarios for documentation and manual testing
- Files named `*.probitas.ts`
- Run with `deno task probitas run`

## Development Environment

- A Nix flake is provided to supply the Deno toolchain without global installs.
- Enter the shell with `nix develop`, or add `use flake` to `.envrc` and
  `direnv allow` for auto-activation.
