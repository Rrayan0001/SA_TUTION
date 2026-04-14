# Tuition Attendance Management

A premium, modern, minimal tuition attendance management website built with Next.js App Router, TypeScript, Tailwind CSS, ShadCN-style UI components, Prisma, and Neon/PostgreSQL.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ShadCN-style UI component structure
- Prisma ORM
- NeonDB / PostgreSQL
- Vercel-ready deployment structure

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and add your Neon connection string:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Push or migrate your database schema:

   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## Database Notes

The Prisma schema creates:

- `students`
- `attendance`

Attendance records are constrained so each student can only have one record per date.

## Features

- Premium dashboard calendar with date-level attendance drilldown
- Fast attendance marking with duplicate-safe upserts
- Student reports with filters and individual history pages
- Admin panel with add, edit, and delete flows
- Responsive design, toasts, empty states, and loading skeletons

## Deploying To Vercel

1. Add `DATABASE_URL` in the Vercel project environment variables.
2. Run Prisma migrations against your production Neon database.
3. Deploy normally with the default Next.js settings.
