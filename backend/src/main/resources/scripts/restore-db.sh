#!/bin/bash
set -euo pipefail

DB_NAME="mondatelier"
DB_USER="mondatelier"
DB_PASSWORD="mondatelier"
PGHOST="localhost"
PGPORT="5432"
SUPERUSER="postgres"

# Drop DB if exists
psql -U "$SUPERUSER" -h "$PGHOST" -p "$PGPORT" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"

# Create role if it doesn't exist
psql -U "$SUPERUSER" -h "$PGHOST" -p "$PGPORT" -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" \
  | grep -q 1 || psql -U "$SUPERUSER" -h "$PGHOST" -p "$PGPORT" -d postgres -c "CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD';"

# Create DB
psql -U "$SUPERUSER" -h "$PGHOST" -p "$PGPORT" -d postgres -c "CREATE DATABASE \"$DB_NAME\" OWNER $DB_USER;"

# Restore dump (plain SQL)
DUMP_FILE="$(dirname "$0")/mondatelier.dump"
psql -U "$DB_USER" -h "$PGHOST" -p "$PGPORT" -d "$DB_NAME" -f "$DUMP_FILE"
