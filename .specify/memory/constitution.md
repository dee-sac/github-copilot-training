<!--
Sync Impact Report
===================
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: N/A (initial version)
Added sections:
  - Core Principles (5 principles)
  - Technology Stack Constraints
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible (no conflicts)
  - .specify/templates/spec-template.md ✅ compatible (no conflicts)
  - .specify/templates/tasks-template.md ✅ compatible (no conflicts)
Follow-up TODOs: None
-->

# GitHub Copilot Training Constitution

## Core Principles

### I. Type Safety First

All application code MUST be written in TypeScript with `strict: true`
enabled. The `any` type is prohibited in production code; use `unknown`
with type narrowing when the type is genuinely uncertain. Type
assertions (`as`) MUST be justified and limited to framework boundaries
(e.g., Express middleware typing). All function signatures MUST have
explicit return types at module boundaries (exported functions).

**Rationale**: Strict typing catches entire categories of bugs at compile
time and serves as living documentation of data contracts.

### II. Test-Driven Development (NON-NEGOTIABLE)

Every feature MUST have tests written before or alongside implementation
using Vitest. The minimum standard is:

- Unit tests for all exported functions and utility modules
- Integration tests for Express route handlers using `supertest` or
  equivalent
- Tests MUST be co-located in `tests/` mirroring the `src/` structure
- Test files MUST use the `.test.ts` suffix
- All tests MUST pass (`vitest run`) before code is merged
- Coverage regressions are not permitted on existing modules

Red-Green-Refactor: write a failing test, make it pass with minimal
code, then refactor. No production code without a corresponding test.

**Rationale**: Tests are the primary safety net; untested code is
assumed broken.

### III. Code Quality Gates

All code MUST pass the following automated checks before merge:

- `tsc --noEmit` — zero type errors
- `eslint .` — zero lint violations
- `prettier --check .` — formatting compliance
- `vitest run` — all tests pass

ESLint configuration MUST extend `@eslint/js` recommended,
`typescript-eslint` recommended, and `eslint-config-prettier`. No lint
rules may be disabled inline (`eslint-disable`) without a comment
explaining why. Prettier is the sole authority on formatting; do not
configure conflicting ESLint style rules.

**Rationale**: Automated quality gates eliminate subjective style debates
and guarantee a consistent baseline.

### IV. Express API Design

Express applications MUST use the `createApp()` factory pattern to
enable testability (server instance separate from listen call). Route
handlers MUST:

- Validate input at the boundary (request params, body, query)
- Return appropriate HTTP status codes (not just 200/500)
- Send JSON responses with consistent shape
- Handle errors via centralized error-handling middleware
- Never leak stack traces or internal details in production responses

New routes MUST have corresponding integration tests that exercise the
full request/response cycle.

**Rationale**: The factory pattern decouples app creation from server
startup, enabling test isolation without port conflicts.

### V. Simplicity and YAGNI

Do not add abstractions, utilities, or infrastructure until a concrete
need exists. Specifically:

- No premature generic helpers — write specific code first, extract when
  a pattern repeats three or more times
- Prefer standard library and direct Express APIs over wrapper layers
- Keep dependency count minimal; every new dependency MUST be justified
- Files SHOULD remain under 200 lines; split when they exceed 300
- Prefer flat module structures over deep nesting

**Rationale**: Complexity is the primary long-term cost; every
abstraction must earn its keep.

## Technology Stack Constraints

The following stack is authoritative for this project. Deviations MUST
be documented and approved via a constitution amendment.

| Layer          | Technology                        | Version Constraint |
|----------------|-----------------------------------|--------------------|
| Runtime        | Node.js                           | LTS (≥ 18)        |
| Language       | TypeScript                        | ≥ 5.x, strict     |
| Framework      | Express                           | ^4.x               |
| Test Runner    | Vitest                            | ^2.x               |
| Linter         | ESLint (flat config)              | ^9.x               |
| Formatter      | Prettier                          | ^3.x               |
| Module System  | ESM (`"type": "module"`)          | —                  |
| Build          | `tsc` (no bundler for server)     | —                  |
| Dev Runner     | `tsx`                             | —                  |

- Output target: ES2022, module: NodeNext
- Source in `src/`, compiled output in `dist/`, tests in `tests/`
- `dist/` and `node_modules/` MUST be git-ignored

## Development Workflow

### Branch Strategy

- `main` is the protected default branch
- Feature work happens on topic branches
- Branches MUST pass all quality gates before merge

### Commit Standards

- Commit messages MUST use conventional format:
  `type(scope): description` (e.g., `feat(api): add health endpoint`)
- Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`,
  `ci`, `build`
- Each commit SHOULD be atomic — one logical change per commit

### Code Review Requirements

- All changes MUST be submitted via pull request
- PRs MUST include a description of what changed and why
- Quality gate checks MUST pass before review
- Reviewers MUST verify constitution compliance

### Scripts Reference

| Command          | Purpose                        |
|------------------|--------------------------------|
| `npm run build`  | Compile TypeScript to `dist/`  |
| `npm run dev`    | Run CLI entry point via tsx    |
| `npm run dev:api`| Run Express server via tsx     |
| `npm test`       | Run all tests (vitest run)     |
| `npm run lint`   | Run ESLint                     |
| `npm run format` | Format with Prettier           |
| `npm run check`  | Type-check without emitting    |

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

- Automated checks (lint, type-check, test, format) enforce Principles
  I–III mechanically
- Code reviewers are responsible for verifying Principles IV–V
- Complexity additions MUST be justified in the PR description

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
