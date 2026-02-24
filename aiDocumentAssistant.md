# Ask-Mode Chat MVP — Plan of Action

## Goal
Ship a working chat panel for a Resume/Cover Letter doc where the user can **Ask** questions and get an AI response.  
Keep the data model and controllers **extensible** so **Review/Draft** can be layered on later with minimal changes.

---

## Phase 0 — Minimal data model (future-proof)

### 0.1 Create `AIThread` model/collection
Fields (minimum + extensible):
- `userId` (ObjectId)
- `docType` (`"resume"` | `"cover_letter"`)
- `documentId` (ObjectId)
- `baseVersionId` (ObjectId)
- `openaiPreviousResponseId` (string | null)  
- `createdAt`, `updatedAt`

Notes:
- `openaiPreviousResponseId` is the only OpenAI “state pointer” you need for Ask-mode chaining.

### 0.2 Create `AIMessage` model/collection
Fields:
- `threadId` (ObjectId)
- `userId` (ObjectId)
- `role` (`"user"` | `"assistant"`)
- `mode` (`"ASK"` | `"REVIEW"` | `"DRAFT"`) — **store it now**, use `"ASK"` only for MVP
- `text` (string)
- `artifacts` (mixed/json | null) — leave unused for MVP
- `openaiResponseId` (string | null) — set for assistant messages
- `createdAt`

Why this works later:
- Review/Draft can attach structured output to `artifacts` without changing tables.

---

## Phase 1 — Backend routes/controllers (Ask-mode only)

### 1.1 Add router: `/api/ai`
Implement these routes:

#### POST `/api/ai/threads`
Creates a new chat thread scoped to a doc + base version.
Request body:
- `docType`
- `documentId`
- `baseVersionId`

Controller responsibilities:
- Auth: require logged-in user.
- Ownership:
  - confirm `documentId` belongs to `req.user.id`
  - confirm `baseVersionId` belongs to that document + user
- Create `AIThread` with `openaiPreviousResponseId = null`
- Return `{ threadId }`

#### GET `/api/ai/threads/:threadId`
Returns thread metadata for UI.
Controller responsibilities:
- Auth + ownership (thread.userId === req.user.id)
- Return: `{ thread }` (and optionally doc title/version label if you want)

#### GET `/api/ai/threads/:threadId/messages`
Returns messages for a thread (paginate).
Query params:
- `cursor` (optional)
- `limit` (default 25)

Controller responsibilities:
- Auth + ownership
- Return messages sorted asc by createdAt
- Implement cursor pagination (recommended) or basic limit/skip for MVP

#### POST `/api/ai/threads/:threadId/messages`
Accepts a user message, calls OpenAI, stores assistant reply, returns both.
Request body:
- `text` (required)
- `mode` (optional; **ignore or enforce `"ASK"` for MVP**)

Controller responsibilities:
1) Auth + ownership
2) Validate:
   - `text` non-empty
   - enforce `mode === "ASK"` (or set it server-side regardless)
3) Load context:
   - fetch `AIThread`
   - fetch `baseVersion` for `thread.baseVersionId`
   - choose a compact context string:
     - prefer `baseVersion.plainTextExport` (recommended)
     - fallback: generate a quick export from JSON (if needed)
4) Persist the user message:
   - create `AIMessage(role="user", mode="ASK", text)`
5) Call OpenAI (Responses API):
   - pass `previous_response_id = thread.openaiPreviousResponseId` if present
   - include system/dev instructions each time (don’t assume persistence)
   - include doc context (“Here is the resume/cover letter content…”)
6) Persist assistant message:
   - create `AIMessage(role="assistant", mode="ASK", text=assistantText, openaiResponseId=response.id)`
7) Update thread:
   - set `openaiPreviousResponseId = response.id`
8) Return:
   - `{ userMessage, assistantMessage }`

Error handling requirements:
- If OpenAI fails after storing user msg:
  - store an assistant message like `"Sorry — something went wrong generating a response."` OR return a clean error and let UI show retry.
- Log OpenAI errors with correlation IDs, not raw sensitive content.

---

## Phase 2 — OpenAI integration details (Ask-mode)

### 2.1 Define a stable prompt contract
System/developer instructions (high level):
- You are a helpful resume/cover-letter assistant.
- Use ONLY the provided document content as ground truth.
- If user asks for facts not in the document, ask a clarifying question.

User-level input structure (example):
- User message text
- Doc context block (plain text export)
- Optional job description (skip for MVP)

### 2.2 Save OpenAI chaining pointer
- Store `response.id` as `openaiPreviousResponseId` on the thread.
- Next call uses `previous_response_id` to keep conversation continuity.

---

## Phase 3 — Frontend UI (Ask-mode only, but extensible)

### 3.1 Add ChatPanel component to Document page
Layout:
- Right-side drawer/panel (or section) titled “Assistant”
- Message list (scrollable)
- Composer input (textarea)
- Send button
- Mode dropdown **present but locked to Ask** (or hidden with default `"ASK"`)

### 3.2 Thread lifecycle in UI
When opening a document/version:
- Try to load existing thread for `{documentId, baseVersionId}` (optional optimization)
- Otherwise create a new thread:
  - `POST /api/ai/threads`
- Store `threadId` in component state (and optionally in URL query params)

### 3.3 Message flow in UI
On Send:
1) Optimistically append the user message to the UI.
2) POST message:
   - `POST /api/ai/threads/:threadId/messages` with `{ text, mode: "ASK" }`
3) While waiting:
   - show “Assistant is typing…” indicator
4) On response:
   - append assistant message
5) On error:
   - show error + “Retry” button (resend last message)

### 3.4 “Actually usable” UX details
- Auto-scroll to bottom on new messages (unless user scrolled up)
- Preserve line breaks / markdown rendering in assistant messages
- Allow copy button per assistant message
- Show timestamps subtly
- Basic empty states:
  - “Ask me anything about this resume/cover letter…”

---

## Phase 4 — Guardrails & readiness for Review/Draft

### 4.1 Data model already supports future modes
- `AIMessage.mode` exists (ASK/REVIEW/DRAFT)
- `AIMessage.artifacts` exists (null for now)

### 4.2 Controller design supports future modes without new routes
Keep `POST /messages` as the single entry point.
Later:
- `mode=REVIEW` → return `artifacts.suggestions`
- `mode=DRAFT` → return `artifacts.proposal`
Add later endpoint only when needed:
- `POST /api/ai/messages/:messageId/apply` (apply proposal → create new doc version)

### 4.3 Minimal acceptance criteria for Ask-mode MVP
Backend:
- Threads can be created and retrieved
- Messages can be posted and fetched
- OpenAI responses are stored and chained
Frontend:
- Chat panel loads, displays history, sends messages, receives replies
- Resilient to refresh (history persists)
- Clear error states and retry

---

## Implementation checklist (sequence)
1) Create Mongo models: `AIThread`, `AIMessage`
2) Add `/api/ai` router + 4 controllers
3) Add OpenAI client wrapper + response parsing helper
4) Add ChatPanel UI and wire to endpoints
5) Add pagination + basic loading states
6) Add logging + error handling
7) Manual test:
   - create thread, ask multiple questions, refresh page, verify history + continuity
8) Cleanup:
   - ensure ownership checks everywhere
   - ensure no sensitive data is logged