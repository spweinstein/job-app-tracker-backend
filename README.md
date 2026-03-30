ver m## Job App Tracker Backend API

### AI Ask-Mode Chat (MVP)

This backend exposes a minimal AI Ask-mode chat feature scoped to resume and cover letter documents.

- **Models**
  - **AIThread** (`models/aiThreadModel.js`)
    - Fields: `userId`, `scope` (`"DOCUMENT"` or `"GENERAL"`), `docType` (`"resume"` or `"cover_letter"` for document threads), `documentId`, `openaiPreviousResponseId`, timestamps.
    - Validation:
      - If `scope === "DOCUMENT"` → `documentId` and `docType` are required.
      - If `scope === "GENERAL"` → `documentId` is forced to `null` and `docType` is cleared.
    - Indexes:
      - Compound index `{ userId, scope, documentId }` with uniqueness for `scope="DOCUMENT"` to prevent duplicate document threads per user.
  - **AIMessage** (`models/aiMessageModel.js`)
    - Fields: `threadId`, `userId`, `role` (`"user"` or `"assistant"`), `mode` (`"ASK"`, `"REVIEW"`, `"DRAFT"` — currently always `"ASK"`), `text`, `artifacts` (JSON), `openaiResponseId`, `createdAt`.
    - Indexed by `threadId` + `createdAt` for efficient thread history queries.

- **Endpoints** (all under `/api/ai`, auth required)
  - **POST `/api/ai/threads`**
    - Body: `{ docType, documentId }` where `docType` is `"resume"` or `"cover_letter"`.
    - Behavior:
      - Validates that `documentId` belongs to the authenticated user via `owner`.
      - Creates or reuses a thread for `{ userId, scope="DOCUMENT", documentId }`.
      - Persists `docType` on the thread.
    - Response: `{ threadId, thread }`.
  - **GET `/api/ai/threads/:threadId`**
    - Returns the thread if `thread.userId === req.user._id`.
    - Response: `{ thread }`.
  - **GET `/api/ai/threads/:threadId/messages?cursor=&limit=`**
    - Enforces thread ownership.
    - Returns messages sorted ascending by `createdAt` with simple cursor-based pagination.
    - Response: `{ messages, nextCursor }` where `nextCursor` is `null` when there are no more messages.
  - **POST `/api/ai/threads/:threadId/messages`**
    - Body: `{ text }` (server forces `mode="ASK"`).
    - Behavior:
      - Auth + ownership checks for the thread.
      - Enforces `scope="DOCUMENT"` (returns `400` for `GENERAL` threads, which are not yet supported).
      - Persists the user message first as an `AIMessage` (`role="user"`, `mode="ASK"`).
      - Reloads the referenced `Resume` or `CoverLetter` document and re-confirms ownership.
      - Builds a compact plain-text "Document Context" using `ai/getDocText.js`.
      - Calls `ai/aiEngine.askInThread({ thread, docText, userText })` which in turn:
        - Combines system + Ask-mode prompts from `ai/prompts.js`.
        - Calls the OpenAI Responses API via `ai/openai.js`, passing `previous_response_id = thread.openaiPreviousResponseId` when present.
      - Persists the assistant message and `openaiResponseId`, and updates `thread.openaiPreviousResponseId`.
    - Response: `{ userMessage, assistantMessage }`.

- **Environment variables**
  - **`OPENAI_API_KEY`** (required): API key used by `ai/openai.js` to initialize the OpenAI client.
  - **`OPENAI_MODEL`** (optional): Overrides the default model used for Ask-mode (`gpt-4.1-mini` by default if not set).

- **End-to-end Ask flow**
  1. Frontend creates or fetches a thread for a document with `POST /api/ai/threads`.
  2. User sends a message with `POST /api/ai/threads/:threadId/messages` (`text` only; mode is forced to `"ASK"`).
  3. Backend stores the user `AIMessage`, computes a document context string, calls OpenAI, then stores the assistant `AIMessage`.
  4. The thread's `openaiPreviousResponseId` is updated to the latest OpenAI `response.id` for conversational continuity.
  5. The UI fetches history via `GET /api/ai/threads/:threadId/messages`, which returns messages in chronological order with a cursor for pagination.

