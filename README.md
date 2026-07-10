# StudentOS

A SaaS Placement Management Platform for IIT BHU students. Student-side only — no recruiter portal.

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js (ESM) + Express v5 + MongoDB/Mongoose + Zod v4 |
| Frontend | React 19 + TypeScript + Vite + React Query v5 + Tailwind CSS v4 + Framer Motion |
| Email | Brevo (via axios) |
| Auth | HttpOnly cookies — `accessToken` (15 min) + `refreshToken` (7 days) |

## Getting Started

```bash
# Backend (port 8000)
cd backend && npm run dev

# Frontend (port 5173, proxies /api → localhost:8000)
cd frontend && npm run dev
```

Vite proxy forwards all `/api` requests to `:8000`. Frontend uses `withCredentials: true` on every request and never hardcodes the backend URL.

## Environment Variables

Create `backend/.env` with:

```
PORT
NODE_ENV
MONGODB_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
BREVO_API_KEY
BREVO_SENDER_NAME
BREVO_SENDER_EMAIL
CLIENT_URL
ALLOWED_EMAIL_DOMAINS
```

## Architecture

**MVC + Service layer** — thin controllers, fat services. No business logic in routes or controllers.

```
backend/src/modules/
  auth/           ← Auth (email verification, JWT, sessions)
  token/          ← Token management
  session/        ← Session management
  user/
    user.model.js
  applications/
    application.constants.js
    application.model.js
    application.validator.js
    application.service.js
    application.controller.js
    application.routes.js
  reminders/
    reminder.service.js     ← processReminders()
    reminder.scheduler.js   ← node-cron every 15 min
  prep/
    question.model.js
    userProgress.model.js
    question.service.js
    question.controller.js
    question.routes.js      ← /api/v1/prep (protected)
    question.seed.js        ← idempotent seed; run: node src/modules/prep/question.seed.js
```

## Features

### Internship / Application Tracker

Track job applications through a full status pipeline:

```
wishlist (Saved) → applied → oa → interview → offer → accepted
                                                     → rejected
                                                     → withdrawn
                                                     → ghosted
```

- **Two-path creation flow** — "Save a job opening" (wishlist) or "Log a submitted application" (applied)
- **Stage transition drawer** — captures OA date/platform, interview rounds, offer compensation, or outcome reason on each transition
- **Forward-only transitions** — backwards movement is blocked with an explanatory popup
- **Confirmation dialogs** — every forward transition requires confirmation ("you won't be able to go back")
- **Countdown timers** — apply-by deadline (Saved), OA countdown, next interview countdown
- **`salaryRange`** — free-text field for JD compensation (e.g. "₹18 LPA")
- **`source`** — where the job was found: `linkedin`, `naukri`, `company_site`, `campus`, `referral`, `internshala`, `wellfound`, `other`
- **`outcomeReason`** — short text for rejection/withdrawal reason or offer notes
- **`documentLink`** — offer letter URL (Google Drive / company portal); no file uploads

### Placement Calendar

`GET /api/v1/applications/calendar` — aggregates all date fields into calendar events.

Event types (color-coded):
| Type | Source | Color |
|---|---|---|
| `apply_deadline` | `wishlist.deadline` | Amber |
| `oa` | `oa.scheduledAt` | Violet |
| `interview` | `interviews[i].scheduledAt` | Blue |
| `offer_deadline` | `offer.deadline` | Emerald |

### Analytics Dashboard

`GET /api/v1/applications/analytics` — single `$facet` aggregation:
- **Pipeline** — count per status + total
- **KPIs** — total applications, active, offers, acceptance rate, ghost rate
- **Funnel** — cumulative conversion % per stage (Applied → OA → Interview → Offer → Accepted)
- **By month** — last 12 months application counts
- **By source** and **by job type** breakdowns

### Email Reminders

Scheduler runs every 15 min via `node-cron`. Reminder types:

| Event | Timing |
|---|---|
| Application deadline | 7d, 3d, 1d before |
| OA | 24h, 2h before |
| Interview (per round) | 24h, 2h before |
| Offer deadline | 7d, 3d, 1d, 12h before |
| Ghost nudge (applied) | after 30 days of inactivity |
| Ghost nudge (oa) | after 14 days of inactivity |
| Ghost nudge (interview) | after 21 days of inactivity |

### Prep / PYQ Module

Practice questions from previous placement cycles.

- 141 questions across 27 companies
- 4 sections: OA, CS Fundamentals, System Design, HR
- Per-question progress tracking: `todo` → `attempted` → `solved` → `todo`
- `GET /api/v1/prep/companies` — companies with question counts
- `GET /api/v1/prep/sections?company=X` — sections for a company
- `GET /api/v1/prep/questions?company=X&section=Y` — filtered questions
- `GET /api/v1/prep/questions/:slug` — full question detail
- `GET /api/v1/prep/progress` — user's progress map
- `PATCH /api/v1/prep/questions/:slug/progress` — upsert progress

Seed the database: `node src/modules/prep/question.seed.js` (safe to re-run, upserts by slug)

## Navigation

| Route | Page |
|---|---|
| `/dashboard` | Overview — KPI cards + PrepTracker widget |
| `/applications` | Application list with filters |
| `/offers` | Offer tracking |
| `/calendar` | Placement calendar (month view) |
| `/prep` | PYQ module |

## Phase History

| Phase | Description | Status |
|---|---|---|
| 1 | Auth — email verification, JWT, sessions | ✅ |
| 2 | Internship Tracker CRUD — 10 endpoints, 12 hooks, full UI | ✅ |
| 3 | P0 fixes + email reminders | ✅ |
| 4 | Business logic hardening + UX improvements | ✅ |
| 5 | Advanced analytics dashboard | ✅ |
| 6 | Prep / PYQ module | ✅ |
| 7 | UI overhaul + refresh token fix | ✅ |
| 8 | Placement Calendar | ✅ |
