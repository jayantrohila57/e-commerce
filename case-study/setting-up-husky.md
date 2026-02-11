# Husky — Full Setup Case Study

A concise guide showing how to set up Husky for a modern TypeScript / Next.js project, with pre-commit and pre-push hooks, a recommended pre-commit helper script, and optional CI checks.

---

## Project structure (example)

Simple layout used by this case study:

```
project/
  .husky/
  scripts/
  src/
  package.json
  prettier.config.json
  .eslintrc.json
```

## Install Husky

Install and set up Husky (pnpm example):

```sh
pnpm add -D husky
pnpm exec husky init
```

This creates a `.husky/` folder (with `pre-commit` and a placeholder `_` file by default).

---

## .gitattributes (example)

If you want CRLF for most app files but LF for shell scripts, add an entry similar to:

```
* text=auto
*.sh text eol=lf
*.ts text eol=crlf
*.tsx text eol=crlf
*.js text eol=crlf
*.json text eol=crlf
*.yaml text eol=crlf
*.yml text eol=crlf
*.md text eol=crlf
```

---

## Prettier config (prettier.config.json)

Example prettier settings used in this repo:

```json
{
  "printWidth": 120,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "singleAttributePerLine": true,
  "objectWrap": "preserve",
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "bracketSameLine": false,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "crlf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Example ESLint config (.eslintrc.json)

Solid TypeScript / Next.js base template (tweak to your needs):

```json
{
  "extends": ["next", "next/core-web-vitals", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  "plugins": ["@typescript-eslint", "simple-import-sort", "prettier"],
  "rules": {
    "prettier/prettier": ["error"],
    "@typescript-eslint/no-unused-vars": ["error"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
}
```

---

## package.json — relevant scripts & devDependencies

Scripts and devDependencies used in the examples in this doc:

```json
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "check": "pnpm run typecheck && pnpm exec eslint . --ext .js,.jsx,.ts,.tsx --max-warnings=0"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "prettier": "3.6.2",
    "prettier-plugin-tailwindcss": "0.7.1",
    "eslint": "9",
    "@typescript-eslint/eslint-plugin": "8.40.0",
    "@typescript-eslint/parser": "8.40.0",
    "eslint-plugin-prettier": "5.5.4",
    "eslint-plugin-simple-import-sort": "12.1.1"
  }
}
```

---

## Recommended pre-commit helper: scripts/husky-pre-commit.sh

Create a `scripts` folder and add a script that runs formatting and lint fixes only on staged files. This reduces time spent running full repo formatters during commits and avoids touching unrelated files.

Create the folder (POSIX/macOS/Linux shown — on Windows use Git Bash or WSL for `mkdir -p`):

```sh
mkdir -p scripts
```

Example `scripts/husky-pre-commit.sh` (POSIX shell):

```sh
#!/usr/bin/env sh
set -e

# Get staged files (Added / Copied / Modified)
STAGED=$(git diff --cached --name-only --diff-filter=ACM)

# Buckets by type
JS_TS=$(echo "$STAGED" | grep -E '\.(js|jsx|ts|tsx)$' || true)
JSON=$(echo "$STAGED" | grep -E '\.json$' || true)
MD=$(echo "$STAGED" | grep -E '\.md$' || true)
YAML=$(echo "$STAGED" | grep -E '\.(yaml|yml)$' || true)
SH=$(echo "$STAGED" | grep -E '\.sh$' || true)

# If nothing relevant is staged, exit early
if [ -z "$JS_TS" ] && [ -z "$JSON" ] && [ -z "$MD" ] && [ -z "$YAML" ] && [ -z "$SH" ]; then
  echo "No staged JS/TS/JSON/MD/YAML/SH files to process"
  exit 0
fi

echo "Staged files:"
echo "$STAGED"
echo

# --- JS/TS: Prettier + ESLint fix
if [ -n "$JS_TS" ]; then
  echo "Formatting JS/TS with Prettier..."
  echo "$JS_TS" | xargs pnpm exec prettier --write

  echo "Running ESLint --fix on JS/TS..."
  echo "$JS_TS" | xargs pnpm exec eslint --fix --ext .js,.jsx,.ts,.tsx
fi

# --- JSON: Prettier
if [ -n "$JSON" ]; then
  echo "Formatting JSON with Prettier..."
  echo "$JSON" | xargs pnpm exec prettier --write
fi

# --- Markdown: Prettier
if [ -n "$MD" ]; then
  echo "Formatting Markdown with Prettier..."
  echo "$MD" | xargs pnpm exec prettier --write
fi

# --- YAML: Prettier
if [ -n "$YAML" ]; then
  echo "Formatting YAML with Prettier..."
  echo "$YAML" | xargs pnpm exec prettier --write
fi

# --- Shell scripts (optional tools: shfmt / shellcheck)
# Uncomment and install tools if you want to lint/format shell scripts
# if [ -n "$SH" ]; then
#   echo "Formatting shell scripts with shfmt..."
#   echo "$SH" | xargs shfmt -w
#
#   echo "Linting shell scripts with shellcheck..."
#   echo "$SH" | xargs shellcheck
# fi

# Re-add everything we may have changed
echo
echo "Re-adding formatted files to git index..."
echo "$STAGED" | xargs git add --

# Final strict ESLint check on JS/TS (no warnings allowed)
if [ -n "$JS_TS" ]; then
  echo
  echo "Running final ESLint check on JS/TS (no warnings allowed)..."
  echo "$JS_TS" | xargs pnpm exec eslint --ext .js,.jsx,.ts,.tsx --max-warnings=0
fi

echo
echo "✅ Pre-commit checks passed."
```

> Note: On Windows ensure this file uses LF line endings (not CRLF) otherwise POSIX shells may fail.

After creating the file, make it executable so Git preserves the mode:

```sh
git add --chmod=+x scripts/husky-pre-commit.sh
```

---

## .husky/pre-commit

Replace or create `.husky/pre-commit` with:

```sh
#!/usr/bin/env sh
pnpm exec sh ./scripts/husky-pre-commit.sh
```

Then mark it executable:

```sh
git add --chmod=+x .husky/pre-commit
```

---

## .husky/pre-push

Create `.husky/pre-push` to run a strict check before pushing:

```sh
#!/usr/bin/env sh
pnpm run check
```

Mark it executable:

```sh
git add --chmod=+x .husky/pre-push
```

The `check` script in `package.json` used above is:

```json
"check": "pnpm run typecheck && pnpm exec eslint . --ext .js,.jsx,.ts,.tsx --max-warnings=0"
```

---

## Optional GitHub Actions CI (recommended)

Create `.github/workflows/ci.yml` to run checks for every push and PR:

```yaml
name: CI

on:
  push:
    branches: ['main', 'master']
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm run typecheck
      - run: pnpm run lint
      - run: pnpm run build
```

---

## Flow summary

- pre-commit: runs only on staged files — formats JS/TS/JSON/MD/YAML, optionally shell scripts, re-adds formatted files, then strict ESLint on staged JS/TS (fail on warnings).
- pre-push: runs `pnpm run check` (typecheck + full ESLint with --max-warnings=0).
- CI: runs typecheck, lint, and build on push/PR to main branches.

---

If you'd like, I can also add the scripts and `.husky` files to the repository and mark them executable — would you like me to do that next?
