# Innovation Hacks — Full Stack Development Internship

One connected project, built over four weeks, for the Innovation Hacks Full Stack Development Internship.

| Week | Task | Folder | Status |
|---|---|---|---|
| 1 | Developer Productivity Dashboard (Frontend) | `frontend/` | ✅ Built |
| 2 | Users, Projects & Tasks REST API | `backend/` | ✅ Built — in-memory data for now |
| 3 | Persistent Data Layer (Database) | `backend/` | 🚧 Next — connects a real database |
| 4 | AI-Powered Project & Task Management Platform | `frontend/` + `backend/` | 🔜 Combines everything, deployed |

## How this repo works

This is **one connected build**, not four separate projects — matching how the task guide describes the internship:

- **`frontend/`** is the Next.js dashboard from Task 1. It currently runs on mock data. In Task 4, the mock functions inside `frontend/lib/api.js` get swapped for real `fetch()` calls to the backend below — no other frontend code needs to change.
- **`backend/`** is the Express API skeleton. Task 2 fills in the controllers with real CRUD logic, Task 3 connects a real database, Task 4 adds authentication and an AI-powered endpoint.

Each week, you build on the same repo instead of starting fresh — commit your progress and submit the same GitHub link each week, so the commit history itself shows the build growing task by task.

## Quick Start

**Frontend (Task 1 — ready now):**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

**Backend (Task 2/3 skeleton — ready now, business logic comes Week 2):**
```bash
cd backend
npm install
npm run dev
```
Runs at http://localhost:5000 — try `GET /api/health`

## Roadmap

**Week 1 — Task 1 (done):** Dashboard, Projects, Tasks, and Profile pages with search, filters, responsive layout, and loading/empty/error states — all built on mock data in `frontend/`.

**Week 2 — Task 2 (done):** Real CRUD logic, validation, centralized error handling, and correct status codes are implemented in `backend/src/controllers/*.js`, backed by an in-memory store (`backend/src/data/`) since there's no database yet. A Postman collection (`backend/postman_collection.json`) documents every endpoint.

**Week 3 — Task 3 (next):** Connect a real database in `backend/src/config/db.js` and define schemas in `backend/src/models/*.js`. The controllers already call `findAll` / `findById` / `create` / `update` / `remove` — Task 3 is mostly about making those calls hit a real database instead of the in-memory store. Once the API returns real, persisted data, swap `frontend/lib/api.js`'s mock calls for real `fetch()` calls to `http://localhost:5000/api/...`.

**Week 4 — Task 4:** Add authentication (register/login/protected routes), pick one AI feature from the task guide, and deploy both `frontend/` and `backend/` (Vercel for the frontend, Render/Railway for the backend are good free options).

## Why Node.js + Express + MongoDB for the backend?

The task guide allows Node+Express, Python+FastAPI, or Python+Flask, and MongoDB, MySQL, or PostgreSQL. This scaffold picks Node+Express+MongoDB because it keeps the whole stack in one language (JavaScript, matching the frontend) and a document-shaped Project → Tasks relationship maps naturally onto MongoDB. If you'd rather use Python or a SQL database, that's a fine choice too — just say so before Week 2 and the backend folder can be restructured.

---
Built for the Innovation Hacks Full Stack Development Internship — Build. Innovate. Impact.
