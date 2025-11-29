# CLI Reference

Command-line interface for Probitas.

## Installation

```bash
deno install -gAf -n probitas jsr:@lambdalisue/probitas/cli
```

To update: `deno install -gAfr -n probitas jsr:@lambdalisue/probitas/cli`

## Commands

### run

Execute scenarios.

```
probitas run [paths...] [options]
```

**Arguments:**

- `paths` - Files or directories (default: current directory)

**Options:**

| Option              | Short | Description                                |
| ------------------- | ----- | ------------------------------------------ |
| `--selector`        | `-s`  | Filter scenarios (repeatable)              |
| `--include`         |       | Include file pattern                       |
| `--exclude`         |       | Exclude file pattern                       |
| `--reporter`        |       | Output format: list/dot/json/tap           |
| `--max-concurrency` |       | Parallel limit (default: unlimited)        |
| `--max-failures`    |       | Stop after N failures                      |
| `--sequential`      | `-S`  | Run sequentially (= --max-concurrency 1)   |
| `--fail-fast`       | `-f`  | Stop on first failure (= --max-failures 1) |
| `--quiet`           | `-q`  | Errors only                                |
| `--verbose`         | `-v`  | Verbose output                             |
| `--debug`           | `-d`  | Debug output                               |
| `--no-color`        |       | Disable colors                             |
| `--config`          |       | Config file path                           |
| `--help`            | `-h`  | Show help                                  |

### list

List available scenarios.

```
probitas list [options]
```

**Options:** `-s`, `--include`, `--exclude`, `--json`, `--config`, `-h`

### init

Initialize project.

```
probitas init [--force]
```

Creates `deno.json` and `scenarios/example.scenario.ts`.

## Selector Syntax

```
[!][type:]value
```

| Component | Description                       |
| --------- | --------------------------------- |
| `!`       | Negation (exclude matching)       |
| `type:`   | `tag:` or `name:` (default: name) |
| `value`   | Match value (case-insensitive)    |

**Logic:**

- Multiple `-s` flags: OR
- Comma in selector: AND
- `!` prefix: NOT

**Examples:**

```bash
-s tag:smoke                  # Has smoke tag
-s login                      # Name contains "login"
-s "!tag:slow"                # NOT slow tag
-s "tag:api,!tag:flaky"       # api AND NOT flaky
-s tag:api -s tag:db          # api OR db
```

## File Discovery

**Default pattern:** `**/*.scenario.ts`

**Priority:**

1. Explicit file paths (direct)
2. `--include` / `--exclude` options
3. Config file `includes` / `excludes`
4. Default pattern

## Configuration

In `deno.json` or `deno.jsonc`:

```json
{
  "probitas": {
    "includes": ["scenarios/**/*.scenario.ts"],
    "excludes": [],
    "reporter": "list",
    "maxConcurrency": 4,
    "maxFailures": 0,
    "selectors": ["!tag:wip"]
  }
}
```

CLI options override configuration.

## Environment Variables

| Variable          | Description            |
| ----------------- | ---------------------- |
| `NO_COLOR`        | Disable colored output |
| `PROBITAS_CONFIG` | Config file path       |

## Exit Codes

| Code | Meaning              |
| ---- | -------------------- |
| 0    | All scenarios passed |
| 1    | One or more failed   |
| 2    | Usage/config error   |
| 4    | No scenarios found   |

## Execution Model

Probitas runs scenarios in a subprocess with:

- Project's `deno.json` configuration (import maps)
- Dependency isolation via Deno scopes
- Automatic temporary config cleanup

This ensures user dependencies don't conflict with Probitas internals.

## Related

- [Guide](./guide.md) - Usage examples
- [Architecture](./architecture.md) - Design overview
