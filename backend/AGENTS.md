# Backend contributor guidance

## Boundaries

- New code should be grouped by business capability rather than added to the
  existing global `Controller`, `Service`, `Repository`, and `Model` packages.
- A capability may expose application services and DTOs. Its repositories and
  persistence entities should remain internal to that capability.
- Controllers validate transport input and delegate. They must not implement
  authorization or query repositories directly.
- Derive the acting user and profile from Spring Security. Never authorize an
  operation using a client-supplied owner ID.

## Persistence and APIs

- PostgreSQL is the source of truth.
- Use bounded pagination for collection endpoints. Prefer keyset pagination for
  feeds and timelines.
- Return an empty collection/page at the end of pagination, not `404`.
- Avoid eager collections and mapper-triggered N+1 queries. Prefer explicit
  projections or entity graphs for read models.
- Schema changes require a versioned migration once Flyway is introduced.
- Enforce uniqueness and ownership invariants in the database as well as the
  service layer.
- Use constructor injection and transactional boundaries in application
  services.

## Security and media

- Public endpoints must be explicitly allowlisted.
- Access and refresh tokens are different credential types and must be
  validated with their respective key and token-type claim.
- Secrets come from environment variables or a secret manager.
- Validate upload size and actual media type. Generate server-side names and do
  not serve active content from the application origin.
- Do not return raw exception messages or stack traces to clients.

## Tests

- Tests must be isolated and non-destructive. Never invoke database reset or
  dump scripts from a test application context.
- Use fast unit/slice tests for business rules and PostgreSQL-compatible
  integration tests for native SQL and migrations.
- Run:

```sh
./mvnw test
```
