# Husky setup (prettier, eslint, build)

Quick notes for this repo — hooks were set up using Husky (v9.x) and use pure husky commands (no lint-staged).

- pre-commit: formats and runs eslint only on staged files (fast)
- pre-push: runs `pnpm run check` (fast typecheck + lint). Full `pnpm run build` is recommended for CI only.

## Install / enable hooks

Run this once after pulling / cloning (PowerShell):

```powershell
pnpm install
pnpm run prepare
```

You can also explicitly run:

```powershell
pnpm exec husky install
```

## Add hooks later (pure husky)

Use the husky CLI if you want to add or replace hooks later:

```powershell
# create/overwrite pre-commit
pnpm dlx husky add .husky/pre-commit "pnpm run format && pnpm run lint"

# create/overwrite pre-push (fast checks, keep builds in CI)
pnpm dlx husky add .husky/pre-push "pnpm run check"
```

## How the pre-commit hook works

1. Collects staged files using `git diff --cached --name-only --diff-filter=ACM`.
2. Filters for JS/TS/TSX/JSX files (we limit formatting/linting to code files for speed).
3. Runs `prettier --write` on those files.
4. Runs `eslint --fix` on those files and re-adds them if changed.
5. Runs an ESLint check on the staged files and aborts the commit if errors remain.

## Why this choice

- The project wanted "pure husky" (no lint-staged) — this approach uses native git to keep commits fast while still ensuring formatting/linting.
- The pre-push hook now runs fast checks (TypeScript typecheck + ESLint) so pushes are quicker. Full builds remain useful and should run in CI to prevent regressions from being merged.

## Testing the hooks

Make a small change to a `.ts`/`.tsx` file, stage it, then run:

```powershell
git add -A
git commit -m "test husky"
```

If you want to bypass hooks temporarily: `git commit --no-verify` or `git push --no-verify` (not recommended except for emergencies).

## Troubleshooting: JSON parse / install errors

- If `pnpm install` errors with a JSON parse message (e.g. "Expected ',' or '}' after property value"), it means `package.json` is invalid JSON. Fix any missing commas or stray characters and try again.
- After correcting `package.json`, run:

```powershell
pnpm install
pnpm run prepare
```

- `pnpm run prepare` (or `pnpm exec husky install`) creates the Husky helper files (`.husky/_/husky.sh`) and sets Git's `core.hooksPath` so hooks actually run.
- If you commit `.husky/*` before running `pnpm install`, Git won't run the hooks until `prepare`/`husky install` has been executed locally.
\n\n# test: hooks compatibility update
