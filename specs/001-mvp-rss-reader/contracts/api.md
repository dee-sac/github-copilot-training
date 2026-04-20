# API Contract: MVP RSS Reader

**Feature**: 001-mvp-rss-reader
**Base URL**: `http://localhost:3001/api`

## Endpoints

### GET /api/subscriptions

Retrieve all subscriptions.

**Request**: No body, no query parameters.

**Response** (200 OK):
```json
{
  "data": [
    { "id": "abc123", "url": "https://example.com/feed.xml" },
    { "id": "def456", "url": "https://blog.example.com/rss" }
  ]
}
```

**Response** (200 OK, empty list):
```json
{
  "data": []
}
```

**Notes**:
- Always returns 200 with the current list (even if empty).
- Items are ordered by insertion time (oldest first).

---

### POST /api/subscriptions

Add a new subscription.

**Request**:
```json
{
  "url": "https://example.com/feed.xml"
}
```

| Field | Type   | Required | Constraints              |
|-------|--------|----------|--------------------------|
| url   | string | Yes      | Non-empty, non-whitespace |

**Response** (201 Created):
```json
{
  "data": { "id": "abc123", "url": "https://example.com/feed.xml" }
}
```

**Response** (400 Bad Request — empty or missing URL):
```json
{
  "error": "URL is required and must not be empty"
}
```

**Response** (400 Bad Request — wrong type or unexpected fields):
```json
{
  "error": "Invalid request body"
}
```

**Notes**:
- The server generates the `id`.
- Duplicate URLs are accepted (no deduplication for MVP).
- Only the `url` field is accepted; extra fields in the request body are ignored.
- Content-Type must be `application/json`.

---

## Response Shape Convention

All responses follow the constitution-mandated shape:

- **Success**: `{ "data": ... }`
- **Error**: `{ "error": "human-readable message" }`

## Error Codes Summary

| Status | Condition                          |
|--------|------------------------------------|
| 200    | Successful retrieval               |
| 201    | Successful creation                |
| 400    | Validation failure (empty URL, bad body) |

## CORS

- Allowed origin: `http://localhost:5173` (Vite dev server)
- Methods: GET, POST
- Headers: Content-Type
