#!/bin/bash

set -euo pipefail
set -x

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DUMP_FILE="$SCRIPT_DIR/mondatelier.dump"
SOURCE_DB="mondatelier"
PG_BIN="/Applications/Postgres.app/Contents/Versions/17/bin"


# Create a fresh dump from source DB
"$PG_BIN/pg_dump" \
  --clean \
  --host=localhost \
  --port=5432 \
  --username=mondatelier \
  --file="$DUMP_FILE" \
  "$SOURCE_DB"

