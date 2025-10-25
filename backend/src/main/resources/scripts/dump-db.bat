@echo off
setlocal enabledelayedexpansion

:: Config
set SOURCE_DB=mondatelier
set DUMP_FILE=%~dp0mondatelier.dump
set PGUSER=mondatelier
set PGHOST=localhost
set PGPORT=5432

:: Optional: full path to PostgreSQL bin if not in PATH
:: set PGBIN="C:\Program Files\PostgreSQL\17\bin"

echo Creating dump of database %SOURCE_DB% to %DUMP_FILE%...
:: If PostgreSQL bin is in PATH
pg_dump --clean --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% --file="%DUMP_FILE%" %SOURCE_DB%

:: If PostgreSQL bin is not in PATH, use:
:: "%PGBIN%\pg_dump.exe" --clean --host=%PGHOST% --port=%PGPORT% --username=%PGUSER% --file="%DUMP_FILE%" %SOURCE_DB%

echo Dump created successfully.
pause
