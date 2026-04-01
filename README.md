# Job App Tracker — Backend

REST API for a job-application tracker: users, companies, applications, resumes, cover letters (with versioning), and OpenAI-backed chat on documents or general Q&A.

**Stack:** Node.js (ES modules), Express 5, MongoDB via Mongoose, JWT auth, OpenAI Responses API.

---

## Requirements

- **Node.js** (current LTS is fine)
- **MongoDB** reachable at the URL you set in `.env`

---

## Quick start

```bash
npm install
cp .env.example .env   # then edit values (see below)
npm run dev            # nodemon, or `npm start` for plain node
```

The server listens only after MongoDB connects. It logs the port from `PORT`.

---

## Environment variables

| Variable         | Required      | Purpose                                                                                |
| ---------------- | ------------- | -------------------------------------------------------------------------------------- |
| `MONGODB_URI`    | Yes           | Mongo connection string                                                                |
| `PORT`           | Yes           | HTTP port (e.g. `3000`)                                                                |
| `FRONTEND_URL`   | Yes           | Allowed CORS origin (e.g. `http://localhost:5173`)                                     |
| `JWT_SECRET`     | Yes           | Secret used to **sign** JWTs on register/login and in `verifyToken` to **verify** JWTs |
| `JWT_EXPIRATION` | Yes           | JWT lifetime (e.g. `7d`, `24h`)                                                        |
| `OPENAI_API_KEY` | For AI routes | OpenAI API key                                                                         |
| `OPENAI_MODEL`   | No            | Model override (default `gpt-4.1-mini` in code)                                        |

---

## Scripts

| Command       | Description          |
| ------------- | -------------------- |
| `npm start`   | Run `node server.js` |
| `npm run dev` | Run with nodemon     |

---

## API overview

- **Base URL:** no `/api` prefix — routes hang off the server root (e.g. `http://localhost:3000/auth/login`).
- **Auth:** Register and login return a JWT. Send `Authorization: Bearer <token>` on protected routes.
- **CORS:** Only `FRONTEND_URL`; methods `GET`, `POST`, `PUT`, `DELETE`; headers `Content-Type`, `Authorization`.

### Public

| Method | Path             | Description                                      |
| ------ | ---------------- | ------------------------------------------------ |
| `GET`  | `/`              | Health-style root (`"Index root"`)               |
| `POST` | `/auth/register` | Body: `username`, `password` → `201` `{ token }` |
| `POST` | `/auth/login`    | Same body → `200` `{ token }`                    |

### Protected (all below require a valid JWT)

**Applications** — `/applications`

| Method   | Path               | Notes                                                                                                                                 |
| -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/`                | Paginated list; query: `company`, `resume`, `coverLetter`, `status`, plus pagination/search (`q`, `page`, `limit`, `sort`, `sortDir`) |
| `GET`    | `/:id`             | Single application + populated company/resume/cover letter                                                                            |
| `POST`   | `/`                | Create; `user` set from token; `appliedAt` normalized (empty string omitted; otherwise noon UTC)                                      |
| `PUT`    | `/:id`             | Update (same `appliedAt` rules)                                                                                                       |
| `DELETE` | `/:id`             | `204`                                                                                                                                 |
| `GET`    | `/stats/dashboard` | Aggregates: totals, by status, by status this week, by source                                                                         |

**Companies** — `/companies`

| Method   | Path   | Notes                                            |
| -------- | ------ | ------------------------------------------------ |
| `GET`    | `/`    | Paginated; scoped to `author` = current user     |
| `GET`    | `/:id` | Owner check                                      |
| `POST`   | `/`    | `author` set from token; unique `(author, name)` |
| `PUT`    | `/:id` | Owner check                                      |
| `DELETE` | `/:id` | Owner check                                      |

**Resumes** — `/resumes`

| Method   | Path   | Notes                                                                                             |
| -------- | ------ | ------------------------------------------------------------------------------------------------- |
| `GET`    | `/`    | Paginated; `owner` scoped; populate `parent`                                                      |
| `GET`    | `/:id` | Populates experience/projects/certifications companies, `parent`, `children`                      |
| `POST`   | `/`    | Sets `owner`, `version` / `root` / `parent` for lineage; cleans empty project/cert `company` refs |
| `PUT`    | `/:id` | Update; clears optional sections when empty                                                       |
| `DELETE` | `/:id` | `204`                                                                                             |

**Cover letters** — `/coverLetters`

| Method   | Path   | Notes                                      |
| -------- | ------ | ------------------------------------------ |
| `GET`    | `/`    | Paginated; populate `parent`               |
| `GET`    | `/:id` | Populate `parent`, `children`              |
| `POST`   | `/`    | `owner`, versioning / lineage like resumes |
| `PUT`    | `/:id` | Update                                     |
| `DELETE` | `/:id` | `204`                                      |

**AI** — `/ai`

| Method | Path                          | Description                                                                                                                                                                                                                                                   |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/threads`                    | **Document thread:** body `{ docType, documentId }` with `docType` `resume` or `cover_letter` — finds/creates thread per user+document. **General thread:** omit both — one general thread per user. Returns `{ threadId, thread }`.                          |
| `GET`  | `/threads/:threadId`          | Thread if owned by user                                                                                                                                                                                                                                       |
| `GET`  | `/threads/:threadId/messages` | Cursor pagination: `cursor`, `limit` (max 100) → `{ messages, nextCursor }`                                                                                                                                                                                   |
| `POST` | `/threads/:threadId/messages` | Body `{ text }` — saves user message, calls OpenAI (document context for `DOCUMENT` scope; general prompts for `GENERAL`), optional tool calls via `ai/tools.js` / `toolHandlers.js`, saves assistant reply, updates `openaiPreviousResponseId` on the thread |

---

## Data model (high level)

- **User** — `username`, `hashedPassword`
- **Company** — `name`, `author`, optional `description`, `url`, `notes`
- **Application** — `user`, `company`, optional `resume` / `coverLetter`, `title`, `status` / `priority` / `source` enums, `appliedAt`, `url`
- **Document** (base) — `parent`, `root`, `owner`, `version`, `isDraft`, `name`; **Resume** and **CoverLetter** are discriminators (resume adds experience, education, projects, certifications, etc.; cover letter adds `body`, `notes`)
- **AIThread** — `userId`, `scope` (`DOCUMENT` | `GENERAL`), `docType`, `documentId`, `openaiPreviousResponseId`
- **AIMessage** — `threadId`, `userId`, `role`, `mode`, `text`, optional `artifacts`, `openaiResponseId`

List endpoints that use `paginatePlugin` share query params: `page`, `limit` (capped at 100), `q` (regex on configured fields), `sort`, `sortDir`.

---

## Project layout

```
server.js              # Express app, CORS, Mongo wait, listen
db/connection.js       # Mongoose connection
middleware/verifyToken.js
routes/                # auth, applications, companies, resumes, coverLetters, ai
controllers/
models/
plugins/paginatePlugin.js
ai/                    # prompts, OpenAI client wrapper, engine, tools, doc text extraction
openai/                # additional OpenAI-related helpers
```

Pair this service with the frontend using `VITE_BACK_END_SERVER_URL` pointing at this server’s origin.
