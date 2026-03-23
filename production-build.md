# Production Build & Deployment Guide — CPTEDINDIA

> Complete checklist and setup reference for deploying this Next.js LMS to production.
> Follow every section in order before going live.

---

## Critical Fixes Applied Before This Guide Was Written

The following issues were found during the sanity audit and have already been fixed in the codebase:

| Fix | File | Detail |
|-----|------|--------|
| Image domain comment | `next.config.ts` | Added note explaining the wildcard and how to restrict it when a CDN is in use |

---

## 1. Environment Variables

Create a `.env.local` file (never commit it) using `.env.example` as the template.

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Example Value | Notes |
|----------|---------------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/cptedindia` | PostgreSQL 14+ required |
| `NEXTAUTH_SECRET` | *(generated — see below)* | Must be a strong random secret |
| `NEXTAUTH_URL` | `https://cptedindia.com` | Exact public URL — no trailing slash |
| `NEXT_PUBLIC_APP_URL` | `https://cptedindia.com` | Same as NEXTAUTH_URL in most cases |

### Generating a Secure NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET`. The dev placeholder in `.env.example` must **never** be used in production.

### Platform-Specific Setup

**Vercel:**
```
Project Settings → Environment Variables → add each variable for "Production"
```

**Railway / Render:**
```
Service Settings → Variables → add each key-value pair
```

**VPS / Docker:**
```bash
# .env.production (not committed — inject via CI/CD secrets)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://cptedindia.com
NEXT_PUBLIC_APP_URL=https://cptedindia.com
```

---

## 2. Database

### Requirements
- PostgreSQL **14 or newer**
- The DB user must have `CREATE TABLE`, `ALTER TABLE`, and `INSERT` permissions

### Initial Migration (first deploy)

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

> `migrate deploy` (not `migrate dev`) — applies existing migrations without creating new ones. Safe for production.

### Optional: Seed Demo Data

Only run this on staging or the very first production setup. It creates:
- Admin user: `admin@cptedindia.com` / `Admin@1234`
- Student user: `student@cptedindia.com` / `Student@1234`
- 3 sample courses

```bash
DATABASE_URL="postgresql://..." npx prisma db seed
```

**Change the seeded admin password immediately after first login.**

### Subsequent Deployments

Run this in your CI/CD pipeline after each deploy:

```bash
npx prisma migrate deploy
```

This is idempotent — safe to run even if there are no new migrations.

---

## 3. Build & Start

```bash
npm run build    # compile Next.js app
npm start        # start production server (default port 3000)
```

To run on a different port:

```bash
PORT=8080 npm start
```

### Verify the Build Succeeds Locally First

```bash
cp .env.example .env.local   # fill in real values
npm run build
```

A successful build produces no TypeScript errors and the `.next/` directory.

---

## 4. File Uploads — Important Production Note

Images uploaded via the admin panel are written to `/public/uploads/` on the server filesystem.

**This does NOT persist on:**
- Vercel (read-only filesystem after deploy)
- Any stateless/serverless platform
- Docker containers without a volume mount

### Option A — Use a CDN/Object Storage (Recommended)

Replace the upload handler at `app/api/upload/route.ts` to write to **AWS S3**, **Cloudflare R2**, or **Supabase Storage** instead of local disk. Return the CDN URL instead of `/uploads/filename`.

### Option B — VPS with a Persistent Volume

If deploying to a VPS or a container with a mounted volume:

```bash
# Mount the uploads directory to a persistent volume
/var/app/cptedindia/public/uploads  →  container:/app/public/uploads
```

Ensure the directory is preserved across deployments and is not wiped during `git pull` or container rebuilds.

### Current State

The current setup works correctly on a traditional VPS. All uploaded images are in:
```
/public/uploads/
```
Files are named `{timestamp}-{random}.{ext}` — no collisions.

---

## 5. Sanity Checklist — Before Going Live

Run through every item below and confirm it passes.

### 5.1 Environment

- [ ] `NEXTAUTH_URL` matches the exact production domain (e.g., `https://cptedindia.com`) — **not** `http://localhost:3000`
- [ ] `NEXT_PUBLIC_APP_URL` matches the same domain
- [ ] `NEXTAUTH_SECRET` is a strong random value (min 32 chars, generated via `openssl rand -base64 32`)
- [ ] `DATABASE_URL` points to production PostgreSQL — test with `npx prisma db pull` or a quick connection check
- [ ] No `.env` or `.env.local` file is committed to git (`.gitignore` already excludes `.env*`)

### 5.2 Database

- [ ] `npx prisma migrate deploy` runs without errors
- [ ] Can log in as admin at `/auth/login`
- [ ] Can log in as student at `/auth/login`
- [ ] Admin panel loads at `/admin`

### 5.3 Auth & Route Protection (enforced by `proxy.ts`)

- [ ] Visiting `/app/dashboard` without being logged in redirects to `/auth/login`
- [ ] Visiting `/admin` without being logged in redirects to `/auth/login`
- [ ] Logging in as a student and visiting `/admin` redirects to `/app/dashboard` (not an error page)
- [ ] Logging out returns to the public homepage

### 5.4 Public Pages

- [ ] Homepage (`/`) loads with hero carousel and service cards
- [ ] `/about` loads without errors
- [ ] `/services` loads — quick-nav anchors (#cpted, #risk, #security, #expatriate, #training) scroll correctly
- [ ] `/courses` shows published courses (or empty state if none are published yet)
- [ ] `/contact` form submits and shows the success state

### 5.5 Admin Panel

- [ ] Can create a course, add modules and lessons
- [ ] Image upload works (the upload button in course editor) — check that the file appears in `/public/uploads/` or your CDN
- [ ] Can publish/unpublish a course
- [ ] Published course appears at `/courses`
- [ ] Course detail page (`/courses/[slug]`) loads correctly

### 5.6 Student Portal

- [ ] Sign up creates a new account
- [ ] Admin can enrol a student in a course
- [ ] Enrolled student can view lessons
- [ ] Quiz completion records progress
- [ ] Certificate generates and downloads as PDF

### 5.7 Contact Form

- [ ] Submitting the contact form at `/contact` stores the submission in the database
- [ ] Admin can view submissions in the admin panel

### 5.8 Images

- [ ] Drop all required images into `/public/images/` (see the table below)
- [ ] Images display on the hero carousel, page banners, and section backgrounds
- [ ] Pages with missing images degrade gracefully (dark gradient fallback — no broken image icons on public-facing banners)

**Required image files:**

| File | Used In |
|------|---------|
| `logo.png` | Navbar logo |
| `iStock-2.jpg` | Hero slide 1 |
| `iStock-3.jpg` | Hero slide 2 |
| `iStock-5.jpg` | Hero slide 3 |
| `about-hero.jpg` | About page banner |
| `about-mission.jpg` | About — Mission section background |
| `services-hero.jpg` | Services page banner |
| `service-cpted.jpg` | Services — CPTED section background |
| `service-risk.jpg` | Services — Risk Management background |
| `service-security.jpg` | Services — Security Projects background |
| `service-expatriate.jpg` | Services — Expatriate section background |
| `training-cpted.jpg` | Services — Training section background |
| `courses-hero.jpg` | Courses listing & course detail fallback |
| `contact-hero.jpg` | Contact page banner |

---

## 6. Hardcoded Content to Update Before Launch

The following contact details are currently placeholder values. Update them directly in the source files:

| File | Field | Current Placeholder |
|------|-------|---------------------|
| `app/(public)/contact/page.tsx:54` | Email | `vasanthram227@gmail.com` |
| `app/(public)/contact/page.tsx:55` | Phone | `+91 98765 43210` |
| `app/(public)/contact/page.tsx:56` | Location | `India` |

---

## 7. Image Domain Restriction (Post-Launch)

Once you know which CDN or storage provider hosts your images, replace the wildcard in `next.config.ts`:

```ts
// Current (permissive — works but allows any domain through Next.js image optimizer)
remotePatterns: [{ protocol: "https", hostname: "**" }]

// Locked down example (after moving uploads to a CDN)
remotePatterns: [
  { protocol: "https", hostname: "cdn.cptedindia.com" },
  { protocol: "https", hostname: "your-s3-bucket.s3.ap-south-1.amazonaws.com" },
]
```

---

## 8. Recommended Production Stack

| Layer | Recommendation |
|-------|----------------|
| Hosting | Vercel (zero-config Next.js) or a VPS (Ubuntu 22+) |
| Database | Supabase, Neon, or a managed PostgreSQL on Railway/Render |
| File Storage | Cloudflare R2 (free egress) or AWS S3 |
| SSL | Vercel handles automatically; VPS use Caddy or nginx + Let's Encrypt |
| Domain | Point A/CNAME to host, set `NEXTAUTH_URL` to the domain |

---

## 9. Quick Command Reference

```bash
# Run migrations
npx prisma migrate deploy

# Seed demo data (first time only)
npx prisma db seed

# Build for production
npm run build

# Start production server
npm start

# Open DB GUI (local only)
npx prisma studio

# Lint
npm run lint
```
