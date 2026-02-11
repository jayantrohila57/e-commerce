#!/usr/bin/env sh
set -e

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
  echo "No staged JS/TS files to format or lint"
  exit 0
fi

echo "$STAGED_FILES" | xargs pnpm exec prettier --write
echo "$STAGED_FILES" | xargs pnpm exec eslint --fix --ext .js,.jsx,.ts,.tsx
echo "$STAGED_FILES" | xargs git add --
echo "$STAGED_FILES" | xargs pnpm exec eslint --ext .js,.jsx,.ts,.tsx --max-warnings=0
