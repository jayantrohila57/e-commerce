# Husky setup (prettier, eslint, build)

Quick notes for this repo — hooks were set up using Husky (v9.x) and use pure husky commands (no lint-staged).

- pre-commit: formats and runs eslint only on staged files (fast)
- pre-push: runs `pnpm run build` (keeps broken builds from being pushed)

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

# create/overwrite pre-push
pnpm dlx husky add .husky/pre-push "pnpm run build"
```

## How the pre-commit hook works

1. Collects staged files using `git diff --cached --name-only --diff-filter=ACM`.
2. Filters for JS/TS/TSX/JSX/JSON/CSS/HTML/MD files.
3. Runs `prettier --write` on those files.
4. Runs `eslint --fix` on those files and re-adds them if changed.
5. Runs an ESLint check on the staged files and aborts the commit if errors remain.

## Why this choice

- The project wanted "pure husky" (no lint-staged) — this approach uses native git to keep commits fast while still ensuring formatting/linting.
- The pre-push build is intentionally heavy to prevent broken code from being pushed; you can change it to a faster smoke test or CI-only build if that suits your workflow.

## Testing the hooks

Make a small change to a `.ts`/`.tsx` file, stage it, then run:

```powershell
git add -A
git commit -m "test husky"
```

If you want to bypass hooks temporarily: `git commit --no-verify` or `git push --no-verify` (not recommended except for emergencies).
