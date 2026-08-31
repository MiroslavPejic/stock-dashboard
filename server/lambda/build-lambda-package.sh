#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/.build"
DIST_DIR="$SCRIPT_DIR/dist"
ZIP_PATH="$DIST_DIR/stock-api-lambda.zip"

rm -rf "$BUILD_DIR" "$DIST_DIR"
mkdir -p "$BUILD_DIR" "$DIST_DIR"

cp "$SCRIPT_DIR/stockApi.mjs" "$BUILD_DIR/index.mjs"

cat > "$BUILD_DIR/package.json" <<'JSON'
{
  "name": "stock-api-lambda",
  "private": true,
  "type": "module",
  "dependencies": {
    "yahoo-finance2": "^4.0.2"
  }
}
JSON

cd "$BUILD_DIR"
npm install --omit=dev

zip -rq "$ZIP_PATH" index.mjs node_modules package.json package-lock.json

echo "Created Lambda package: $ZIP_PATH"
