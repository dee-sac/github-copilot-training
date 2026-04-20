# Tech stack for RSS Feed Reader

Our RSS feed reader will use a Node.js API backend and a React frontend. This combination allows for rapid development of the MVP while supporting future production-ready enhancements.

## Why Node.js + React?

Building an RSS feed reader with a **Node.js (Express)** backend and a **React** frontend offers several advantages:

1. **Quick Development**: Both technologies have mature ecosystems with minimal setup, allowing for rapid development of the demonstration.

2. **Separation of Concerns**: The backend handles data management and (in Extended-MVP) feed operations, while the frontend focuses on user interaction.

3. **Cross-Platform**: Both Node.js and React are cross-platform, allowing the application to run on Windows, macOS, and Linux.

4. **Incremental Complexity**: Start with simple subscription management (MVP), then add feed fetching (Extended-MVP), then add persistence and advanced features.

5. **Future-Ready Architecture**: While the MVP is minimal (just subscription list management), this architecture supports adding:

   - Feed fetching and parsing (`rss-parser` or `feedparser`)
   - Database persistence (SQLite via `better-sqlite3` or Prisma)
   - Background processing (node-cron or Bull queue for polling)
   - Advanced features (read/unread, folders, etc.)

6. **Shared Language**: TypeScript can be used across both frontend and backend, enabling shared types and interfaces.

## Responsibilities

For the MVP (subscription management only):

**Backend** is responsible for:

- Exposing an API to add subscriptions
- Storing subscriptions in memory
- Returning the list of subscriptions

**Frontend** is responsible for:

- Subscription management UI (input field + add button)
- Displaying the list of subscriptions

For the Extended-MVP (add feed fetching):

**Backend** adds:

- Fetching and parsing RSS/Atom feeds when requested
- Returning feed items to the UI

**Frontend** adds:

- Manual refresh button
- Displaying items (title and link minimum)
- Basic error messages

## MVP-first implementation approach

To deliver the MVP quickly:

**MVP (subscription management only):**

- **Storage**: Use in-memory storage (a plain array or Map). Subscriptions are lost when the app stops.
- **No feed operations**: No HTTP fetching, no parsing library, no feed fetching
- **Focus**: Basic UI and API communication (add subscription, get subscriptions list)

**Extended-MVP (add feed fetching):**

- **Parsing**: Add `rss-parser` for basic RSS/Atom parsing
- **HTTP client**: Use `fetch` (Node 18+) or `node-fetch` for fetching feeds
- **Refresh**: Manual only - no background polling or scheduling
- **Error handling**: Simple "failed to load" messages, no detailed diagnostics
- **Content display**: Plain text only (title + link), no HTML rendering needed

This incremental approach makes development extremely fast while keeping the architecture clean for future enhancements.

## Local development

### React project initialization

When creating a new React project (e.g., via Vite), the template includes example components and pages that should be removed to avoid confusion with MVP features.

**Required cleanup steps:**

1. **Remove template demo content** from `frontend/src/`:
   - Clear the default `App.tsx` content and replace with your subscription UI
   - Remove any example CSS or assets not needed for MVP

2. **Verify the dev server starts cleanly**:

   ```bash
   cd frontend
   npm run dev
   ```

   Navigate to the frontend URL in your browser and confirm no template content remains.

### Port configuration

The backend API and frontend UI run on separate localhost ports. **Port consistency is critical** — the ports must be coordinated between three locations:

1. **Backend port** (defined in `backend/src/server.ts` or via environment variable):

   - Default: `http://localhost:3001`
   - This is where the Express API listens for requests

2. **Frontend port** (Vite dev server default):

   - Default: `http://localhost:5173`
   - This is where the React app runs in development

3. **API base URL** (configured in the frontend, e.g., via `.env` or a config file):

   - Must match the backend port from step 1
   - Example: `VITE_API_BASE_URL=http://localhost:3001/api`

4. **CORS policy** (configured in `backend/src/server.ts`):

   - Must allow the frontend origin from step 2
   - Example: `cors({ origin: 'http://localhost:5173' })`

### Configuration best practices

- **Frontend**: Read API URL from environment variables, don't hardcode:

  ```typescript
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';
  ```

- **Backend CORS**: Allow the actual frontend dev server origin

- **Testing setup**: Before testing, verify:

  1. Backend is running and accessible at the configured port
  2. Frontend environment points to the correct backend port
  3. CORS allows the frontend origin

**For MVP:** Test by adding subscription URLs and verifying they appear in the list.

**For Extended-MVP:** Test with a known-good feed like <https://devblogs.microsoft.com/dotnet/feed/>.

## Future enhancements (post-MVP)

When ready to extend beyond the basic demonstration, this architecture supports:

- **Database persistence**: Add SQLite via `better-sqlite3` or Prisma for storing subscriptions and items between sessions
- **Background polling**: Use `node-cron` or a job queue like Bull to automatically refresh feeds on a schedule
- **HTML sanitization**: Add `DOMPurify` (or `sanitize-html`) to safely display rich content from feeds
- **Website-to-feed discovery**: Use `cheerio` to scrape and find feed URLs from website links
- **Better error handling**: Implement retry logic, timeouts, and detailed error messages
- **Testing**: Add unit and integration tests using Vitest (backend) and React Testing Library (frontend)
- **Optimization**: Implement HTTP caching (ETag/Last-Modified), de-duplication, and performance improvements

## Summary

Node.js (Express) with React provides a straightforward path to building the RSS feed reader incrementally:

- **MVP**: Subscription management only (add + list) — extremely simple, no feed operations
- **Extended-MVP**: Add feed fetching and item display — still simple with in-memory storage and manual refresh
- **Future**: Add persistence, background processing, and advanced features

The architecture is intentionally minimal to enable fast development, while the technology choices support adding production-ready features later without requiring a complete rewrite.
