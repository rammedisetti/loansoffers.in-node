# loansoffers.in — Node + React Edition

A full-stack **Node/Express + React** rebuild of the original Django `loansoffers.in`
loan-lead-generation platform. It preserves the exact website structure, content, and
feature set — public loan marketing pages, lead capture, EMI calculator, blog, and a
staff console for lead management, analytics, APR control, and blog CMS — while
delivering a smoother, single-page-app experience.

> The original Django project (in the repository root) is left **fully intact**. This
> folder is a self-contained, independent implementation.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Feature Parity](#feature-parity)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Data Model](#data-model)
9. [Staff Console](#staff-console)
10. [Production Build](#production-build)
11. [Notes & Differences from Django](#notes--differences-from-django)

---

## Architecture

```
┌──────────────────────┐        JSON / cookies        ┌──────────────────────┐
│   React SPA (Vite)    │  ─────────────────────────▶  │  Express API (Node)  │
│  Tailwind + Router    │                              │  better-sqlite3      │
│  Chart.js analytics   │  ◀─────────────────────────  │  express-session     │
└──────────────────────┘                              └──────────────────────┘
        :5173                                                   :4000
                                                        data/app.sqlite (auto)
```

- **Frontend** — React 18 + Vite + React Router + Tailwind CSS. Chart.js powers the
  analytics dashboard. During development, Vite proxies `/api` and `/uploads` to the
  Express server, so cookies work same-origin.
- **Backend** — Express (ESM) with `better-sqlite3` (synchronous, zero-config SQLite),
  `express-session` + `connect-sqlite3` for staff sessions, `bcryptjs` for password
  hashing, and `multer` for blog cover-image uploads.
- **Auth** — Session-cookie based staff login replaces Django's
  `@staff_member_required`. A default admin is seeded on first run.

---

## Feature Parity

| Area | Django original | This project |
| --- | --- | --- |
| 7 loan product pages | ✅ server-rendered | ✅ data-driven React pages (`/loans/:slug`) |
| Unified apply page | ✅ | ✅ `/apply` |
| Lead capture + validation | ✅ phone normalise, comma amounts, consent | ✅ identical rules (client + server) |
| EMI calculator | ✅ form post | ✅ live sliders + doughnut chart |
| Blog (list/detail, filters, pagination) | ✅ 9/page | ✅ 9/page, category + tag filters |
| Blog CMS (CRUD, publish toggle, soft-delete, upload) | ✅ | ✅ `/manage/blog` |
| Lead dashboard + KPI stats + filters | ✅ | ✅ `/manage` |
| Lead detail (notes, status change → history) | ✅ signals | ✅ status history recorded on change |
| APR settings | ✅ | ✅ `/manage/apr-settings`, live on category cards |
| Analytics (14 sections, date presets) | ✅ | ✅ `/manage/analytics` |
| Static pages (About, Contact, Privacy, Terms) | ✅ | ✅ same copy |
| Google Tag Manager | ✅ env `GTM_ID` | ✅ injected when `GTM_ID` set |

---

## Project Structure

```
loansoffers.in-node/
├── package.json            # root convenience scripts (concurrently)
├── README.md               # this file
├── server/                 # Express API
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js        # app entry: middleware, session, routes, seed
│       ├── db.js           # better-sqlite3 schema + connection
│       ├── seed.js         # loan types, default APR, admin user
│       ├── helpers.js      # slugify, phone/amount parsing, client IP
│       ├── middleware.js   # requireStaff guard
│       └── routes/
│           ├── auth.js     # login / logout / me
│           ├── public.js   # config, loan-types, leads, emi, contact
│           ├── leads.js    # staff: dashboard, detail, notes, status, APR
│           ├── blog.js     # public blog + staff CMS (multer uploads)
│           └── analytics.js# staff: KPIs + 14 analytics sections
└── client/                 # React SPA
    ├── package.json
    ├── vite.config.js      # dev proxy to :4000
    ├── tailwind.config.js  # brand theme (primary/accent/success…)
    └── src/
        ├── main.jsx, App.jsx
        ├── api.js          # fetch wrapper (credentials: include)
        ├── context/        # AuthContext, ConfigContext (GTM + loan APR)
        ├── components/     # Navbar, Footer, LeadForm, ManageShell, …
        ├── data/loans.js   # all 7 loan product copies
        ├── sections/       # Hero, LoanCategories, WhyChooseUs, …
        ├── pages/          # Home, LoanPage, Apply, EmiCalculator, Blog, …
        └── pages/manage/   # Login, Dashboard, LeadDetail, Analytics, …
```

---

## Prerequisites

- **Node.js 18+** (20+ recommended)
- npm 9+

---

## Quick Start

From the `loansoffers.in-node/` folder:

```bash
# 1. Install both apps
npm run install:all

# 2. Configure the server env (copy and edit as needed)
cp server/.env.example server/.env      # PowerShell: Copy-Item server/.env.example server/.env

# 3. Run server + client together (http://localhost:5173)
npm run dev
```

Or run them independently:

```bash
npm run dev:server   # Express on http://localhost:4000
npm run dev:client   # Vite on   http://localhost:5173
```

The SQLite database, session store, and default data are created automatically on first
server start. Uploaded blog images are stored under `server/uploads/`.

**Default staff login:** `admin` / `admin123` (override via `.env`). Visit
`http://localhost:5173/manage/login`.

---

## Environment Variables

`server/.env` (see `server/.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | API port |
| `SESSION_SECRET` | *(change me)* | Session cookie signing secret |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin (credentials) |
| `GTM_ID` | *(blank)* | Google Tag Manager container id |
| `ADMIN_USERNAME` | `admin` | Seeded staff username |
| `ADMIN_PASSWORD` | `admin123` | Seeded staff password |
| `BLOG_AUTHOR_NAME` | `loansoffers.in Team` | Byline shown on blog posts |
| `BLOG_AUTHOR_AVATAR` | *(blank)* | Optional author avatar URL |
| `NODE_ENV` | `development` | Set `production` to enable secure cookies |

`client/.env` (optional): `VITE_API_BASE` — set only if the API is not proxied.

---

## API Reference

Base path: `/api`. Staff routes require an authenticated session cookie.

### Public
| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/config` | GTM id + blog author config |
| `GET` | `/loan-types` | Active loan types with formatted APR |
| `POST` | `/leads` | Submit a lead (validated) |
| `POST` | `/emi` | Server-side EMI calculation |
| `POST` | `/contact` | Contact enquiry |
| `GET` | `/blog` | Published posts (`?category`, `?tag`, `?page`) |
| `GET` | `/blog/post/:slug` | Single post + related |

### Auth
| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Staff login |
| `POST` | `/auth/logout` | End session |
| `GET` | `/auth/me` | Current session user |

### Staff (require login)
| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/manage/leads` | Leads + KPI stats (filter `?status`, `?loan_type`) |
| `GET` | `/manage/leads/:id` | Lead detail + notes + status history |
| `POST` | `/manage/leads/:id/notes` | Add a note |
| `POST` | `/manage/leads/:id/status` | Change status (records history) |
| `GET/POST` | `/manage/apr` | Read / bulk-update loan APRs |
| `GET` | `/manage/analytics` | Analytics (`?preset` or `?start&end`) |
| `GET` | `/blog/manage` | All posts (incl. drafts) |
| `POST` | `/blog/manage` | Create post (multipart cover) |
| `PUT` | `/blog/manage/:id` | Update post |
| `POST` | `/blog/manage/:id/toggle` | Publish / unpublish |
| `DELETE` | `/blog/manage/:id` | Soft-delete |

---

## Data Model

SQLite tables created in `server/src/db.js`:

- **loan_types** — `name`, `slug`, `apr_percent`, `is_active`
- **leads** — applicant details, `loan_type_id`, `loan_amount`, `monthly_income`,
  `status`, `source`, `ip_address`, `is_deleted`, timestamps
- **lead_status_history** — `old_status → new_status`, `changed_by`, `changed_at`
- **admin_notes** — free-text notes per lead, `added_by`
- **blog_posts** — `title`, unique `slug`, `body`, `excerpt`, `category`, `tags`,
  `cover_image`, `is_published`, `published_at`, `read_time_minutes`, `is_deleted`
- **users** — staff accounts (`username`, `password_hash`, `is_staff`)

The EMI formula matches the Django original:
`r = annualRate / 1200`, `EMI = P·r·(1+r)ⁿ / ((1+r)ⁿ − 1)`, with `0%` handled as `P/n`.

---

## Staff Console

Available under `/manage` after login:

- **Dashboard** — 5 KPI cards, status + loan-type filters, lead table.
- **Lead Detail** — full applicant info, status change (writes history), notes.
- **Analytics** — KPIs, leads-over-time, status/loan-type/source/city breakdowns,
  amount distribution, conversion funnel, day-of-week, 12-month trend, avg-by-type,
  top sources & recent activity — with `Last 7/30/90 days`, `This year`, and custom
  date ranges.
- **APR Settings** — edit per-product APRs; changes appear instantly on the public
  category cards and loan pages.
- **Blog** — create/edit/publish/delete posts with cover-image upload.

---

## Production Build

```bash
# Build the static SPA
npm run build          # outputs client/dist

# Serve the API (set NODE_ENV=production for secure cookies)
NODE_ENV=production npm start
```

Serve `client/dist` from any static host / CDN and point it at the API origin (set
`CLIENT_ORIGIN` on the server and, if not same-origin, `VITE_API_BASE` at build time).
For a single-origin deployment, place the API behind a reverse proxy that also serves
the built SPA.

---

## Notes & Differences from Django

- **Session auth** replaces Django's staff decorator; a default admin is seeded and can
  be changed via env vars.
- **Status history** is written whenever a lead's status actually changes (equivalent to
  the Django signal-based audit trail).
- **EMI calculator** runs live in the browser for a smoother feel; an identical
  server-side `/api/emi` endpoint is also available.
- **Blog slugs** are auto-generated and de-duplicated, mirroring the Django behaviour.
- Visual design, brand colours, copy, and page structure intentionally match the
  original, with lightweight animations and a sticky nav for a smoother experience.

# loansoffers.in-node
