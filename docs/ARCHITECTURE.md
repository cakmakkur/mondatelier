# Mondatelier architecture assessment

Status: accepted direction, incremental migration  
Reviewed: 2026-06-30

## Decision

Keep Mondatelier as a modular monolith for the next stage.

The application is small, its capabilities share profile and transactional
data, and its current bottlenecks are query and boundary problems rather than
JVM or HTTP concurrency limits. Replacing the feed backend with Node would add
another authentication implementation, deployment unit, network boundary, and
consistency model without fixing the feed query.

Spring Modulith is a suitable optional guardrail after packages are reorganized:
it models logical modules inside Spring Boot and can validate dependencies and
cycles. See the official [Spring Modulith fundamentals](https://docs.spring.io/spring-modulith/reference/fundamentals.html)
and [module verification](https://docs.spring.io/spring-modulith/reference/verification.html).

## Current system

```text
React/Vite SPA
  ├─ Redux: feed, events, countries, navigation state
  ├─ Context: auth, profile, preferences, modal
  └─ local state: requests and duplicate server caches
          │ JSON + multipart + bearer JWT
Spring Boot application
  ├─ global Controller / Service / Repository / Model layers
  ├─ authentication and local-file media handling
  └─ JPA plus native queries
          │
      PostgreSQL
```

The broad product capabilities are:

- Identity and authentication
- Profiles and preferences
- Artwork and media
- Communities, posts, reactions, comments, and feeds
- Events
- Masterclasses and freelance listings
- Reference data such as countries, cities, and languages

## Main findings

### Release blockers

1. Production-looking database and JWT credentials were committed. They must be
   rotated; replacing the current files does not invalidate Git history.
2. Security permitted all API routes and all remaining requests. Mutation
   routes therefore had no authentication boundary.
3. Post deletion checked ownership against the submitted DTO instead of the
   persisted post. Event creation accepted an arbitrary submitted profile ID.
4. Access and refresh tokens used the same key and claims and were
   interchangeable.
5. Uploads accepted up to 1 GB, trusted filename extensions, and were served
   publicly from the application origin.
6. The sole backend context test depended on local PostgreSQL and activated a
   runner capable of dropping and recreating a database.
7. The root Maven reactor could not parse `frontend/pom.xml`.
8. The frontend production build passed while lint and TypeScript checks failed;
   Vite does not type-check.

### Correctness and contract issues

- Frontend refresh used the wrong HTTP method, URL, and response field.
- Login changed the password before sending it by stripping valid special
  characters.
- Signup sent enum strings while the backend expected a numeric user type; the
  backend also confused account type with subscription profile type.
- Comment creation required a title that the comment UI never rendered.
- Profile routes could retain “own profile” privileges after navigation and the
  artwork view used a hardcoded profile ID.
- Freelance creation used a misspelled environment variable and posted an empty
  form.
- Event week filtering ignored year/month inputs and frontend navigation could
  produce week 0 or 54.
- Optional feed cursors were dereferenced as non-null.
- Empty feed pages were represented as `404`, coupling “not found” to
  pagination.
- Stored post like/reply counters were displayed but not maintained by the
  shown services.
- Reply creation accepted an invalid parent as a root post and did not enforce
  that parent and reply share a community.
- The post controller accepted media that the service ignored.
- Profile preferences were publicly addressable by profile ID.

### Performance and maintainability issues

- “My feed” queried once per followed community, fetched a full limit per
  community, sorted in memory, and did not reapply a global limit.
- DTO mapping traversed lazy associations and eager collections, creating likely
  N+1 queries. Community follower counts materialized follower collections.
- Top-community refresh used one aggregate query followed by up to ten entity
  lookups and mutated a shared list in place.
- Event pages fetched event profiles sequentially and could fetch the same
  profile from both parent and child components.
- Remote state is split across Redux, Context, and component state, with mixed
  raw `fetch` and Axios semantics.
- Route code, including Three.js, was shipped in one initial JavaScript chunk.
- Several effects leak animation frames, event listeners, object URLs, or accept
  stale request results.
- Runtime CSS comes from generated `src/main.css`; the SCSS tree is disconnected
  and can drift.
- There are no schema migrations, frontend tests, focused backend tests, CI
  workflow, health checks, or deployment definition.
- Generated Node binaries and runtime uploads are tracked, making the repository
  unnecessarily large.

## Target module boundaries

The existing layer-first packages should be migrated capability by capability:

```text
com.cakmak.mondatelier
  ├─ auth
  │   ├─ api
  │   ├─ application
  │   └─ internal
  ├─ identity
  │   ├─ profile
  │   └─ preferences
  ├─ community
  │   ├─ api
  │   ├─ feed
  │   ├─ membership
  │   ├─ post
  │   └─ reaction
  ├─ events
  ├─ artwork
  ├─ learning
  ├─ marketplace
  ├─ media
  └─ reference
```

Each top-level module owns its entities, repositories, application services, and
transport adapters. Cross-module calls use a small public application API or a
domain event, not another module's repository.

The frontend should converge incrementally on:

```text
src
  ├─ app/                 router, providers, store
  ├─ features/
  │   ├─ auth/
  │   ├─ community/
  │   ├─ events/
  │   ├─ profile/
  │   └─ artwork/
  └─ shared/
      ├─ api/
      ├─ config/
      ├─ ui/
      └─ styles/
```

RTK Query is the lowest-friction server-cache option because Redux Toolkit is
already installed. Migrate one feature at a time; do not combine that migration
with visual redesign.

## Feed design

The current product does not need a separate feed service. The next design
should be:

1. Query root posts through a membership join in one database query.
2. Order deterministically by `(created_at DESC, id DESC)`.
3. Apply a global bounded limit.
4. Use a validated opaque or structured keyset cursor.
5. Fetch a purpose-built feed projection rather than walking entity graphs.
6. Add partial/composite indexes:

```sql
CREATE INDEX posts_root_feed_idx
  ON posts (created_at DESC, id DESC)
  WHERE parent_post_id IS NULL;

CREATE INDEX posts_community_feed_idx
  ON posts (community_id, created_at DESC, id DESC)
  WHERE parent_post_id IS NULL;

CREATE INDEX posts_replies_idx
  ON posts (parent_post_id, created_at DESC, id DESC);

CREATE UNIQUE INDEX community_profile_unique_idx
  ON community_profile (profile_id, community_id);

CREATE UNIQUE INDEX post_likes_unique_idx
  ON post_likes (profile_id, post_id);
```

Spring Data DTO projections can retrieve purpose-specific read shapes without
materializing full aggregates; see the official
[projection documentation](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html).

Ranking can remain chronological until product requirements justify a score.
Later, a read model may combine recency, relationship, and engagement. Cache
only measured hot reads; do not use Redis as a substitute for correct indexes.

### When to extract the feed

Extract only when evidence shows at least one of:

- Feed reads need independent deployment or scaling.
- Ranking requires a separately built read model.
- Multiple clients need a dedicated aggregation/BFF boundary.
- Realtime fan-out has a distinct availability target.
- A separate team owns the capability and can support its operations.

Node is reasonable for a thin realtime gateway or TypeScript-owned BFF, but it
is not intrinsically faster for this feed. Node's own guidance emphasizes that
event-loop work must remain small and non-blocking; see
[Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop).

## Technology by capability

| Capability | Near-term choice | Introduce something else when |
| --- | --- | --- |
| Core API and transactions | Spring Boot modular monolith | A measured domain boundary needs independent ownership/scaling |
| Primary data | PostgreSQL | Keep as source of truth |
| Feed | PostgreSQL keyset query + projection | Separate read model only after ranking/load evidence |
| Search | PostgreSQL full-text/trigram | OpenSearch when relevance, facets, or corpus size demand it |
| Media bytes | Object storage + CDN | Use local files only for development |
| Media processing | Background worker/queue | As soon as thumbnails/transcoding become user-facing |
| Email/notifications | Queue-backed worker | Before retry/delivery requirements become production-critical |
| Rate limiting/cache | Bounded local development implementation | Redis when there are multiple replicas or measured cache value |
| Realtime | Existing API initially | WebSocket/SSE gateway when live requirements exist |

Media processing and notification delivery are better first extraction
candidates than feed because they are asynchronous, failure-isolatable, and
scale differently from transactional API work.

## Data and API rules

- Derive ownership from authenticated identity.
- Public routes are explicitly allowlisted; new routes default to authenticated.
- Access and refresh credentials have distinct keys/types.
- Collection endpoints return `200` with an empty result at the end.
- Paginated inputs are bounded and sortable fields are allowlisted.
- Dates crossing the API use ISO-8601 instants/offsets.
- Database constraints enforce unique email, profile name, memberships, and
  reactions.
- Add Flyway before the next schema change; use `ddl-auto=validate` once a
  baseline migration exists.
- Use object storage paths/keys in data records, not deployment-relative local
  filesystem assumptions.

## Initial remediation completed

The first implementation pass completed the following without changing the
stylesheet:

- Replaced tracked runtime credentials with environment placeholders and added
  configuration examples.
- Changed write routes to authenticated-by-default and protected private GET
  routes.
- Added distinct access/refresh keys and token-type validation.
- Fixed persisted ownership checks for post deletion and authenticated ownership
  for event, freelance, and masterclass creation.
- Made test database reset opt-in, added an isolated H2 smoke-test profile, and
  added focused token/media tests.
- Replaced the personalized feed's per-community query loop with one globally
  limited membership-join query and normalized empty-page behavior.
- Replaced event week extraction SQL with a year-aware date-range query.
- Added actual freelance/masterclass creation and image persistence for posts.
- Added image signature validation, server-generated names, and a 10 MB image
  limit.
- Made frontend lint and TypeScript checks pass, repaired the main auth/form/
  pagination defects, cleaned effect resources, and split routes into chunks.
- Repaired the Maven reactor and assigned frontend build ownership to the
  frontend module.

These changes do not rotate credentials already exposed in Git history, create
production indexes, add schema migrations, or move stored media to object
storage. Those remain deployment prerequisites.

## Delivery roadmap

### Phase 0 — contain immediate risk

- Rotate committed credentials and require environment-provided secrets.
- Default-deny write routes and repair ownership checks.
- Distinguish access/refresh tokens.
- Disable destructive test reset behavior by default.
- Bound and validate uploads.

### Phase 1 — establish reliable gates

- Make root Maven configuration parse and use deterministic npm installation.
- Make lint, TypeScript, frontend build, and backend tests mandatory.
- Add isolated smoke/unit tests and a PostgreSQL integration-test path.
- Add CI, dependency scanning, and setup documentation.

### Phase 2 — stabilize contracts and queries

- Centralize frontend configuration and the HTTP client.
- Repair auth refresh, signup, comments, profile routing, and freelance forms.
- Replace per-community feed queries with one indexed query.
- Return projections and eliminate measured N+1 paths.
- Add date-range event queries and bounded highlights.

### Phase 3 — modularize incrementally

- Move `community` first because it contains the largest coupling hotspot.
- Move `events`, then `identity`, `artwork`, and marketplace/learning.
- Add Spring Modulith verification once at least two capability packages exist.
- Migrate frontend server state feature by feature to RTK Query.

### Phase 4 — production operations

- Add Flyway migrations, object storage/CDN, structured logs, Actuator health
  and metrics, backups, and deployment configuration.
- Add a queue/worker for media and notifications.
- Load-test feed and event queries before considering service extraction.

## Explicit non-goals for the initial remediation

- No visual redesign.
- No broad CSS rewrite or SCSS switchover without screenshot parity checks.
- No big-bang Java package move.
- No microservice split.
- No Redis/OpenSearch adoption without measurements.
