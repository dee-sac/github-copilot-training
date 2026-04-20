# Research: MVP RSS Reader

**Feature**: 001-mvp-rss-reader
**Date**: 2026-04-20

## Research Tasks

### 1. Express + React project structure for TypeScript monorepo

**Decision**: Use a two-package structure (`backend/` and `frontend/`) each with their own `package.json`, `tsconfig.json`, and tooling. No monorepo manager (npm workspaces, turborepo) needed for MVP — the two packages are independent.

**Rationale**: The constitution mandates `backend/` + `frontend/` layout. Keeping them as independent packages avoids monorepo tooling complexity (YAGNI). Each project can be started, tested, and built independently.

**Alternatives considered**:
- Single `package.json` with both: rejected — mixes backend/frontend dependencies, complicates scripts
- npm workspaces / turborepo: rejected — adds tooling overhead for two packages that don't share code yet
- Shared `types/` package: deferred — only needed if types are shared; for MVP, duplicate the single `Subscription` interface

### 2. Express factory pattern with TypeScript

**Decision**: Use `createApp()` function that returns an `express.Application` instance. The `server.ts` file calls `createApp()` and `.listen()`. Tests import `createApp()` directly and use `supertest(app)`.

**Rationale**: Constitution Principle IV mandates the factory pattern. This is the standard testable Express pattern — well-documented, zero additional dependencies.

**Alternatives considered**:
- Class-based Express wrapper: rejected — adds abstraction without value for this scale
- Fastify instead of Express: rejected — constitution mandates Express ^4.x

### 3. React + Vite project setup with TypeScript

**Decision**: Scaffold with `npm create vite@latest frontend -- --template react-ts`. Clean up default template content. Use functional components with hooks.

**Rationale**: Vite is the constitution-mandated build tool. The `react-ts` template provides TypeScript, ESM, and HMR out of the box.

**Alternatives considered**:
- Create React App: rejected — deprecated, uses webpack, slower
- Next.js: rejected — SSR complexity not needed; MVP is a pure SPA

### 4. In-memory storage approach

**Decision**: Use a plain TypeScript array (`Subscription[]`) in a module-level variable. Export functions `addSubscription()` and `getSubscriptions()` from a `store.ts` module.

**Rationale**: Simplest possible approach per YAGNI. No database, no ORM, no external dependency. The array is the backing store for the entire session.

**Alternatives considered**:
- Map keyed by URL: rejected — spec allows duplicates, so Map's uniqueness constraint is wrong
- Class-based store: rejected — a module with exported functions is simpler and equally testable
- SQLite/better-sqlite3: deferred to post-MVP per project goals

### 5. Frontend-to-backend communication

**Decision**: Use the browser `fetch` API directly in a dedicated `api.ts` service module. No axios or other HTTP library. API base URL read from `import.meta.env.VITE_API_BASE_URL` with fallback to `http://localhost:3001/api`.

**Rationale**: `fetch` is built into all modern browsers — no dependency needed. Constitution requires API calls in dedicated service modules, not inline in components.

**Alternatives considered**:
- axios: rejected — adds a dependency for what `fetch` does natively
- React Query / SWR: rejected — caching/refetching complexity not needed for MVP's simple add-and-list flow

### 6. CORS configuration

**Decision**: Use the `cors` npm package in Express, configured to allow only `http://localhost:5173` (Vite dev server default). For production builds served by Express, CORS is unnecessary (same origin).

**Rationale**: Constitution Principle VI mandates restricted CORS origins. The `cors` package is the standard Express middleware.

**Alternatives considered**:
- Manual CORS headers: rejected — error-prone, the `cors` package handles preflight correctly
- Wildcard `*` origin: rejected — explicitly forbidden by constitution

### 7. Testing strategy

**Decision**:
- **Backend**: Vitest + supertest for integration tests of API routes. Unit tests for store module.
- **Frontend**: Vitest + React Testing Library + jsdom for component tests. Test the subscription form submission flow and list rendering.

**Rationale**: Constitution Principles II and III mandate TDD with these exact tools. supertest allows testing Express routes without starting a server. React Testing Library tests user-visible behavior, not implementation.

**Alternatives considered**:
- Jest: rejected — constitution mandates Vitest
- Cypress/Playwright for E2E: deferred — overkill for MVP's two simple interactions
