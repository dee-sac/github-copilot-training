# Data Model: MVP RSS Reader

**Feature**: 001-mvp-rss-reader
**Date**: 2026-04-20

## Entities

### Subscription

Represents a single RSS/Atom feed the user wants to track.

| Field | Type   | Description                                      | Constraints                   |
|-------|--------|--------------------------------------------------|-------------------------------|
| id    | string | Unique identifier for the subscription           | Auto-generated, non-empty     |
| url   | string | The feed URL provided by the user                | Non-empty, non-whitespace     |

**Notes**:
- `id` is generated server-side to uniquely identify each subscription (needed for list rendering keys and future delete operations).
- `url` is the raw string the user submitted. No format validation for MVP (FR-009).
- Duplicates are allowed — the same URL can appear multiple times (per edge case decision in spec).

### Relationships

None. The MVP has a single entity with no relationships.

### State Transitions

None. Subscriptions are created and listed. No update or delete operations in MVP scope.

### Validation Rules

| Rule | Source | Enforcement Point |
|------|--------|-------------------|
| URL must not be empty or whitespace-only | FR-006 | Backend API (request validation) |
| URL must be a string | FR-001 | Backend API (type check) |

### Storage

- **Mechanism**: In-memory array (`Subscription[]`)
- **Lifecycle**: Data exists only while the backend process is running
- **Persistence**: None — intentional for MVP (Assumption: In-memory storage)
