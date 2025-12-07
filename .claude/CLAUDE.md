# Probitas

Scenario-based testing and workflow execution framework for Deno.

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

## Related Documentation

- [Design Philosophy](./design.md) - Architectural decisions and principles
- [Development Patterns](./development.md) - Coding conventions and patterns
- [Package Structure](./structure.md) - Workspace organization and dependencies

---

## STRICT RULES (MUST FOLLOW)

### 1. Git Commit Restriction

**NEVER commit without explicit user permission.**

- Commits are forbidden by default
- Only perform a commit ONCE when the user explicitly grants permission
- After committing, MUST recite this rule:
  > "Reminder: Commits are forbidden by default. I will not commit again unless
  > explicitly permitted."

### 2. Backup Before Destructive Operations

**ALWAYS create a backup before any operation that may lose working tree
state.**

Examples: `git restore`, `git reset`, `git checkout` (with uncommitted changes),
`git stash drop`, file deletion/overwrite of uncommitted work.

### 3. Pre-Completion Verification

BEFORE reporting task completion, run and ensure zero errors/warnings:

```bash
deno task verify
```

### 4. English for Version-Controlled Content

**Use English for ALL content tracked by Git** (code, comments, documentation,
commit messages).

### 5. Worktree Isolation

- **Stay in worktree**: Never leave `.worktrees/{branch}/` during worktree tasks
- **No git stash**: Use backup branches instead (stash is shared across
  worktrees)
