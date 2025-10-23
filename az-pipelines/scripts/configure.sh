#!/usr/bin/env bash
set -euo pipefail

echo "Using Yarn via Corepack"
corepack enable || true
corepack prepare yarn@stable --activate || true

yarn --version

#cache directory can differ by Yarn major; skipping custom cache path keeps it simple & reliable.
yarn install --frozen-lockfile

node -v
