<!--
Sync Impact Report
===================
Version change: 1.0.0 → 1.1.0
Bump type: MINOR — new principle added (Security),
  material expansion of API Design and Technology Stack
  to cover full-stack (React frontend).
Modified principles:
  - IV. Express API Design → IV. API & Frontend Design
    (expanded to cover React frontend responsibilities)
Added sections / principles:
  - VI. Security by Default (new principle)
  - Frontend layer in Technology Stack Constraints table
  - Frontend scripts in Scripts Reference table
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible (no conflicts)
  - .specify/templates/spec-template.md ✅ compatible (no conflicts)
  - .specify/templates/tasks-template.md ✅ compatible (no conflicts)
  - .specify/templates/checklist-template.md ✅ compatible (no conflicts)
  - .specify/templates/constitution-template.md ✅ source template (unchanged)
Follow-up TODOs: None
-->

# RSS Feed Reader Constitution

## Core Principles

### I. Type Safety First

All application code MUST be written in TypeScript with `strict: true`
enabled in both the backend and frontend projects. The `any` type is
prohibited in production code; use `unknown` with type narrowing when
the type is genuinely uncertain. Type assertions (`as`) MUST be
justified and limited to framework boundaries (e.g., Express middleware
typing, React event handlers). All function signatures MUST have
explicit return types at module boundaries (exported functions).

**Rationale**: Strict typing catches entire categories of bugs at
compile time and serves as living documentation of data contracts.

### II. Test-Driven Development (NON-NEGOTIABLE)

Every feature MUST have tests written before or alongside
implementation. The minimum standard is:

- **Backend**: Unit tests for all exported functions and utility modules;
  integration tests for Express route handlers using `supertest` or
  equivalent
- **Frontend**: Component tests using React Testing Library for all
  user-facing components; interaction tests for form submissions and
  state changes
- Backend tests in `backend/tests/` mirroring `backend/src/` structure
- Frontend tests co-located with components (`*.test.tsx`)
- Test files MUST use `.test.ts` or `.test.tsx` suffix
- All tests MUST pass before code is merged
- Coverage regressions are not permitted on existing modules

Red-Green-Refactor: write a failing test, make it pass with minimal
code, then refactor. No production code without a corresponding test.

**Rationale**: Tests are the primary safety net; untested code is
assumed broken.

### III. Code Quality Gates

All code MUST pass the following automated checks before merge:

- `tsc --noEmit` — zero type errors (both backend and frontend)
- `eslint .` — zero lint violations
- `prettier --check .` — formatting compliance
- `vitest run` — all tests pass (backend)
- Frontend test runner passes with zero failures

ESLint configuration MUST extend `@eslint/js` recommended,
`typescript-eslint` recommended, and `eslint-config-prettier`. No lint
rules may be disabled inline (`eslint-disable`) without a comment
explaining why. Prettier is the sole authority on formatting; do not
configure conflicting ESLint style rules.

**Rationale**: Automated quality gates eliminate subjective style
debates and guarantee a consistent baseline.

### IV. API & Frontend Design

**Backend**: Express applications MUST use the `createApp()` factory
pattern to enable testability (server instance separate from listen
call). Route handlers MUST:

- Validate input at the boundary (request params, body, query)
- Return appropriate HTTP status codes (not just 200/500)
- Send JSON responses with consistent shape
  (`{ data: ... }` for success, `{ error: ... }` for failure)
- Handle errors via centralized error-handling middleware
- Never leak stack traces or internal details in production responses
- Configure CORS to allow only the known frontend origin

New routes MUST have corresponding integration tests that exercise
the full request/response cycle.

**Frontend**: React components MUST:

- Be functional components using hooks (no class components)
- Keep API calls in dedicated service modules, not inline in components
- Handle loading and error states for every async operation
- Use controlled form inputs with explicit state management

**Rationale**: The factory pattern decouples app creation from server
startup, enabling test isolation. Separating API calls from components
keeps the UI testable and the data layer replaceable.

### V. Simplicity and YAGNI

Do not add abstractions, utilities, or infrastructure until a concrete
need exists. Specifically:

- No premature generic helpers — write specific code first, extract
  when a pattern repeats three or more times
- Prefer standard library and direct framework APIs over wrapper layers
- Keep dependency count minimal; every new dependency MUST be justified
- Files SHOULD remain under 200 lines; split when they exceed 300
- Prefer flat module structures over deep nesting
- MVP scope MUST be respected — do not implement Extended-MVP or
  post-MVP features until the current phase is complete and verified

**Rationale**: Complexity is the primary long-term cost; every
abstraction must earn its keep.

### VI. Security by Default

All code MUST follow secure-by-default practices:

- **Input validation**: Every API endpoint MUST validate and sanitize
  incoming data at the boundary before processing. Reject unexpected
  fields and malformed payloads.
- **Output encoding**: Frontend MUST NOT use `dangerouslySetInnerHTML`
  or equivalent without explicit sanitization (e.g., DOMPurify). React
  JSX escaping is the default; do not bypass it.
- **Dependency hygiene**: Run `npm audit` regularly. Dependencies with
  known critical or high vulnerabilities MUST be updated or replaced
  before merge.
- **No secrets in code**: API keys, tokens, and credentials MUST NOT
  appear in source files. Use environment variables loaded at runtime.
- **CORS**: Backend MUST restrict allowed origins to the known frontend
  URL. Do not use `*` in production.
- **Error disclosure**: Production error responses MUST NOT include
  stack traces, file paths, or internal identifiers.

**Rationale**: Security flaws are the most expensive defects to fix
after deployment. Enforcing secure defaults at the principle level
ensures they are not treated as optional enhancements.

## Technology Stack Constraints

The following stack is authoritative for this project. Deviations MUST
be documented and approved via a constitution amendment.

| Layer           | Technology                        | Version Constraint |
|-----------------|-----------------------------------|--------------------|
| Runtime         | Node.js                           | LTS (≥ 18)        |
| Language        | TypeScript                        | ≥ 5.x, strict     |
| Backend         | Express                           | ^4.x               |
| Frontend        | React                             | ^18.x or ^19.x    |
| Build (frontend)| Vite                              | ^5.x or ^6.x      |
| Test (backend)  | Vitest                            | ^2.x               |
| Test (frontend) | React Testing Library + Vitest    | —                  |
| Linter          | ESLint (flat config)              | ^9.x               |
| Formatter       | Prettier                          | ^3.x               |
| Module System   | ESM (`"type": "module"`)          | —                  |
| Build (backend) | `tsc` (no bundler for server)     | —                  |
| Dev Runner      | `tsx` (backend), `vite` (frontend)| —                  |

### Project Layout

```
backend/
├── src/          # Express API source
├── tests/        # Backend tests
├── dist/         # Compiled output (git-ignored)
└── package.json

frontend/
├── src/          # React application source
├── public/       # Static assets
└── package.json
```

- `dist/`, `node_modules/`, and `.env` files MUST be git-ignored
- Shared TypeScript types MAY live in a top-level `shared/` directory
  if needed; otherwise keep types co-located

## Development Workflow

### Branch Strategy

- `main` is the protected default branch
- Feature work happens on topic branches
- Branches MUST pass all quality gates before merge

### Commit Standards

- Commit messages MUST use conventional format:
  `type(scope): description`
  (e.g., `feat(api): add subscription endpoint`)
- Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`,
  `ci`, `build`
- Each commit SHOULD be atomic — one logical change per commit

### Code Review Requirements

- All changes MUST be submitted via pull request
- PRs MUST include a description of what changed and why
- Quality gate checks MUST pass before review
- Reviewers MUST verify constitution compliance

### Scripts Reference

**Backend** (`backend/package.json`):

| Command          | Purpose                            |
|------------------|------------------------------------|
| `npm run build`  | Compile TypeScript to `dist/`      |
| `npm run dev`    | Run Express server via tsx         |
| `npm test`       | Run all backend tests (vitest run) |
| `npm run lint`   | Run ESLint                         |
| `npm run format` | Format with Prettier               |
| `npm run check`  | Type-check without emitting        |

**Frontend** (`frontend/package.json`):

| Command          | Purpose                            |
|------------------|------------------------------------|
| `npm run dev`    | Start Vite dev server              |
| `npm run build`  | Production build                   |
| `npm test`       | Run frontend tests                 |
| `npm run lint`   | Run ESLint                         |
| `npm run format` | Format with Prettier               |

## Governance

This constitution is the highest-authority document for project
standards. All pull requests and code reviews MUST verify compliance
with these principles.

### Amendment Procedure

1. Propose the change as a PR modifying this file
2. Document rationale for the change
3. Version bump follows semver:
   - MAJOR: principle removal or backward-incompatible redefinition
   - MINOR: new principle or material expansion
   - PATCH: clarifications, wording, typo fixes
4. Update `LAST_AMENDED_DATE` on every change

### Compliance

- Automated checks (lint, type-check, test, format) enforce
  Principles I–III mechanically
- Code reviewers are responsible for verifying Principles IV–VI
- Security concerns (Principle VI) MUST be flagged as blocking in
  code review — they are not deferrable
- Complexity additions MUST be justified in the PR description

**Version**: 1.1.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
