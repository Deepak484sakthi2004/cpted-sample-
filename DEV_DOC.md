# CPTED India LMS - Developer Documentation

> Full-stack eLearning platform for CPTED India — built with Next.js 16, PostgreSQL, Prisma ORM, and shadcn/ui.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Routing & Page Map](#routing--page-map)
5. [Database Schema](#database-schema)
6. [Data Layer (Server Actions)](#data-layer-server-actions)
7. [Authentication & Authorization](#authentication--authorization)
8. [Component Architecture](#component-architecture)
9. [Key Libraries & Their Roles](#key-libraries--their-roles)
10. [API Routes](#api-routes)
11. [File Uploads](#file-uploads)
12. [Development Workflow](#development-workflow)
13. [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL 14+ |
| ORM | Prisma 7 |
| Auth | NextAuth.js 4 (JWT + Credentials) |
| UI | shadcn/ui + Radix primitives + Tailwind CSS 4 |
| Rich Text | TipTap 3 |
| PDF Gen | @react-pdf/renderer |
| Drag & Drop | @dnd-kit |
| Charts | Recharts 3 |
| Validation | Zod 4 |
| Image Processing | Sharp |
| Cloud Storage | AWS S3 (Cloudflare R2 compatible) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL, NEXTAUTH_SECRET, etc.

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed demo data
npx prisma db seed

# 5. Start dev server
npm run dev
```

### Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cptedindia.com` | `Admin@1234` |
| Student | `student@cptedindia.com` | `Student@1234` |

### Useful Commands

```bash
npm run dev              # Dev server on localhost:3000
npm run build            # Production build
npm run lint             # ESLint
npx prisma migrate dev   # Run migrations
npx prisma db seed       # Seed data
npx prisma studio        # Database GUI
```

---

## Project Structure

```
cpted-sample-/
├── app/
│   ├── (public)/          # Marketing pages (no auth)
│   │   ├── page.tsx       # Homepage
│   │   ├── about/
│   │   ├── contact/
│   │   ├── courses/
│   │   └── services/
│   ├── admin/             # Admin portal (ADMIN role required)
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── users/
│   │   ├── enrollments/
│   │   └── email-templates/
│   ├── app/               # Student portal (authenticated)
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── certificates/
│   │   ├── notes/
│   │   ├── orders/
│   │   └── profile/
│   ├── auth/              # Login & signup
│   │   ├── login/
│   │   └── signup/
│   └── api/               # API routes
│       ├── auth/          # NextAuth catch-all
│       └── upload/        # Image upload endpoint
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── admin/             # Admin-specific components
│   ├── app/               # Student portal components
│   ├── public/            # Marketing site components
│   ├── TipTapEditor.tsx   # Rich text editor (admin)
│   ├── TipTapContent.tsx  # Rich text renderer (student)
│   ├── CertificatePDF.tsx # PDF certificate template
│   ├── CourseCard.tsx     # Shared course card
│   ├── ConfirmDialog.tsx  # Reusable confirmation modal
│   ├── EmptyState.tsx     # Empty state placeholder
│   ├── SessionProvider.tsx# NextAuth session wrapper
│   └── UserAvatar.tsx     # Avatar component
├── lib/
│   ├── actions/           # Server Actions (data layer)
│   │   ├── admin.ts       # Dashboard analytics
│   │   ├── auth.ts        # Signup, profile, password
│   │   ├── certificates.ts# Cert generation & download
│   │   ├── contact.ts     # Contact form
│   │   ├── courses.ts     # Course/module/lesson CRUD
│   │   ├── enrollments.ts # Enrollment management
│   │   ├── notes.ts       # Student notes
│   │   ├── progress.ts    # Lesson/module/course progress
│   │   └── users.ts       # Admin user management
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client singleton
│   └── utils.ts           # Shared utilities
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed script
│   └── migrations/        # Migration history
├── public/                # Static assets & uploads
├── types/                 # TypeScript type definitions
└── next.config.ts         # Next.js configuration
```

---

## Routing & Page Map

### Public Pages (no auth)

| Route | Description |
|-------|-------------|
| `/` | Homepage / landing |
| `/courses` | Course catalog listing |
| `/about` | About CPTED India |
| `/contact` | Contact form |
| `/services` | Services offered |

### Auth Pages

| Route | Description |
|-------|-------------|
| `/auth/login` | User login |
| `/auth/signup` | New user registration |

### Student Portal (`/app/*` — requires authentication)

| Route | Description |
|-------|-------------|
| `/app/dashboard` | Student dashboard with enrolled courses & progress |
| `/app/courses` | Student's enrolled courses |
| `/app/certificates` | Earned certificates |
| `/app/notes` | Per-course notes |
| `/app/orders` | Order/enrollment history |
| `/app/profile` | Profile & password management |

### Admin Portal (`/admin/*` — requires ADMIN role)

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Analytics & overview |
| `/admin/courses` | Course builder (CRUD, module/lesson editor) |
| `/admin/users` | User management |
| `/admin/enrollments` | Enrollment management |
| `/admin/email-templates` | Email template editor |

---

## Database Schema

### Entity Relationship Overview

```
User ──< Enrollment >── Course
User ──< LessonProgress >── Lesson
User ──< QuizAttempt >── Quiz
User ──< Certificate >── Course
User ──< Note >── Course
User ──< Order >── Course

Course ──< Module ──< Lesson
Module ──< Quiz ──< Question
QuizAttempt ──< QuizAnswer >── Question
```

### Models

| Model | Purpose |
|-------|---------|
| `User` | Students and admins. Fields: name, username, email, password (bcrypt), role |
| `Course` | Course catalog. Has slug, pricing, level, tags, publish state, thumbnail |
| `Module` | Ordered sections within a course |
| `Lesson` | Content units within modules (TipTap HTML content) |
| `Quiz` | One quiz per module (optional) |
| `Question` | Multiple-choice (A/B/C/D) with correct answer and explanation |
| `QuizAttempt` | Student quiz submission with score, grade, pass/fail |
| `QuizAnswer` | Per-question answer within an attempt |
| `LessonProgress` | Tracks lesson completion per user (unique per user+lesson) |
| `Enrollment` | Links user to course with status (ACTIVE/REVOKED) |
| `Order` | Purchase/provisioning record |
| `Certificate` | Issued on course completion, unique certificate number |
| `Note` | One note per user per course |
| `ContactSubmission` | Contact form entries |
| `EmailTemplate` | Configurable email templates |

### Enums

- `Role`: STUDENT, ADMIN
- `Level`: BEGINNER, INTERMEDIATE, ADVANCED
- `EnrollmentStatus`: ACTIVE, REVOKED
- `OrderStatus`: PROVISIONED

---

## Data Layer (Server Actions)

The app uses **Next.js Server Actions** exclusively (no REST API routes except auth and upload). All actions live in `lib/actions/`.

| File | Key Functions |
|------|--------------|
| `auth.ts` | `signUp()`, `updateProfile()`, `changePassword()` |
| `courses.ts` | `createCourse()`, `updateCourse()`, `deleteCourse()`, `createModule()`, `updateLesson()`, `reorderModules()`, `reorderLessons()` |
| `enrollments.ts` | `enrollUser()`, `revokeEnrollment()`, `getEnrollments()` |
| `progress.ts` | `markLessonComplete()`, `getModuleProgress()`, `getCourseProgress()` |
| `notes.ts` | `saveNote()`, `getNote()` |
| `certificates.ts` | `generateCertificate()`, `downloadCertificatePDF()` |
| `admin.ts` | `getDashboardStats()`, analytics aggregation queries |
| `users.ts` | `getUsers()`, `updateUserRole()`, `deleteUser()` |
| `contact.ts` | `submitContactForm()` |

### Pattern

All server actions follow this pattern:
1. Validate input with Zod
2. Check authentication/authorization via NextAuth session
3. Execute Prisma query
4. Return typed result or throw error

---

## Authentication & Authorization

- **Provider**: NextAuth.js v4 with Credentials provider
- **Strategy**: JWT sessions (30-day expiry)
- **Password hashing**: bcryptjs
- **Session payload**: `id`, `email`, `name`, `username`, `role`

### Route Protection

- `/app/*` — requires any authenticated user
- `/admin/*` — requires `role === ADMIN`, non-admins redirected to `/app/dashboard`
- Public routes — no auth required

> Note: No `middleware.ts` file exists currently; route protection is handled within page/layout components and server actions.

---

## Component Architecture

### Shared Components (root of `/components/`)

| Component | Purpose |
|-----------|---------|
| `TipTapEditor.tsx` | Rich text editor for admin lesson editing |
| `TipTapContent.tsx` | Read-only TipTap content renderer for students |
| `CertificatePDF.tsx` | React-PDF template for certificate generation |
| `CourseCard.tsx` | Reusable course display card |
| `ConfirmDialog.tsx` | Generic confirmation modal |
| `EmptyState.tsx` | Empty state UI placeholder |
| `SessionProvider.tsx` | NextAuth `SessionProvider` wrapper |
| `UserAvatar.tsx` | User avatar with fallback |

### UI Components (`/components/ui/`)

Built with shadcn/ui (Radix + Tailwind). Includes: Button, Card, Dialog, Input, Select, Tabs, Toast, Tooltip, Accordion, Progress, etc.

### Feature Components

- `/components/admin/` — Course editor forms, data tables, dashboard charts, user management UI
- `/components/app/` — Lesson viewer, quiz interface, certificate display, progress trackers
- `/components/public/` — Landing page sections, course catalog cards, navigation, footer

---

## Key Libraries & Their Roles

| Library | Usage |
|---------|-------|
| **TipTap** | Rich text editor (admin creates lesson content) and renderer (students view it). Extensions: code-block, color, highlight, image, link, tables, text-align |
| **@react-pdf/renderer** | Generates downloadable PDF certificates on course completion |
| **@dnd-kit** | Drag-and-drop reordering of modules and lessons in the admin course builder |
| **Recharts** | Analytics charts on the admin dashboard |
| **Zod** | Input validation schemas for all server actions |
| **bcryptjs** | Password hashing for credential auth |
| **date-fns** | Date formatting and manipulation |
| **Sharp** | Server-side image optimization |
| **@aws-sdk/client-s3** | Cloud image storage (Cloudflare R2) |
| **Sonner** | Toast notifications |
| **uuid** | Certificate number generation |

---

## API Routes

Only two API routes exist — everything else uses server actions.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth.js authentication endpoints |
| `/api/upload` | POST | Image upload (admin-only, 10MB limit, jpeg/png/gif/webp) |

---

## File Uploads

- **Endpoint**: `POST /api/upload`
- **Auth**: Admin-only
- **Limit**: 10MB
- **Allowed types**: jpeg, png, gif, webp
- **Storage**: Files saved to `/public/uploads/` (local) or Cloudflare R2 (production)
- **Serving**: Static assets via Next.js public directory

---

## Development Workflow

### Adding a New Feature

1. **Schema changes** — Update `prisma/schema.prisma`, run `npx prisma migrate dev --name <name>`
2. **Server actions** — Add/modify functions in `lib/actions/<domain>.ts`
3. **Components** — Build UI in the appropriate `components/` subdirectory
4. **Pages** — Create/update page in the correct route group under `app/`
5. **Validation** — Add Zod schemas for any new server action inputs

### Adding a New Admin Page

1. Create `app/admin/<feature>/page.tsx`
2. Add server actions in `lib/actions/`
3. Build components in `components/admin/`
4. The route is auto-protected by the admin layout

### Adding a New Student Feature

1. Create `app/app/<feature>/page.tsx`
2. Add server actions in `lib/actions/`
3. Build components in `components/app/`
4. The route is auto-protected by the app layout

### Code Conventions

- Server-side data fetching only (no client-side API calls except auth)
- `"use server"` directive at top of all action files
- `"use client"` only when component needs browser APIs or interactivity
- Tailwind CSS for all styling — no CSS modules or styled-components
- All form submissions go through server actions, not API routes

---

## Deployment

- **Platform**: Vercel (recommended) or any Node.js hosting
- **Build**: `npm run build` (runs `prisma generate` via postinstall)
- **Database**: External PostgreSQL (Neon, Supabase, or self-hosted)
- **Image Storage**: Cloudflare R2 for production, local `/public/uploads/` for dev
- **Environment Variables**: See `.env.example` for full list

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXTAUTH_URL` | App URL |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |
| R2/S3 vars | Bucket name, access key, secret key, endpoint (for production image storage) |
