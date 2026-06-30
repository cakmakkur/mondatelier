# Frontend contributor guidance

## UX preservation

- Preserve the existing visual feel unless a redesign is requested.
- Do not rename CSS classes, restructure large rendered trees, or alter spacing,
  colors, typography, animation timing, or responsive behavior as part of an
  unrelated refactor.
- `src/main.css` is currently the runtime stylesheet. The SCSS tree is not a
  verified source of truth; do not assume editing SCSS changes the application.

## Code organization

- Prefer feature folders with colocated API, model, and UI code for new work.
- Keep route composition and global providers in an `app` boundary; keep shared
  primitives in `shared`.
- Use one typed API layer. Do not introduce additional ad hoc `fetch`/Axios
  patterns.
- Remote data belongs in a query/cache layer. Keep durable UI state only when it
  must survive navigation.
- Validate environment variables through one config module. Prefer relative
  application URLs in deployable builds.

## React rules

- Effects must be abortable or ignore stale results when route/query inputs
  change.
- Clean up timers, animation frames, object URLs, observers, interceptors, and
  event listeners.
- Do not perform network requests during render.
- Lazy-load route-level code, especially Three.js and media-heavy features.
- Use stable domain IDs as keys.
- Keep modal payloads typed.

## Verification

```sh
npm run check
npm run build
```

The production build is not a substitute for TypeScript checking.
