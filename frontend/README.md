# DevBoard — Developer Productivity Dashboard

A responsive, production-style developer productivity dashboard built for **Task 1** of the Innovation Hacks Full Stack Development Internship. This is the frontend of a project + task management tool — the same dashboard that will later be wired up to a real REST API (Task 2) and database (Task 3), and grown into a full AI-powered platform (Task 4).

> Built with React (Next.js), Tailwind CSS, and mock data that simulates real network requests — including loading, empty, and error states.

## ✨ Features

- **Dashboard home** with a welcome header, key stats (projects, tasks in progress/completed/overdue), recent projects, and upcoming tasks
- **Projects page** with search, status filter, and a "New Project" form (client-side only for now)
- **Tasks page** with a To Do / In Progress / Done board, search, priority filter, and a "New Task" form — click any task card to move it to the next status
- **Profile page** showing the logged-in user's details and quick stats
- Fully **responsive** layout (mobile, tablet, desktop) with a collapsible sidebar on small screens
- **Loading skeletons**, **empty states**, and a genuine **error state** (use the "Simulate error" button on the Dashboard, Projects, or Tasks page) on every data-driven view
- Clean, reusable component architecture (`components/ui`, `components/dashboard`, `components/layout`)

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) for icons
- Plain JavaScript, no backend calls yet (see "What's mock and what's real" below)

## 📂 Project Structure

```
frontend/
├── app/                     # Next.js App Router pages
│   ├── page.js              # Dashboard (home)
│   ├── projects/page.js     # Projects page
│   ├── tasks/page.js        # Tasks page
│   └── profile/page.js      # Profile page
├── components/
│   ├── layout/               # Sidebar, Navbar, AppShell
│   ├── dashboard/             # StatCard, ProjectCard, TaskCard, New Project/Task modals
│   └── ui/                    # SearchInput, FilterSelect, Badge, EmptyState, ErrorState, Skeleton, Avatar, ProgressBar
├── data/mockData.js           # Mock user, projects, and tasks
├── lib/api.js                  # Mock "API" layer (easy to swap for real fetch calls later)
├── lib/utils.js                 # Small helpers (dates, classnames, avatar colors)
└── hooks/useAsync.js             # Loading/success/error hook used by every page
```

## 🚀 Getting Started

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). No environment variables or database are needed for this task — see `.env.example` for what's coming later.

## 🔌 What's mock and what's real

This task is **frontend-only**, so `lib/api.js` returns mock data from `data/mockData.js` after a short simulated delay (so the loading states are actually visible). Every page talks to `lib/api.js` through the `useAsync` hook — never directly to the mock data — so in Task 2/3 you can swap the inside of `lib/api.js` for real `fetch()` calls to your own backend without touching a single page or component.

## 🎨 Design notes

The sidebar leans into a dark, terminal-inspired look (monospace nav labels, a blinking cursor next to the logo) since this is a *developer's* productivity tool — while the main content area stays light and clean so dense information (stat cards, project grids) stays easy to scan. Monospace type is used for data-like content (stats, badges, dates, counts); everything conversational (greetings, descriptions, form labels) stays in the system sans font.

## 🖼️ Screenshots

> Add 2–3 screenshots here after running the app locally (dashboard, projects page, tasks board, mobile view). Save them into a `screenshots/` folder and reference them like:
> `![Dashboard](screenshots/dashboard.png)`

## 🎥 Demo Video

> Add your demo video link here after recording it (Loom, an unlisted YouTube video, or Google Drive all work).

## 📌 Notes for Submission

- GitHub repo ✅ (this one)
- Demo video — record a 2–5 min walkthrough: dashboard, projects, tasks board, a mobile-width view, and the loading/empty/error states
- LinkedIn post — tag Innovation Hacks and include your demo video
- Live deployment (optional) — this deploys cleanly to [Vercel](https://vercel.com/) with zero configuration

## 💡 Ideas to Extend (optional, for extra polish)

- Add a dark mode toggle
- Persist locally-created projects/tasks with `localStorage` until Task 2's API is ready
- Add unit tests with Jest + React Testing Library

---
Built for the **Innovation Hacks Full Stack Development Internship** — Build. Innovate. Impact.
