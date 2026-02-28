# CPTEDINDIA eLearning Platform

A production-grade eLearning platform built with Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## Prerequisites

- **Node.js** 18 or higher ([download](https://nodejs.org))
- **PostgreSQL** 14 or higher running locally
- **npm** 9 or higher (comes with Node.js)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local development |

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed the Database

Populates the database with sample data including admin user, student account, and 3 complete courses.

```bash
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@cptedindia.com | Admin@1234 |
| **Student** | student@cptedindia.com | Student@1234 |

---

## Project Structure

```
cptedindia/
├── app/
│   ├── (public)/          # Public marketing website
│   │   ├── page.tsx       # Home page
│   │   ├── about/         # About page
│   │   ├── courses/       # Course listing + detail
│   │   └── contact/       # Contact form
│   ├── app/               # Student portal (/app/*)
│   │   ├── dashboard/     # Student dashboard
│   │   ├── courses/       # My courses + lesson reader + quiz
│   │   ├── certificates/  # Certificate download
│   │   ├── orders/        # Order history
│   │   ├── notes/         # Course notes
│   │   └── profile/       # Account settings
│   ├── admin/             # Admin portal (/admin/*)
│   │   ├── dashboard/     # Admin dashboard with charts
│   │   ├── courses/       # Course management + editor
│   │   ├── users/         # User management
│   │   ├── enrollments/   # Enrollment management
│   │   └── email-templates/ # Email template editor
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/                # shadcn/ui primitives
│   ├── public/            # Public site components
│   ├── app/               # Student app components
│   └── admin/             # Admin portal components
├── lib/
│   ├── actions/           # Server actions
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client singleton
│   └── utils.ts           # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
└── public/
    └── uploads/           # Uploaded files (images)
```

## Key Features

- **Multi-role auth** — STUDENT and ADMIN roles with route protection
- **Rich text editing** — TipTap editor for lesson content creation
- **Faithful rendering** — Lesson content renders identically for students
- **Module quizzes** — Per-module quizzes with scoring and grade assignment
- **Auto certificates** — Generated when all modules are completed and passed
- **PDF certificates** — Downloadable landscape PDFs with certificate number
- **Progress tracking** — Per-lesson completion with percentage calculation
- **Notes system** — Per-course notes with auto-save
- **Admin dashboard** — Revenue and enrollment charts with Recharts
- **Course builder** — Drag-and-drop module/lesson reordering with dnd-kit
