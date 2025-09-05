#!/bin/bash

set -euo pipefail
set -x

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DUMP_FILE="$SCRIPT_DIR/mondatelier.dump"
SOURCE_DB="mondatelier"
TARGET_DB="mondateliertestdb"
PG_BIN="/Applications/Postgres.app/Contents/Versions/17/bin"

# User with permission to create DB
SUPERUSER="kursat"

# Create a fresh dump from source DB
"$PG_BIN/pg_dump" \
  --clean \
  --host=localhost \
  --port=5432 \
  --username=mondatelier \
  --file="$DUMP_FILE" \
  "$SOURCE_DB"


# Drop and recreate test DB as SUPERUSER
"$PG_BIN/dropdb" --if-exists \
  --host=localhost \
  --port=5432 \
  --username="$SUPERUSER" \
  "$TARGET_DB"

"$PG_BIN/createdb" \
  --host=localhost \
  --port=5432 \
  --username="$SUPERUSER" \
  "$TARGET_DB"

# Change ownership to mondatelier
"$PG_BIN/psql" \
  --host=localhost \
  --port=5432 \
  --username="$SUPERUSER" \
  --dbname="$TARGET_DB" \
  -c "ALTER DATABASE \"$TARGET_DB\" OWNER TO mondatelier;"

# Restore dump as mondatelier
"$PG_BIN/psql" \
  --host=localhost \
  --port=5432 \
  --username=mondatelier \
  --dbname="$TARGET_DB" \
  --file="$DUMP_FILE"
