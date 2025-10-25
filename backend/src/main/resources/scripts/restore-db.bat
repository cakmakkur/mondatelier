@echo off
setlocal enabledelayedexpansion

:: Config
set DB_NAME=mondatelier
set DB_USER=mondatelier
set DB_PASSWORD=mondatelier
set PGHOST=localhost
set PGPORT=5432
set SUPERUSER=postgres

:: Determine dump file path (same folder as this script)
set DUMP_FILE=%~dp0mondatelier.dump

echo Dropping database %DB_NAME% if it exists...
psql -U %SUPERUSER% -h %PGHOST% -p %PGPORT% -d postgres -c "DROP DATABASE IF EXISTS \"%DB_NAME%\";"

echo Creating role %DB_USER% if it doesn't exist...
for /f "tokens=*" %%i in ('psql -U %SUPERUSER% -h %PGHOST% -p %PGPORT% -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='%DB_USER%';"') do set ROLE_EXISTS=%%i
if not "%ROLE_EXISTS%"=="1" (
    psql -U %SUPERUSER% -h %PGHOST% -p %PGPORT% -d postgres -c "CREATE ROLE %DB_USER% LOGIN PASSWORD '%DB_PASSWORD%';"
)

echo Creating database %DB_NAME%...
psql -U %SUPERUSER% -h %PGHOST% -p %PGPORT% -d postgres -c "CREATE DATABASE \"%DB_NAME%\" OWNER %DB_USER%;"

echo Restoring dump from %DUMP_FILE%...
psql -U %DB_USER% -h %PGHOST% -p %PGPORT% -d %DB_NAME% -f "%DUMP_FILE%"

echo Database %DB_NAME% restored successfully.
pause
