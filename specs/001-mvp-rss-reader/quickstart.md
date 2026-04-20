# Quickstart: MVP RSS Reader

**Feature**: 001-mvp-rss-reader

## Prerequisites

- Node.js LTS (≥ 18)
- npm (comes with Node.js)

## Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend (terminal 1)

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001/api`.

### Start the frontend (terminal 2)

```bash
cd frontend
npm run dev
```

The UI will be available at `http://localhost:5173`.

## Verify It Works

1. Open `http://localhost:5173` in your browser.
2. You should see an empty subscription list with a prompt to add feeds.
3. Paste a URL (e.g., `https://devblogs.microsoft.com/dotnet/feed/`) into the input field.
4. Click the "Add" button (or press Enter).
5. The URL should appear in the subscription list immediately.
6. Add a few more URLs — they should all appear in order.

## Running Tests

### Backend tests

```bash
cd backend
npm test
```

### Frontend tests

```bash
cd frontend
npm test
```

## Quality Checks

```bash
# From backend/ or frontend/ directories:
npm run check    # Type-check (zero errors required)
npm run lint     # ESLint (zero violations required)
npm run format   # Prettier formatting
```

## Known Limitations (MVP)

- Subscriptions are stored in memory only — restarting the backend clears all data.
- No URL validation — any non-empty string is accepted.
- No feed fetching or content display — this is subscription management only.
- Single user, localhost only.
