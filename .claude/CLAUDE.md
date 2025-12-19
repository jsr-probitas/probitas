# Probitas

Scenario-based testing and workflow execution framework.

## Quick Reference

- **Runtime**: Deno 2.x
- **Registry**: JSR (`@probitas/*`)
- **Entry point**: `@probitas/probitas` (user-facing API)
- **Example scenarios**: `probitas/*.probitas.ts`

## Commands

```bash
deno task verify      # Run format, lint, type check and tests (USE THIS)
deno task test        # Run tests only
deno task probitas    # Run the CLI (e.g., deno task probitas run)
```
