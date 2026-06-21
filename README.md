# Car Japan Motors — Full-Stack Premium Dealership Platform

A complete, production-grade web platform for **Car Japan Motors**, a premium single-showroom Pakistani car dealership. The design language is inspired by Porsche Finder, Apple, and Mercedes-Benz — bright, minimal, expensive, and trustworthy.

This repository is a **monorepo** containing two independently runnable applications:

| App          | Location    | Stack                                                            |
| ------------ | ----------- | ---------------------------------------------------------------- |
| **Frontend** | `/` (root)  | React 18, Vite 6, React Router 6, Tailwind CSS 3, Framer Motion, React Hook Form, Axios, Lucide |
| **Backend**  | `/backend`  | Node.js, Express, Prisma ORM, PostgreSQL (Neon), JWT, bcrypt, Cloudinary, Multer |

The frontend ships with a **mock data layer** so it runs with zero backend. When the backend is live, a single environment variable flips the whole app to real HTTP — no component changes required. The **service layer** (`src/services/`) is the only integration seam.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Monorepo Layout](#2-monorepo-layout)
3. [Full-Stack Architecture](#3-full-stack-architecture)
4. [Tech Stack (Both Apps)](#4-tech-stack-both-apps)
5. [Quick Start (Everything)](#5-quick-start-everything)
6. [Environment Variables](#6-environment-variables)
7. [Frontend — Deep Dive](#7-frontend--deep-dive)
   - [Frontend Folder Structure](#71-frontend-folder-structure)
   - [Routing Map](#72-routing-map)
   - [Pages](#73-pages)
   - [Home Sections](#74-home-sections)
   - [Component Catalog](#75-component-catalog)
   - [Hooks](#76-hooks)
   - [Contexts & State](#77-contexts--state)
   - [Frontend Service Layer (Mock ↔ Live)](#78-frontend-service-layer-mock--live)
   - [Design System](#79-design-system)
8. [Backend — Deep Dive](#8-backend--deep-dive)
   - [Backend Folder Structure](#81-backend-folder-structure)
   - [Request Lifecycle](#82-request-lifecycle)
   - [Layers](#83-layers)
   - [Car Data Mapping Layer](#831-car-data-mapping-layer-utilscarmapperjs)
   - [API Contract](#84-api-contract)
   - [Auth Flow (JWT)](#85-auth-flow-jwt)
   - [Image Upload Flow (Cloudinary)](#86-image-upload-flow-cloudinary)
   - [Validation & Error Handling](#87-validation--error-handling)
   - [CORS](#88-cors)
9. [Database — Deep Dive](#9-database--deep-dive)
   - [Entity Relationship Overview](#91-entity-relationship-overview)
   - [Models & Fields](#92-models--fields)
   - [Enums, Indexes, Relations](#93-enums-indexes-relations)
   - [Migrations](#94-migrations)
10. [End-to-End Flows](#10-end-to-end-flows)
11. [Connecting Frontend to Backend](#11-connecting-frontend-to-backend)
12. [Business Rules](#12-business-rules)
13. [Deployment](#13-deployment)
14. [Conventions & Code Quality](#14-conventions--code-quality)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. System Overview

**Core principles**

- Single admin system (no multi-tenancy).
- Cars are **public** to browse; only the admin mutates them.
- Reviews are **moderated** — submitted as `PENDING`, shown only when `APPROVED`.
- Inquiries are **stored leads** (created from forms and WhatsApp conversions).
- WhatsApp is the **primary conversion channel** (handled on the frontend).
- Images are stored on **Cloudinary**; the DB keeps only URLs.
- **PostgreSQL (Neon)** is the source of truth.

**What each app does**

- **Frontend** — the public marketing site (home, inventory, vehicle detail, about, contact, privacy, 404) plus a full **admin dashboard** (login, dashboard, vehicles CRUD, inquiries, reviews moderation).
- **Backend** — a REST API exposing auth, cars, reviews, and inquiries, with JWT-protected admin endpoints and Cloudinary-backed image uploads.

---

## 2. Monorepo Layout

```
Car Japan Motors Website/
├── README.md                 # ← this master document
├── index.html                # frontend HTML entry
├── package.json              # frontend dependencies & scripts
├── vite.config.js            # Vite config (@ alias, vendor chunking)
├── tailwind.config.js        # design tokens
├── postcss.config.js
├── .env.example              # frontend env (VITE_API_BASE_URL)
├── public/
│   ├── logo.png              # brand logo (used site-wide + favicon)
│   └── favicon.svg
├── src/                      # ← FRONTEND SOURCE (see §7.1)
│
└── backend/                  # ← BACKEND APP (see §8.1)
    ├── README.md             # backend-specific quick reference
    ├── package.json
    ├── .env.example
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    └── src/
```

> The frontend lives at the repo root (standard Vite layout). The backend is fully self-contained under `backend/` with its own `package.json` and `node_modules`.

---

## 3. Full-Stack Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                    │
│  React app (Vite) — pages → sections/components → hooks → services      │
└───────────────────────────────┬────────────────────────────────────────┘
                                 │  Axios (only when VITE_API_BASE_URL set)
                                 │  Authorization: Bearer <JWT>
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          EXPRESS API (backend/)                          │
│  routes → middlewares (auth/validate/upload) → controllers → services    │
└───────────────┬───────────────────────────────────┬────────────────────┘
                │ Prisma Client                       │ Cloudinary SDK (image bytes)
                ▼                                      ▼
┌─────────────────────────────┐          ┌─────────────────────────────────┐
│   PostgreSQL (Neon)          │          │   Cloudinary (image CDN)          │
│   source of truth            │          │   stores files, returns URLs      │
└─────────────────────────────┘          └─────────────────────────────────┘
```

**Golden rule:** the frontend never imports data directly into components — it always goes through `src/services/`. That layer resolves mock data today and real HTTP tomorrow. Likewise, the backend never stores image bytes — only Cloudinary URLs land in Postgres.

---

## 4. Tech Stack (Both Apps)

**Frontend**

| Concern        | Library                          |
| -------------- | -------------------------------- |
| UI             | React 18                         |
| Build/dev      | Vite 6                           |
| Routing        | React Router 6 (lazy routes)     |
| Styling        | Tailwind CSS 3 (+ custom tokens) |
| Animation      | Framer Motion 11                 |
| Forms          | React Hook Form 7                |
| HTTP           | Axios                            |
| Icons          | Lucide React                     |
| Fonts          | Plus Jakarta Sans + Inter        |

**Backend**

| Concern        | Library                          |
| -------------- | -------------------------------- |
| Runtime        | Node.js (LTS), ES Modules        |
| Framework      | Express.js                       |
| ORM            | Prisma                           |
| Database       | PostgreSQL (Neon)                |
| Auth           | JSON Web Tokens (`jsonwebtoken`) |
| Hashing        | `bcryptjs` (drop-in for bcrypt)  |
| Images         | Cloudinary + Multer (memory)     |
| Config / CORS  | dotenv, cors                     |

---

## 5. Quick Start (Everything)

### A) Frontend (mock mode, no backend needed)

```bash
# from repo root
npm install
npm run dev          # http://localhost:5173 (or next free port)
```

Admin area: `/admin/login` → `admin@carjapan.pk` / `carjapan`.

### B) Backend (real API + database)

```bash
cd backend
npm install
copy .env.example .env       # Windows (use `cp` on macOS/Linux)
# edit .env → set Neon DATABASE_URL/DIRECT_URL, JWT_SECRET, Cloudinary keys
npm run prisma:generate
npm run prisma:migrate       # creates tables on Neon
npm run db:seed              # creates the admin from .env
npm run dev                  # http://localhost:5000
```

### C) Connect them

In the **frontend** `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Restart the frontend dev server. Every service switches from mock data to the live API.

---

## 6. Environment Variables

### Frontend (`/.env`)

| Variable            | Purpose                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Empty → mock mode. Set to the backend URL → live HTTP across the app.   |

### Backend (`/backend/.env`)

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` / `production` |
| `DATABASE_URL` | Neon **pooled** connection string |
| `DIRECT_URL` | Neon **direct** URL for migrations (or equal to `DATABASE_URL`) |
| `JWT_SECRET` | Long random signing secret |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary auth |
| `CLOUDINARY_FOLDER` | Upload folder name (default `car-japan`) |
| `CLIENT_URL` | Comma-separated allowed CORS origins (localhost always allowed) |

---

## 7. Frontend — Deep Dive

### 7.1 Frontend Folder Structure

```
src/
├── main.jsx                # React root; wraps App in BrowserRouter + AuthProvider
├── App.jsx                 # Route table, lazy imports, page transitions, ScrollToTop
├── index.css               # Tailwind layers, base typography, components, utilities
│
├── assets/                 # (reserved for bundled static assets)
│
├── components/             # Reusable presentational + composite components
│   ├── Navbar.jsx          # Sticky nav: transparent over hero → glass-white on scroll; mobile drawer
│   ├── Footer.jsx          # Brand, link columns, hours, contact, Privacy + Admin links
│   ├── ScrollToTop.jsx     # Resets scroll on route change
│   ├── PageTransition.jsx  # Fade/rise wrapper per page
│   ├── FloatingWhatsApp.jsx# Persistent floating WhatsApp button + tooltip
│   ├── VehicleCard.jsx     # Grid + list card; hover image slideshow, zoom, elevation
│   ├── VehicleGrid.jsx     # Responsive grid/list with loading + empty states
│   ├── VehicleGallery.jsx  # Detail gallery: thumbnails + fullscreen lightbox
│   ├── PriceCard.jsx       # Sticky price + inquiry form (RHF); exports SpecPill
│   ├── FilterSidebar.jsx   # Filters: search, make, body, price, transmission, fuel, year
│   ├── SearchBar.jsx       # Hero luxury search → builds query string → /inventory
│   ├── Carousel.jsx        # Snap-scrolling horizontal carousel w/ arrows
│   ├── StatsCard.jsx       # Count-up statistic (useCountUp)
│   ├── CTASection.jsx      # Charcoal call-to-action band
│   ├── ui/                 # Design-system primitives
│   │   ├── Logo.jsx        # Logo image + "Car Japan Motors"; light/chip/size props, fallback
│   │   ├── Button.jsx      # Polymorphic button/link/anchor; variants, sizes, loading, motion
│   │   ├── Badge.jsx       # Pill badges
│   │   ├── Input.jsx       # Input + Textarea + Field (label/hint/error)
│   │   ├── Select.jsx      # Styled native select
│   │   ├── Modal.jsx       # Portal modal, backdrop, ESC close, scroll lock
│   │   ├── Drawer.jsx      # Slide-in drawer (mobile nav & filters)
│   │   ├── Image.jsx       # Resilient image: shimmer skeleton + graceful fallback
│   │   ├── Skeleton.jsx    # Skeleton + VehicleCard/Grid skeletons
│   │   ├── Reveal.jsx      # Scroll reveal + RevealGroup + revealItem variants
│   │   ├── SectionHeading.jsx
│   │   ├── PageHero.jsx    # Bright interior-page header
│   │   ├── Pagination.jsx  # Page range with ellipses
│   │   └── RouteLoader.jsx # Branded full-screen loader (logo + progress)
│   └── admin/
│       ├── AdminSidebar.jsx   # Dark sidebar nav + user + logout
│       ├── AdminTable.jsx     # Responsive table → stacks into cards on mobile
│       └── AdminStatCard.jsx  # Dashboard stat card
│
├── constants/index.js      # BRAND, CONTACT, HOURS, SOCIAL, NAV_LINKS, ADMIN_NAV_LINKS,
│                           # MAKES, TRANSMISSIONS, FUEL_TYPES, BODY_TYPES, SORT_OPTIONS,
│                           # PRICE_BOUNDS, YEARS, buildWhatsAppLink()
│
├── contexts/AuthContext.jsx# Auth state (token/user), login/logout, isAuthenticated
│
├── data/                   # SINGLE SOURCE OF TRUTH for mock content
│   ├── cars.js             # 15 vehicles, MongoDB-shaped (_id), image galleries
│   ├── testimonials.js     # Seed reviews (also seeds reviewService localStorage)
│   └── content.js          # STATS, WHY_US, VALUES, TIMELINE, SHOWROOM_IMAGES, FAQ
│
├── hooks/
│   ├── useAsync.js             # Generic fetcher: data/loading/error/refetch (unmount-safe)
│   ├── useScrollPosition.js    # Scroll Y + "scrolled" (rAF-throttled) — drives navbar
│   ├── useCountUp.js           # Count-up when in view
│   ├── useInventoryFilters.js  # Inventory filters synced to URL query string
│   ├── useLockBodyScroll.js    # Locks scroll for modals/drawers
│   └── useMediaQuery.js        # Reactive media query
│
├── layouts/
│   ├── MainLayout.jsx      # Navbar + <Outlet/> + Footer + FloatingWhatsApp
│   └── AdminLayout.jsx     # Fixed sidebar (desktop) / drawer (mobile) + Outlet
│
├── lib/format.js           # formatPrice (Lac/Cr), formatNumber, formatMileage, formatDate, cn
│
├── pages/
│   ├── Home.jsx            # Composes home sections
│   ├── Inventory.jsx       # Filters sidebar/drawer, sort, grid/list, pagination
│   ├── VehicleDetails.jsx  # Gallery, specs, highlights, sticky PriceCard, similar carousel
│   ├── About.jsx           # Story, mission/vision, values, timeline, stats, CTA
│   ├── Contact.jsx         # Contact cards, form (RHF), map, hours
│   ├── PrivacyPolicy.jsx   # Legal content
│   ├── NotFound.jsx        # 404
│   └── admin/
│       ├── Login.jsx       # Split-screen login (RHF + AuthContext)
│       ├── Dashboard.jsx   # Stat cards + recent inquiries + latest vehicles
│       ├── Cars.jsx        # Vehicle table, search, delete w/ confirm modal
│       ├── CarForm.jsx     # Add/Edit; image upload UI, highlight chips, featured toggle
│       ├── Inquiries.jsx   # Leads table, status filter/toggle, contact actions
│       └── Reviews.jsx     # Add review (star picker) + list/delete
│
├── routes/ProtectedRoute.jsx  # Redirects unauthenticated users to /admin/login
│
├── sections/               # Home-page composition blocks
│   ├── Hero.jsx            # Parallax hero, integrated SearchBar, trust indicators
│   ├── FeaturedInventory.jsx
│   ├── BrowseByType.jsx    # Body-type tiles → filtered inventory
│   ├── FeaturedStory.jsx   # Apple-style parallax storytelling
│   ├── WhyCarJapan.jsx     # Trust pillars + count-up stats
│   ├── Showroom.jsx        # Imagery + map + hours
│   └── Testimonials.jsx    # Auto-advancing carousel (reads reviewService)
│
└── services/               # DATA ACCESS LAYER (mock ↔ real backend)
    ├── api.js              # Axios instance, interceptors, tokenStore, API_ENABLED
    ├── carService.js       # Vehicles (query/sort/similar + CRUD)
    ├── inquiryService.js   # Inquiries (create/list)
    ├── reviewService.js    # Reviews (localStorage-backed in mock mode)
    └── authService.js      # Login/logout/token
```

### 7.2 Routing Map

Defined in `src/App.jsx` with lazy chunks + `AnimatePresence` page transitions.

**Public** (wrapped in `MainLayout`):

| Path | Page |
| --- | --- |
| `/` | Home |
| `/inventory` | Inventory |
| `/inventory/:id` | VehicleDetails |
| `/about` | About |
| `/contact` | Contact |
| `/privacy` | PrivacyPolicy |

**Admin** (`AdminLayout` + `ProtectedRoute`):

| Path | Page |
| --- | --- |
| `/admin/login` | Login (public) |
| `/admin` | Dashboard |
| `/admin/cars` | Cars |
| `/admin/cars/new` | CarForm (add) |
| `/admin/cars/:id/edit` | CarForm (edit) |
| `/admin/inquiries` | Inquiries |
| `/admin/reviews` | Reviews |

**Fallback:** `*` → NotFound.

### 7.3 Pages

- **Home** — Hero → Featured Inventory → Browse by Type → Featured Story → Why Car Japan → Showroom → Testimonials → Final CTA.
- **Inventory** — URL-driven filters (`useInventoryFilters`), desktop sidebar + mobile drawer, sort dropdown, grid/list toggle, pagination (9/page), skeletons + empty state.
- **VehicleDetails** — breadcrumb, badges, `VehicleGallery` (cross-fade + thumbnails + fullscreen lightbox w/ keyboard nav), specs grid, highlight chips, description, sticky `PriceCard` (price + WhatsApp/Call + callback form), similar-vehicles carousel, loading + not-found states.
- **About** — story, mission/vision, values, vertical timeline, animated stats, CTA.
- **Contact** — contact cards, validated form (`createInquiry`), embedded map, hours.
- **PrivacyPolicy** — readable legal sections.
- **NotFound** — premium minimal 404.
- **Admin** — login (split-screen), dashboard (stat cards + recent inquiries/vehicles), cars (searchable table + delete confirm), car form (add/edit with image upload + highlight chips + featured toggle), inquiries (status filter/toggle + call/WhatsApp/email actions), reviews (star picker; persists to localStorage and shows instantly on the homepage).

### 7.4 Home Sections

| Section | Highlights |
| --- | --- |
| Hero | Full-bleed parallax image, headline, integrated `SearchBar`, trust indicators |
| FeaturedInventory | `getFeaturedCars(12)`; responsive grid; "View Full Inventory" |
| BrowseByType | SUV/Sedan/Crossover/Hatchback tiles → deep-link to filtered inventory |
| FeaturedStory | Apple-style scroll parallax spotlight |
| WhyCarJapan | Trust pillars + count-up statistics |
| Showroom | Photography, embedded map, business hours, directions |
| Testimonials | Auto-advancing carousel reading live from `reviewService` |
| CTASection | Charcoal closing CTA (Browse / WhatsApp / Call) |

### 7.5 Component Catalog

- **Primitives** (`components/ui/`): `Button`, `Badge`, `Input`/`Textarea`/`Field`, `Select`, `Modal`, `Drawer`, `Image`, `Skeleton`, `Reveal`/`RevealGroup`, `SectionHeading`, `PageHero`, `Pagination`, `Logo`, `RouteLoader`.
- **Composite** (`components/`): `Navbar`, `Footer`, `VehicleCard`, `VehicleGrid`, `VehicleGallery`, `PriceCard` (+ `SpecPill`), `FilterSidebar`, `SearchBar`, `Carousel`, `StatsCard`, `CTASection`, `FloatingWhatsApp`, `ScrollToTop`, `PageTransition`.
- **Admin** (`components/admin/`): `AdminSidebar`, `AdminTable`, `AdminStatCard`.

Highlights: `Image` shows a shimmer while loading and a clean fallback on error; `Button` renders `<button>`/`<Link>`/`<a>` from one API with spring-physics hover; `Logo` loads `/logo.png` with a monogram fallback (`light` controls label color, `chip` adds a white backing for dark panels).

### 7.6 Hooks

| Hook | Purpose |
| --- | --- |
| `useAsync` | `{ data, loading, error, refetch, setData }`; unmount-safe, ignores stale responses |
| `useScrollPosition` | rAF-throttled scroll Y + `scrolled` boolean (drives navbar transparency) |
| `useCountUp` | Eased count-up when scrolled into view |
| `useInventoryFilters` | Inventory filter state synced to the URL query string |
| `useLockBodyScroll` | Prevents background scroll behind modals/drawers |
| `useMediaQuery` | Reactive boolean for a media query |

### 7.7 Contexts & State

- **`AuthContext`** — wraps the app in `main.jsx`. Holds `token`/`user`; exposes `login`, `logout`, `isAuthenticated`, `loading`. Rehydrates from stored token. `ProtectedRoute` consumes it.
- **URL as state** — inventory filters live in the query string (shareable, refresh-safe).
- **localStorage** — JWT (`cj_admin_token`) and reviews (`cj_reviews`) in mock mode.

### 7.8 Frontend Service Layer (Mock ↔ Live)

One switch — `API_ENABLED` in `api.js` (true when `VITE_API_BASE_URL` is set).

| Service | Functions | Live endpoints |
| --- | --- | --- |
| `carService.js` | `getCars`, `getCarById`, `getFeaturedCars`, `getSimilarCars`, `createCar`, `updateCar`, `deleteCar` | `GET/POST/PUT/DELETE /api/cars`, `GET /api/cars/:id` |
| `inquiryService.js` | `createInquiry`, `getInquiries` | `POST /api/inquiries`, `GET /api/inquiries` |
| `reviewService.js` | `getReviews`, `createReview`, `deleteReview` | `GET/POST/DELETE /api/reviews` |
| `authService.js` | `login`, `logout`, `getStoredToken` | `POST /api/auth/login` |

`api.js` also provides: configured Axios instance, a **request interceptor** that attaches `Authorization: Bearer <token>`, a **response interceptor** that normalizes errors, `tokenStore` helpers, and `mockDelay()`.

### 7.9 Design System

Defined in `tailwind.config.js` + `src/index.css`. Color ratio ≈ 80% white / 10% gray / 7% charcoal / 3% brand red.

| Token | Role | DEFAULT |
| --- | --- | --- |
| `brand` | Primary red | `#D81E2C` (50–900) |
| `ink` | Charcoal/text | `#16181D` (50–900) |
| `mist` | Warm off-white grays | `#F5F5F3` (100–400) |

- **Type:** Plus Jakarta Sans (display) + Inter (body); OpenType features (`ss01`, `cv11`, ligatures); negative heading tracking; clamp-based `display-1/2`.
- **Shadows:** soft, multi-layered, low-opacity (`soft`, `card`, `lift`, `elevated`, `ring`).
- **Backgrounds:** fixed ambient gradient (`lux-radial`); `lux-veil`, `lux-sheen`.
- **Motion:** easings `smooth` + `lux`; reusable `.card-hover`; Framer Motion for transitions, parallax, staggered reveals, count-ups.
- **Helpers:** `.container-px`, `.section-py`, `.eyebrow`, `.display-1/2`, `.glass-nav`, `.card-hover`, `.focus-ring`, `.range-brand`, `.hairline`, `.inner-sheen`, `.no-scrollbar`, `.text-balance`, `.mask-fade-r`.

---

## 8. Backend — Deep Dive

### 8.1 Backend Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Admin, Car, Review, Inquiry + enums (see §9)
│   ├── seed.js              # idempotent admin provisioning from .env
│   └── migrations/          # committed SQL migration history
│       ├── migration_lock.toml          # provider lock (postgresql)
│       └── 20260618030000_init/
│           └── migration.sql            # full schema incl. year/seats/drivetrain/condition
├── src/
│   ├── config/
│   │   ├── db.js            # Prisma client singleton (protects Neon pool)
│   │   └── cloudinary.js    # Cloudinary SDK config + folder
│   ├── controllers/
│   │   ├── auth.controller.js     # login
│   │   ├── car.controller.js      # list/detail (public) + CRUD (admin) + image handling
│   │   ├── review.controller.js   # submit/list public + moderate (admin)
│   │   └── inquiry.controller.js  # create public + list/status (admin)
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── car.routes.js
│   │   ├── review.routes.js
│   │   └── inquiry.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT guard; re-checks admin exists
│   │   ├── error.middleware.js    # notFound + central error handler
│   │   ├── upload.middleware.js   # multer memory storage (images, 5MB, ≤12)
│   │   └── validate.middleware.js # login/review/inquiry/status validators
│   ├── services/
│   │   └── cloudinary.service.js  # buffer → Cloudinary URL; delete by URL
│   ├── utils/
│   │   ├── jwt.js          # sign/verify
│   │   ├── hash.js         # bcryptjs hash/compare
│   │   ├── ApiError.js     # operational error w/ HTTP status
│   │   ├── asyncHandler.js # async wrapper → forwards errors
│   │   └── carMapper.js    # Car ↔ API translation (mapCarToApi / mapCarFromApi)
│   ├── app.js              # express app (CORS, parsers, routes, errors)
│   └── server.js           # http bootstrap + graceful shutdown
├── .env.example
└── package.json
```

### 8.2 Request Lifecycle

```
HTTP request
  → CORS check (app.js)
  → body parsers (json / urlencoded)
  → router match (routes/*)
  → [admin only] auth.middleware (verify JWT, load admin)
  → [uploads] upload.middleware (multer parses multipart + files)
  → [writes] validate.middleware (field checks)
  → controller (business logic via Prisma + cloudinary.service)
  → JSON response { success, ... }
On throw → asyncHandler → error.middleware → normalized JSON error
Unmatched → notFound → 404
```

### 8.3 Layers

- **Routes** declare paths + attach middleware (auth/upload/validate) + map to controllers.
- **Controllers** hold business logic; wrapped in `asyncHandler`; talk to Prisma and the Cloudinary service; throw `ApiError` for expected failures.
- **Services** isolate external integrations (`cloudinary.service.js`).
- **Middlewares** are cross-cutting (auth, validation, uploads, errors).
- **Utils** are pure helpers (jwt, hashing, error class, async wrapper, **`carMapper`**).
- **Config** holds singletons (Prisma client, Cloudinary).

### 8.3.1 Car Data Mapping Layer (`utils/carMapper.js`)

The single source of truth for translating a `Car` between the database and the API. It guarantees that the frontend and backend never drift apart on field names, types, or presence. Two functions plus shared coercion helpers:

**`mapCarToApi(car)` — Prisma record → API response (outbound)**
- Returns a complete object with **all 20 canonical fields always present**: `id, title, price, location, model, bodyType, registrationCity, fuelType, enginePower, transmission, color, mileage, year, seats, drivetrain, condition, features, images, isFeatured, isSold` (plus `createdAt`, `updatedAt`).
- Applies safe fallbacks so a missing/null DB value can never crash a frontend component: strings → `''`, numbers → `0`, `features`/`images` → `[]`, booleans → real booleans.
- Returns `null` for a null input (used when a record isn't found).
- Used by **every** car response: `getCars` (`cars.map(mapCarToApi)`), `getCarById`, `createCar`, `updateCar`.

**`mapCarFromApi(input)` — request body → Prisma-ready data (inbound)**
- **Only includes keys that are actually present** in the body, so the same function serves both full create and partial update flows.
- Coerces types safely from multipart/JSON strings:
  - text fields → trimmed strings,
  - `price` / `mileage` / `year` / `seats` → rounded integers (invalid → `NaN`, which the controller's validator rejects; empty/`null` → skipped),
  - `isFeatured` / `isSold` → booleans (`true`/`'true'`/`'1'`),
  - `features` → `string[]` (accepts array, JSON string, or CSV).
- **Skips missing/null values entirely** — never writes `null` into a non-nullable column.
- **Does not** touch `images` — image persistence (Cloudinary uploads + `existingImages` merge) stays in the controller.

**Shared helpers (also exported):** `parseStringArray(value)` (array | JSON string | CSV → `string[]`) and `toBool(value)`. The controller imports these for query-filter parsing (`featured`, `sold`) and image-URL parsing (`images`, `existingImages`).

**Validation split:** `mapCarFromApi` normalizes; the controller's `buildCarData` validates. On create, `title, price, location, model, bodyType, registrationCity, fuelType, enginePower, transmission, color, mileage, description` are required; `year, seats, drivetrain, condition` are **optional** and fall back to schema defaults — preserving backward compatibility with any client that doesn't send them.

### 8.4 API Contract

Base `/api`. All responses are `{ success, ... }`. Admin routes require `Authorization: Bearer <token>`.

**Auth**

| Method | Path | Auth | Body / Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | – | `{ email, password }` → `{ token, user }` |

**Cars**

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/cars` | – | Filters: `search, bodyType, fuelType, transmission, minPrice, maxPrice, featured, sold, sort` |
| GET | `/api/cars/:id` | – | Single car |
| POST | `/api/cars` | ✅ | `multipart/form-data`: text fields + `images` files |
| PUT | `/api/cars/:id` | ✅ | Partial; `existingImages` (URLs to keep) + new `images` files |
| DELETE | `/api/cars/:id` | ✅ | Also deletes Cloudinary assets |

Every car response is normalized through `mapCarToApi` (see §8.3.1), so the shape is always:

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "Toyota Corolla Altis Grande",
    "price": 7850000,
    "location": "Lahore",
    "model": "Corolla Altis",
    "bodyType": "Sedan",
    "registrationCity": "Lahore",
    "fuelType": "Petrol",
    "enginePower": "1.8L",
    "transmission": "Automatic",
    "color": "Pearl White",
    "mileage": 32000,
    "year": 2022,
    "seats": 5,
    "drivetrain": "FWD",
    "condition": "Used",
    "features": ["Sunroof", "Cruise Control"],
    "images": ["https://res.cloudinary.com/.../car.jpg"],
    "isFeatured": true,
    "isSold": false,
    "createdAt": "2026-06-18T03:00:00.000Z",
    "updatedAt": "2026-06-18T03:00:00.000Z"
  }
}
```

`GET /api/cars` returns `{ success, count, data: [ ...cars ] }`. A validation failure on create/update returns `400 { success:false, message:"Validation failed", details:{ field: "..." } }`.

**Reviews**

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/reviews` | – | `{ name, rating(1–5), comment }` → always `PENDING` |
| GET | `/api/reviews` | – | Only `APPROVED` |
| GET | `/api/admin/reviews` | ✅ | All; optional `?status=` |
| PATCH | `/api/reviews/:id/approve` | ✅ | → `APPROVED` |
| PATCH | `/api/reviews/:id/reject` | ✅ | → `REJECTED` |

**Inquiries**

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/inquiries` | – | `{ name, phone, message, carId? }` → `NEW` |
| GET | `/api/admin/inquiries` | ✅ | All; optional `?status=`; includes linked car |
| PATCH | `/api/inquiries/:id/status` | ✅ | `{ status: NEW\|CONTACTED\|CLOSED }` |

**Health:** `GET /api/health` → `{ success, status: "ok" }`.

### 8.5 Auth Flow (JWT)

```
POST /api/auth/login { email, password }
  → find Admin by email
  → bcrypt.compare(password, admin.password)
  → sign JWT { sub: admin.id, email }  (expires JWT_EXPIRES_IN)
  → { token, user }

Protected request
  → Authorization: Bearer <token>
  → auth.middleware: verify token → load admin from DB (still exists?) → attach req.admin
  → controller runs
```

Passwords are hashed with `bcryptjs` (12 salt rounds) at seed time and never stored in plain text. A uniform "Invalid email or password" message prevents user enumeration.

### 8.6 Image Upload Flow (Cloudinary)

```
Client → multipart/form-data (fields + `images` files)
  → multer memory storage (no disk writes; 5MB/file, ≤12 files, images only)
  → controller calls cloudinary.service.uploadImages(req.files)
  → each buffer streamed to Cloudinary (quality:auto, format:auto)
  → secure URLs returned
  → URLs stored in Car.images[]   (DB never holds image bytes)
```

- **Create:** uploaded files (+ optional `images` URLs in the body) become `Car.images`.
- **Update:** send `existingImages` (URLs to keep) + new files; removed URLs are deleted from Cloudinary (best-effort).
- **Delete:** all of the car's Cloudinary assets are removed.

### 8.7 Validation & Error Handling

- **Validation** (`validate.middleware.js`): login (email+password), review (name, comment, rating 1–5 int), inquiry (name, phone, message), inquiry status (enum). Car payloads are normalized by `mapCarFromApi` then validated in the car controller (`buildCarData`) because they arrive as multipart strings: `price`/`mileage`/`year`/`seats` → Int, `features` → string[], booleans parsed. Required on create: all core text fields + `price` + `mileage`; `year`/`seats`/`drivetrain`/`condition` are optional (schema defaults apply).
- **Errors** (`error.middleware.js`): everything funnels through a central handler returning `{ success:false, message, details? }`. Prisma (`P2002` unique → 409, `P2025` not found → 404), Multer (file size/type), and JWT errors are mapped to friendly messages. 5xx are logged.

### 8.8 CORS

`app.js` allows any `localhost` origin in development plus the comma-separated origins in `CLIENT_URL`. Requests without an origin (curl/Postman) are allowed. Unknown browser origins are rejected.

---

## 9. Database — Deep Dive

PostgreSQL (Neon), modeled with Prisma in `backend/prisma/schema.prisma`.

### 9.1 Entity Relationship Overview

```
Admin                 (standalone — the single operator)

Car  1 ───────< many  Inquiry
     (Car.inquiries)   (Inquiry.car / carId, nullable, onDelete: SetNull)

Review                (standalone — moderated, no relations)
```

### 9.2 Models & Fields

**Admin**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `email` | String | unique |
| `password` | String | bcrypt hash |
| `createdAt` | DateTime | default now |

**Car**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `title` | String | listing title |
| `price` | Int | PKR |
| `location` | String | |
| `model` | String | |
| `bodyType` | String | indexed |
| `registrationCity` | String | |
| `fuelType` | String | |
| `enginePower` | String | |
| `transmission` | String | |
| `color` | String | |
| `mileage` | Int | km |
| `description` | String | |
| `year` | Int | default `0`, model year |
| `seats` | Int | default `5` |
| `drivetrain` | String | default `""` (e.g. FWD/AWD) |
| `condition` | String | default `"Used"` |
| `features` | String[] | dynamic list |
| `images` | String[] | Cloudinary URLs |
| `isFeatured` | Boolean | default false, indexed |
| `isSold` | Boolean | default false, indexed |
| `inquiries` | Inquiry[] | back-relation |
| `createdAt` / `updatedAt` | DateTime | |

**Review**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `name` | String | |
| `rating` | Int | 1–5 |
| `comment` | String | |
| `status` | ReviewStatus | default `PENDING`, indexed |
| `createdAt` | DateTime | |

**Inquiry**

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String (cuid) | PK |
| `name` | String | |
| `phone` | String | |
| `message` | String | |
| `carId` | String? | FK → Car, indexed |
| `car` | Car? | relation, `onDelete: SetNull` |
| `status` | InquiryStatus | default `NEW`, indexed |
| `createdAt` | DateTime | |

### 9.3 Enums, Indexes, Relations

- **Enums:** `ReviewStatus { PENDING, APPROVED, REJECTED }`, `InquiryStatus { NEW, CONTACTED, CLOSED }`.
- **Indexes:** `Car.isFeatured`, `Car.isSold`, `Car.bodyType`; `Review.status`; `Inquiry.status`, `Inquiry.carId`.
- **Relation:** `Inquiry.car` ↔ `Car.inquiries`; deleting a car sets dependent inquiries' `carId` to null (history preserved).

> Prisma requires both sides of a relation, so `Car.inquiries[]` is the mandatory back-reference for `Inquiry.car`.

### 9.4 Migrations

Migration history is committed under `backend/prisma/migrations/`:

```
prisma/migrations/
├── migration_lock.toml          # provider = "postgresql"
└── 20260618030000_init/
    └── migration.sql            # full schema (all 4 tables, enums, indexes, FK)
```

- The `init` migration creates `Admin`, `Car`, `Review`, `Inquiry`, both enums, all indexes, and the `Inquiry → Car` foreign key. The `Car` table already includes `year`, `seats`, `drivetrain`, `condition` with their defaults.
- **Apply it:** `npm run prisma:deploy` (production / CI) or `npm run prisma:migrate` (dev, also regenerates the client).
- **Safe defaults = safe migrations.** Because the four newer columns are `NOT NULL DEFAULT …`, applying them to a table that already holds rows backfills every existing row automatically — no data loss, no manual step.
- **Adding columns later to a populated DB** (if you ever skip the migration history) is equivalent to:

```sql
ALTER TABLE "Car" ADD COLUMN "year" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Car" ADD COLUMN "seats" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "Car" ADD COLUMN "drivetrain" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Car" ADD COLUMN "condition" TEXT NOT NULL DEFAULT 'Used';
```

- **Generating new migrations:** edit `schema.prisma`, then `npm run prisma:migrate -- --name <change>`. Neon needs the **direct** (non-pooled) URL in `DIRECT_URL` for migration runs.

---

## 10. End-to-End Flows

**Public: browse → inquire**
1. Hero `SearchBar` builds a query string → navigates to `/inventory?make=…&maxPrice=…`.
2. `Inventory` reads it via `useInventoryFilters`, fetches with `getCars`, renders grid/list + pagination.
3. Card click → `/inventory/:id` → `getCarById` → gallery + sticky `PriceCard`.
4. User submits the callback form → `createInquiry` (→ `POST /api/inquiries`) **or** taps WhatsApp/Call. Either way a lead exists (WhatsApp clicks are logged as inquiries when wired server-side).

**Admin: authenticate**
1. `/admin/login` → `authService.login` → `POST /api/auth/login` → token stored in `localStorage` + `AuthContext`.
2. `ProtectedRoute` guards all `/admin/*` routes; the Axios interceptor attaches the bearer token.

**Admin: car CRUD with images**
1. `CarForm` collects fields + images → `createCar`/`updateCar` (`multipart/form-data`).
2. Backend: multer → `cloudinary.service` uploads → URLs saved in `Car.images[]` (Postgres).

**Review moderation**
1. Visitor submits a review (frontend) → backend creates it as `PENDING`.
2. Admin opens Reviews → `GET /api/admin/reviews` → approves/rejects.
3. `GET /api/reviews` (public) returns only `APPROVED` → homepage testimonials.

**Inquiry management**
1. Admin sees leads via `GET /api/admin/inquiries` (with linked car).
2. Updates status `NEW → CONTACTED → CLOSED` via `PATCH /api/inquiries/:id/status`.

---

## 11. Connecting Frontend to Backend

1. Run the backend (§5B) and confirm `GET /api/health`.
2. Set the frontend `.env`: `VITE_API_BASE_URL=http://localhost:5000`; restart.
3. The service layer auto-switches to live HTTP; JWT is attached automatically.

**Field mapping (the one integration detail):** the frontend mock shape and the backend Car shape differ. Map them in the frontend service layer (`carService.js`) — the single seam:

| Frontend (mock) | Backend (Postgres) |
| --- | --- |
| `_id` | `id` |
| `name` | `title` |
| `make` + `variant` | (compose from `title`/`model` as needed) |
| `fuel` | `fuelType` |
| `registration` | `registrationCity` |
| `engine` | `enginePower` |
| `featured` | `isFeatured` |
| `highlights` | `features` |
| `year`, `seats`, `drivetrain`, `condition` | same names (now modeled in the DB) |
| `images`, `model`, `transmission`, `color`, `mileage`, `price`, `description`, `bodyType` | same names |

> The backend already normalizes every car response through `backend/src/utils/carMapper.js` (`mapCarToApi`), so all 20 canonical fields are always present and no frontend field breaks on a missing value. Inbound bodies are normalized via `mapCarFromApi`. On the frontend, the only remaining translation is `_id ↔ id` and `name ↔ title`, which belongs in `carService.js`.

---

## 12. Business Rules

- Only the admin can create/update/delete cars, moderate reviews, and change inquiry status.
- Reviews are **always created `PENDING`** and become public only when `APPROVED`.
- `price` and `mileage` are integers; `rating` is an integer 1–5; `phone` is required for inquiries; admin `email` is unique.
- `features` and `images` are string arrays; **images are Cloudinary URLs only** — never stored as bytes in the DB.
- Every inquiry submission (form or WhatsApp conversion) creates a lead record.

---

## 13. Deployment

**Frontend** (static host — Vercel/Netlify/Cloudflare Pages):
- `npm run build` → deploy `dist/`. Set `VITE_API_BASE_URL` to the deployed API URL.

**Backend** (Render/Railway/Fly/VPS):
- Provision Neon Postgres; set all backend env vars.
- `npm ci && npm run prisma:generate && npm run prisma:deploy && npm run db:seed`.
- Start with `npm start`. Ensure `CLIENT_URL` includes the deployed frontend origin.

**Database:** Neon serverless Postgres. Use the **pooled** URL for the app (`DATABASE_URL`) and the **direct** URL for migrations (`DIRECT_URL`).

---

## 14. Conventions & Code Quality

- **Separation of concerns:** data → services → hooks → sections/pages → components (frontend); routes → middlewares → controllers → services (backend).
- **No hardcoded data in components** — everything flows through services.
- **Single sources of truth:** `constants/` + design tokens (frontend); `schema.prisma` + `.env` (backend).
- **Reusable primitives** for a consistent, DRY UI.
- **Accessibility:** semantic markup, `aria-label`s, keyboard-dismissable overlays, focus-visible rings.
- **Performance:** lazy routes, vendor chunking, rAF-throttled scroll, lazy images (frontend); Prisma singleton, memory-streamed uploads, indexed queries (backend).
- **Security:** JWT + bcrypt, uniform auth errors, CORS allow-list, server-side validation, image-only uploads with size caps.

---

## 15. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Frontend shows mock data after setting the API URL | Restart the Vite dev server (env is read at boot). |
| `Environment variable not found: DATABASE_URL` | Create `backend/.env` from `.env.example`. |
| Prisma migrate fails on Neon | Set `DIRECT_URL` to the **direct** (non-pooled) Neon URL. |
| CORS error in browser | Add the frontend origin to `CLIENT_URL` in `backend/.env`. |
| Logo not showing | Ensure `public/logo.png` exists. |
| Image upload 400 | Check field name is `images`, files are images, each ≤ 5MB. |
| 401 on admin routes | Token missing/expired — log in again; check `JWT_SECRET` matches between sign/verify. |
| `EPERM ... rename query_engine-windows.dll.node` on `prisma generate` (Windows) | The engine DLL is locked by the editor/antivirus. Close the IDE's Prisma file handle or restart the IDE, then re-run `npx prisma generate`. `npm run prisma:migrate`/`prisma:deploy` also regenerate the client. |
| New car fields (`year/seats/drivetrain/condition`) missing from a car | Apply the migration (`npm run prisma:deploy`) and regenerate the client; responses are completed by `mapCarToApi` regardless. |

---

© Car Japan Motors. Crafted end-to-end with care.
