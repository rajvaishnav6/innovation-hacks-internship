# Backend — Users, Projects & Tasks API

The backend for the Innovation Hacks Full Stack Development Internship.

**Task 2 (this week) is done:** every endpoint below has real validation, in-memory CRUD logic, and centralized error handling with correct HTTP status codes. **Task 3** will swap the in-memory store for a real database. **Task 4** adds authentication and an AI-powered endpoint.

## Getting Started

```bash
npm install
npm run dev
```
Server runs at `http://localhost:5000`.

Import `postman_collection.json` into Postman for a ready-to-use set of requests, or use the curl examples below.

## Where data lives right now

There's no database yet (that's Task 3) — `src/data/store.js` holds an **in-memory** array of users/projects/tasks, seeded with a few starter records. Restarting the server resets the data back to the seed values; this is expected. Every controller talks to this store through the same methods (`findAll`, `findById`, `create`, `update`, `remove`) that a real Mongoose model will also expose — so Task 3 mostly means changing what's *inside* `src/data/store.js`, not how the controllers call it.

## Endpoints

### Health
| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Confirms the server is running |

### Users
| Method | Route | Body | Notes |
|---|---|---|---|
| GET | `/api/users` | – | List all users |
| GET | `/api/users/:id` | – | 404 if not found |
| POST | `/api/users` | `{ name, email, role? }` | 201 on success, 400 if invalid, 409 if email already exists |
| PUT | `/api/users/:id` | any subset of the above | 200 on success, 404 if not found |
| DELETE | `/api/users/:id` | – | 204 on success, 404 if not found |

### Projects
| Method | Route | Body | Notes |
|---|---|---|---|
| GET | `/api/projects` | – | Optional `?status=` query filter |
| GET | `/api/projects/:id` | – | 404 if not found |
| POST | `/api/projects` | `{ name, description?, status?, dueDate? }` | `status` defaults to `Planning` |
| PUT | `/api/projects/:id` | any subset of the above | 200 on success, 404 if not found |
| DELETE | `/api/projects/:id` | – | Also deletes that project's tasks (204 / 404) |

### Tasks
| Method | Route | Body | Notes |
|---|---|---|---|
| GET | `/api/tasks` | – | Optional `?projectId=` and `?status=` query filters |
| GET | `/api/tasks/:id` | – | 404 if not found |
| POST | `/api/tasks` | `{ title, projectId, status?, priority?, dueDate? }` | 400 if `projectId` doesn't match a real project |
| PUT | `/api/tasks/:id` | any subset of the above | General update |
| PATCH | `/api/tasks/:id/status` | `{ status }` | Dedicated status-change endpoint |
| DELETE | `/api/tasks/:id` | – | 204 on success, 404 if not found |

Allowed values — project `status`: `Planning`, `In Progress`, `Completed`, `On Hold`. Task `status`: `To Do`, `In Progress`, `Done`. Task `priority`: `Low`, `Medium`, `High`.

## Error format

Every error — validation, not found, conflict, or unexpected — goes through one centralized handler (`src/middleware/errorHandler.js`) and always looks like this:
```json
{ "error": "Human-readable message", "details": ["optional array of field-level issues"] }
```

## Quick test with curl

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/projects
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write onboarding docs","projectId":"p1"}'
```

## Structure

```
src/
├── server.js              # entry point
├── app.js                   # Express app: CORS, request logging, routes, error handler
├── data/
│   ├── createCollection.js    # generic in-memory CRUD helper (Task 2)
│   └── store.js                 # seeded users/projects/tasks (Task 2, replaced in Task 3)
├── models/                       # Task 3: real Mongoose/SQL schemas (placeholders for now)
├── config/db.js                    # Task 3: real database connection (placeholder for now)
├── routes/                           # URL -> controller mapping
├── controllers/                        # request handling + status codes
├── middleware/
│   ├── validate.js                       # per-entity request validation
│   └── errorHandler.js                     # centralized error handling
└── utils/
    ├── AppError.js                          # small error class carrying a status code
    └── validators.js                          # small reusable format checkers
```

## Why Node.js + Express + MongoDB?

The task guide allows Node+Express, Python+FastAPI, or Python+Flask for the backend, and MongoDB, MySQL, or PostgreSQL for the database. This scaffold picks Node+Express+MongoDB to keep the whole stack in JavaScript (matching the frontend) and because a document-shaped Project → Tasks relationship maps naturally onto MongoDB. If you'd rather use Python or a SQL database instead, that's a fine choice — just restructure this folder before Week 3.

## Notes

- Never commit a real `.env` file — only `.env.example` should be in version control.
- `mongoose` (or `pg`/`mysql2`) isn't installed yet — it's added in Task 3 once a database is chosen, via `npm install mongoose`.
- Data resets on restart until Task 3 adds real persistence — this is expected, not a bug.
