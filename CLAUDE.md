# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint
npx prisma migrate dev    # Run database migrations
npx prisma db seed        # Seed demo data (admin + student users, 3 courses)
npx prisma studio         # Open Prisma database GUI
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- `DATABASE_URL` — PostgreSQL 14+ connection string
- `NEXTAUTH_SECRET` — Random base64 secret
- `NEXTAUTH_URL` — App URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_APP_URL` — Same as NEXTAUTH_URL

Default seeded credentials:
- Admin: `admin@cptedindia.com` / `Admin@1234`
- Student: `student@cptedindia.com` / `Student@1234`

## Architecture

**Full-stack eLearning LMS** built with Next.js App Router, PostgreSQL + Prisma, NextAuth.js (JWT/Credentials), and shadcn/ui.

### Route Groups

- `(public)/` — Marketing pages (home, courses listing, course detail, about, contact) — no auth required
- `app/` — Authenticated student portal (dashboard, lessons, quizzes, certificates, notes, profile)
- `admin/` — Admin portal (course builder, user management, enrollments, analytics, email templates)
- `auth/` — Login and signup pages

### Data Layer

All data operations use **Next.js Server Actions** in `/lib/actions/` — there are almost no traditional API routes (only NextAuth catch-all and an image upload endpoint). Actions are organized by domain:

| File | Responsibility |
|------|---------------|
| `auth.ts` | Signup, profile update, password change |
| `courses.ts` | Course/module/lesson CRUD, reordering |
| `enrollments.ts` | Enroll, revoke, list enrollments |
| `progress.ts` | Lesson/module/course completion tracking |
| `notes.ts` | Per-course student notes |
| `certificates.ts` | Certificate generation and PDF download |
| `admin.ts` | Dashboard analytics queries |
| `users.ts` | Admin user management |
| `contact.ts` | Contact form submissions |

### Authentication & Authorization

- NextAuth.js with JWT session strategy (30-day expiry)
- Middleware at `middleware.ts` protects `/app/*` and `/admin/*`
- ADMIN role required for `/admin/*` — non-admins redirected to `/app/dashboard`
- Session includes: `id`, `email`, `name`, `username`, `role`

### Key Schema Models

`User` → `Enrollment` → `Course` → `Module` → `Lesson`
`Module` → `Quiz` → `Question` → `QuizAttempt` / `QuizAnswer`
`LessonProgress`, `Certificate`, `Note`, `Order`, `ContactSubmission`, `EmailTemplate`

Enums: `Role` (STUDENT/ADMIN), `Level` (BEGINNER/INTERMEDIATE/ADVANCED), `EnrollmentStatus` (ACTIVE/REVOKED)

### Component Organization

- `/components/ui/` — shadcn/ui base components
- `/components/admin/` — Admin-specific components (course editor, tables, charts)
- `/components/app/` — Student portal components (lesson viewer, quiz, certificate)
- `/components/public/` — Marketing site components

### Notable Libraries

- **TipTap** — Rich text editor for lesson content (admin edit) and content display (student view)
- **@react-pdf/renderer** — PDF certificate generation
- **@dnd-kit** — Drag-and-drop module/lesson reordering in admin course builder
- **Recharts** — Admin dashboard analytics charts
- **Zod** — Schema validation for server actions

### File Uploads

Images upload via `POST /api/upload` (admin-only). Files are saved to `/public/uploads/` and served as static assets. 10MB limit, allowed types: jpeg, png, gif, webp.

### Role

You are a Senior Software Engineer responsible for modifying and improving the existing codebase.

Your primary task is to implement changes required by ongoing Agile development updates.

### Responsibilities
- Carefully read and understand the requested change.
- Apply the modification directly to the existing codebase.
- Make only the changes that are explicitly required.
- Preserve the existing architecture, style, and conventions of the project.
- Avoid introducing unnecessary refactoring or unrelated improvements.
- Ensure the updated code remains correct, consistent, and functional.

Focus strictly on implementing the requested Agile change within the current codebase.