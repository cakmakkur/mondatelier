# Mondatelier contributor guidance

## Repository shape

- `frontend/`: React, TypeScript, Vite, Redux Toolkit.
- `backend/`: Spring Boot, Spring Security, Spring Data JPA, PostgreSQL.
- `uploads/`: local development media only. Do not add new runtime uploads.
- `docs/`: architecture decisions and migration plans.

More specific `AGENTS.md` files under `frontend/` and `backend/` override this
file for their respective trees.

## Working rules

- Preserve unrelated working-tree changes.
- Keep frontend visual changes conservative unless a redesign is explicitly
  requested. Refactors must preserve class names and rendered structure where
  practical.
- Prefer capability-based modules (`community`, `events`, `profile`) over new
  global technical-layer folders.
- Treat IDs, ownership fields, roles, prices, and counters sent by clients as
  untrusted.
- Do not commit credentials, generated build output, dependency directories,
  database dumps, or runtime uploads.
- Keep API contract changes synchronized between the backend and frontend.
- Add or update focused tests with behavior changes.

## Verification

Run the narrowest relevant checks first, then the full checks before handoff:

```sh
cd frontend
npm run check
npm run build

cd ../backend
./mvnw test

cd ..
git diff --check
```

If a required external service prevents a check, report the exact dependency
and preserve the failure output.

## Architecture direction

Read `docs/ARCHITECTURE.md` before introducing a new service, datastore, queue,
or cross-module dependency. The default is a modular monolith backed by
PostgreSQL. Service extraction requires measured scaling or ownership evidence,
not only a preference for another language.
