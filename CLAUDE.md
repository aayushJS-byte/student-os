# StudentOS — Claude Context

SaaS Placement Management Platform for IIT BHU students. **Student-side only — no recruiter portal.**

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js (ESM) + Express v5 + MongoDB/Mongoose + Zod v4 |
| Frontend | React 19 + TypeScript + Vite + React Query v5 + Tailwind CSS v4 + Framer Motion |
| Email | Brevo (via axios) — `src/services/email.service.js` → `sendEmail({ to, subject, html })` |
| Auth | HttpOnly cookies — `accessToken` (15 min) + `refreshToken` (7 days) |

## Dev setup

```bash
# Backend (port 8000)
cd backend && npm run dev

# Frontend (port 5173, proxies /api → localhost:8000)
cd frontend && npm run dev
```

Vite proxy: all `/api` requests forward to `:8000` — frontend uses `withCredentials: true` on every call, never hardcodes the backend URL.

## Required env vars (backend/.env)

```
PORT, NODE_ENV, MONGODB_URI
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
BREVO_API_KEY, BREVO_SENDER_NAME, BREVO_SENDER_EMAIL
CLIENT_URL, ALLOWED_EMAIL_DOMAINS
```

## Architecture rules

- **MVC + Service layer** — thin controllers, fat services. No business logic in routes or controllers.
- **Hard delete** — `deleteApplication` uses `application.deleteOne()`. No soft delete, no `deletedAt` field on the Application model.
- `findOwned(id, userId)` helper in `application.service.js` — single DB query, throws 404/403. Use it everywhere instead of two separate queries.
- **Never commit directly to main.** Always branch off `develop`.
- **Do NOT modify Phase 1 auth** — it is feature-complete. Files under `src/modules/auth/`, `src/modules/token/`, `src/modules/session/` are frozen.

## Backend module layout

```
src/modules/
  auth/          ← FROZEN (Phase 1)
  token/         ← FROZEN (Phase 1)
  session/       ← FROZEN (Phase 1)
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
    reminder.service.js    ← processReminders()
    reminder.scheduler.js  ← node-cron every 15 min, started in server.js
  prep/
    question.model.js      ← Question schema (company, section, slug, difficulty, tags…)
    userProgress.model.js  ← UserProgress schema (user, questionSlug, status, notes)
    question.service.js    ← getCompanies(), getSections(), getQuestions(), getUserProgress(), upsertProgress()
    question.controller.js
    question.routes.js     ← all routes under /api/v1/prep, protected by `protect`
    question.seed.js       ← idempotent seed (upsert by slug); run: node src/modules/prep/question.seed.js
src/mail/
  reminderTemplates.js     ← HTML templates for all reminder types
  verifyEmail.template.js
  forgotPassword.template.js
  resetPassword.template.js
```

## Application status machine

```
wishlist(Saved) → applied → oa → interview → offer → accepted
                                                    → rejected
                                                    → withdrawn
                                                    → ghosted
```

**"Wishlist" is labelled "Saved" in the UI** — backend value stays `"wishlist"`, only the display label changed.

**Terminal statuses** (`accepted`, `rejected`, `withdrawn`, `ghosted`) — cannot be set on application **creation**, only via status-update endpoint. Enforced in `createApplicationSchema`.

**Business logic: what each status means**

| Status | Meaning | Key fields |
|--------|---------|------------|
| `wishlist` (Saved) | Found a job, not applied yet | deadline (apply-by), job link |
| `applied` | Submitted the application | appliedDate, resumeVersion, referral |
| `oa` | Recruiter scheduled an OA | oa.scheduledAt (datetime), platform, duration |
| `interview` | Interview round(s) scheduled | interviews[] — managed via InterviewTimeline |
| `offer` | Received an offer | offer.stipend/ctc, currency, joiningDate, offer.deadline |
| terminal | Final outcome | notes only |

**No cross-status field bleed** — each status in the edit form shows ONLY its own relevant fields. Application deadline only appears for `wishlist` (where it means "apply-by date"). Once applied or beyond, the deadline is irrelevant.

**Creation flow** — two-path intent picker in `CreateApplicationFlow.tsx`:
1. "Save a job opening" → status `wishlist`, fields: company/role/location/jobType/jobLink/deadline/tags/notes
2. "Log an application I submitted" → status `applied`, fields: company/role/location/jobType/jobLink/appliedDate/resumeVersion/referral/tags/notes

OA, Interview, and Offer details are never entered at creation — they come via status transitions.

**Stage transition prompt** — `StageTransitionDrawer.tsx` opens automatically after transitioning:
- `oa` → OA date/platform/duration form
- `interview` → add interview round form
- `accepted` → offer compensation capture (stipend or CTC + joining date)
- `rejected` / `withdrawn` → outcome reason note (optional, skip available)
- `ghosted` → no drawer (implicit)

**Workflow stepper** — `ApplicationWorkflow.tsx` on detail page — 5 stages: Saved → Applied → OA → Interview → Outcome. "Offer" shows as amber in the Outcome node (all 4 main stages checked, pending final decision).

**Forward-only transitions** — `ALLOWED_NEXT_STATUSES` in constants defines the valid forward moves. Backwards movement is blocked. Trying to jump from `saved` to anything other than `applied` shows a descriptive blocked popup explaining they must apply first. Every forward transition requires a confirmation dialog ("you won't be able to go back"). If the API call fails, the dialog stays open (pendingStatus is not cleared until success).

**Checkpoint-specific detail panels** — `ApplicationDetailPage` renders a different panel per status:
- `wishlist`: countdown to apply-by deadline (datetime) + job details + salaryRange + source
- `applied`: job details + applied date + resume/referral
- `oa`: OA countdown (datetime) + platform + duration + notes
- `interview`: next-interview countdown + InterviewTimeline + notes
- `offer` / terminal: outcome badge + outcomeReason + notes

**`salaryRange`** — free-text field for compensation mentioned in the JD (e.g. "₹18 LPA").

**`source`** — enum field tracking where the job was found. Values: `linkedin`, `naukri`, `company_site`, `campus`, `referral`, `internshala`, `wellfound`, `other`. Optional, nullable. Shown in JobDetails panel on detail page.

**`outcomeReason`** — short text capturing why the application ended (rejection reason, withdrawal reason, or offer notes). Populated via `StageTransitionDrawer` on terminal transitions. Shown in OutcomePanel.

**`CountdownTimer.tsx`** — generic countdown component replacing `OACountdown`. Accepts any date + labels. Used for both apply-by deadline (Saved) and OA/interview countdowns.

**`ConfirmDialog` variants** — `variant="danger"` (default, red) for deletes; `variant="primary"` (neutral white) for forward-transition confirmations; `variant="info"` (neutral, no Cancel button) for blocked-transition informational popups.

## Zod v4 gotchas (backend)

Empty strings from HTML `<input type="date">` and `<input type="number">` coerce to `Invalid Date` / `NaN`. Always use these preprocessors from `application.validator.js`:

```js
const optionalDate = z.preprocess(
  (v) => (!v || v === "" ? undefined : v),
  z.coerce.date().optional()
);
const optionalNonNegativeNum = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().nonnegative().optional()
);
```

## Reminder system

Scheduler runs every 15 min via `node-cron`. Started in `server.js` after DB connects.

`sentReminders` array on each Application document tracks which keys have fired (idempotent). When a user updates a date, the service clears matching key prefixes so reminders re-fire for the new date. `sentReminders` updates use `{ timestamps: false }` to avoid polluting `updatedAt` (which ghost nudge uses to measure inactivity).

**Status gates** — each reminder type is strictly gated to one status:
- Deadline reminders → `wishlist` only (deadline = apply-by date, irrelevant once submitted)
- OA reminders → `oa` only (and `oa.completed === false`)
- Interview reminders → `interview` only (and `result === "pending"`)
- Offer deadline → `offer` only
- Ghost nudge → `applied`, `oa`, `interview`

**Reminder key format:**

| Event | Keys |
|---|---|
| Application deadline | `deadline_7d`, `deadline_3d`, `deadline_1d` |
| OA | `oa_24h`, `oa_2h` |
| Interview (per round) | `interview_24h_<interviewId>`, `interview_2h_<interviewId>` |
| Offer deadline | `offer_7d`, `offer_3d`, `offer_1d`, `offer_12h` |
| Ghost nudge | `ghost_applied` (30d), `ghost_oa` (14d), `ghost_interview` (21d) |

Ghost keys are status-specific and cleared on every status transition so each new stage can fire its own nudge. Thresholds differ by status: OA results come in fast (14 days), applied/interview take longer (21–30 days).

## Offer tracking

Independent offer records — applications with `status: "offer" | "accepted"` are surfaced on the `/offers` page via `GET /applications/offers`.

**`documentLink`** — URL field on the offer subdocument for the offer letter (Google Drive / company portal link). No file uploads — zero storage cost. Shown in `OutcomePanel` as "View Offer Letter" button, editable in `ApplicationForm` and `StageTransitionDrawer` (accepted transition).

## Calendar

`GET /api/v1/applications/calendar` — returns all calendar events derived from existing application data. No new model needed.

**Event shape:**
```js
{
  applicationId, company, role, jobType,
  type,   // "apply_deadline" | "oa" | "interview" | "offer_deadline"
  date,   // ISO string — the event datetime
  label,  // human-readable e.g. "Round 2 – Technical"
  round,  // interview round number (interviews only)
  interviewType, // interview type (interviews only)
}
```

**Event sources (per application):**
| App status | Source field | Event type |
|---|---|---|
| `wishlist` | `deadline` | `apply_deadline` |
| `oa` | `oa.scheduledAt` | `oa` |
| `interview` | `interviews[i].scheduledAt` (pending rounds only) | `interview` |
| `offer` | `offer.deadline` | `offer_deadline` |

Frontend groups events by calendar date (local timezone). Route registered in `application.routes.js` before the `/:id` param route to avoid shadowing.

## Analytics (backend)

`GET /applications/analytics` — single `$facet` aggregation returning:
- `pipeline` — count per status + total
- `kpi` — `{ totalApplications, active, offers, acceptanceRate, ghostRate }`
- `funnel` — cumulative "reached this stage or beyond" for Applied/OA/Interview/Offer/Accepted with conversion %
- `byMonth` — last 12 months application counts
- `bySource` — counts grouped by source field
- `byJobType` — counts grouped by job type

## Prep / PYQ module

`GET /api/v1/prep/companies` — returns `{ name, count }[]` via `$group` aggregation (NOT string[]).
`GET /api/v1/prep/sections?company=X` — sections available for a company.
`GET /api/v1/prep/questions?company=X&section=Y` — filtered question list.
`GET /api/v1/prep/questions/:slug` — full question detail.
`GET /api/v1/prep/progress` — user's progress map `{ [slug]: { status, solvedAt, notes } }`.
`GET /api/v1/prep/progress/stats` — `{ solved, attempted, todo, total }`.
`PATCH /api/v1/prep/questions/:slug/progress` — upsert progress (`status`: todo/attempted/solved).

**UserProgress** — unique compound index `{ user: 1, questionSlug: 1 }`. Status cycles: todo → attempted → solved → todo.

**Security** — Google Drive source URL is never exposed. All question data lives in MongoDB, served exclusively through authenticated API.

**Seed** — 141 questions across 27 companies. Run: `node src/modules/prep/question.seed.js` (safe to re-run, upserts by slug).

## Navigation layout

- **`AppShell.tsx`** — root layout for all protected routes. Desktop: fixed left sidebar (`w-56`). Mobile: hamburger + Framer Motion slide-over. `NAV_LINKS = [Dashboard, Applications, Offers, Calendar, Prep]`.
- **`AuthLayout.tsx`** — split-screen for all auth routes. Left 42% (lg+): dot-grid background, brand, hero text, 4 animated feature items. Right: `<Outlet />`. Mobile: left panel hidden, slim brand header shown.

## Axios refresh interceptor (frontend)

`src/api/axios.ts` — intercepts 401s on protected routes, attempts `POST /auth/refresh` once.

**Critical rules — read before touching this file:**
- `refreshFailed` module flag: once refresh returns 401, ALL subsequent 401 interceptors bail immediately. Prevents the infinite loop where parallel React Query hooks restart the cycle.
- **Do NOT call `queryClient.clear()` inside the interceptor.** Clearing cache while components are mounted triggers immediate re-subscriptions → new 401s → loop restarts.
- **Do NOT call `window.location.href = "/login"` inside the interceptor.** Hard redirect causes a full page reload → module re-evaluates → `refreshFailed` resets to `false` → loop restarts from scratch.
- On refresh failure: just `return Promise.reject(refreshError)`. React Query propagates the error → `useCurrentUser` returns `user=null` → `ProtectedRoute` renders `<Navigate to="/login">` (soft nav, no reload, state preserved).
- `resetRefreshState()` is exported and called in `useLogin.onSuccess` to re-enable refresh for the new session.

## Frontend conventions

- **React Query key factory** — `APPLICATION_KEYS` in `src/hooks/applications/queryKeys.ts`. Keys: `all`, `lists()`, `list(filters)`, `details()`, `detail(id)`, `stats()`, `offers()`, `analytics()`, `calendar()`.
- **PREP_KEYS** in `src/hooks/prep/queryKeys.ts`. Keys: `companies()`, `sections(company)`, `questions(company, section?)`, `progress()`, `progressStats()`.
- **Global staleTime: 30s** — set in `src/utils/queryClient.ts`. No retry on 4xx (definitive server answers). Analytics hook overrides to 5 min + `keepPreviousData`. Calendar staleTime: 2 min.
- **Mutation cache invalidation** — every mutation that changes application state (`create`, `update`, `delete`, `updateStatus`) invalidates `lists()`, `stats()`, `analytics()`, AND `calendar()`. Do not add mutations that skip these invalidations.
- **URL-based filter state** — `useSearchParams` + debounced search (see `useApplicationFilters.ts`)
- **`@/`** alias maps to `src/`
- Slide-over `Drawer` uses Framer Motion spring, locks body scroll, closes on ESC and backdrop click
- `ActivityLog` entries are auto-generated server-side on every mutation — never user-editable
- `ApplicationListItem` type omits `activityLog`, `interviews`, `notes`, `offer` (list view is lean); `Application` type has all fields.
- OA `scheduledAt` and interview `scheduledAt` both use `<input type="datetime-local">` — use `toInputDateTime()` from `utils/date.ts` to format for the input, `toInputDate()` for plain date fields. Display with `formatDateTime()`.

## Phase completion

- **Phase 1** — Auth (email verification, JWT, sessions) ✅
- **Phase 2** — Internship Tracker CRUD (10 endpoints, 12 hooks, full UI) ✅
- **Phase 3** — P0 fixes + email reminders ✅ *(email delivery not yet tested)*
- **Phase 4** — Business logic hardening + UX improvements ✅
- **Phase 5** — Advanced analytics dashboard ✅
- **Phase 6** — Prep / PYQ module ✅
  - `Question` + `UserProgress` models
  - 7 REST endpoints under `/api/v1/prep`
  - Two-sidebar layout (AppShell nav + internal company sidebar)
  - 141 questions, 27 companies, 4 sections (OA / CS Fundamentals / System Design / HR)
  - Per-question progress tracking (todo/attempted/solved) with status cycling
  - `PrepTrackerWidget` on dashboard (ring + bars + stat tiles)
- **Phase 7** — UI overhaul + Refresh token fix ✅
  - Complete UI redesign: indigo accent system, gradient avatar, active nav dot indicator
  - `ApplicationTable` responsive (card layout on mobile, table on md+)
  - Dashboard KPI cards with icons + colored icon tiles
  - Offer cards with gradient accent top bar
  - `PrepTrackerWidget` redesigned with SVG gradient ring
  - Refresh token interceptor fixed — `refreshFailed` flag stops infinite loop; removed `window.location.href` and `queryClient.clear()` from interceptor; navigation handled by React Router via `ProtectedRoute`
  - Global query retry disabled for 4xx responses
  - Duplicate Mongoose TTL index warnings fixed (Token + Session models)
- **Phase 8** — Placement Calendar ✅ *(current)*
  - `GET /applications/calendar` endpoint — aggregates events from all application date fields
  - Custom month-view calendar page at `/calendar`
  - Color-coded event types: apply deadline (amber), OA (violet), interview (blue), offer deadline (emerald)
  - Day detail panel — click any day to see full event list with links to application
