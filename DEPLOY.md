# Deployment Guide — Motowarehouse Staff Leave

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Railway)
- **Auth**: NextAuth.js (credentials, database-backed, 2 admin accounts)
- **Deployment**: Railway (or any Node host)

This app was built to match the visual style of the Motowarehouse Insurance
Case Management app (same teal/navy palette, Lato font, sidebar layout), but
it is a fully separate application with its own login and database.

---

## Step 1: Set Up the Database

1. Go to [Railway](https://railway.app) → New Project → Add a **PostgreSQL** plugin
   (or use any Postgres instance you already have).
2. Copy the connection string — you'll need it as `DATABASE_URL`.

## Step 2: Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL          = (your Postgres connection string)
NEXTAUTH_SECRET       = (run: openssl rand -base64 32)
NEXTAUTH_URL          = https://your-app.up.railway.app (or http://localhost:3000 locally)

ADMIN1_USERNAME       = (choose a username, e.g. nikolas)
ADMIN1_PASSWORD       = (choose a strong password)
ADMIN1_NAME           = Nikolas

ADMIN2_USERNAME       = (second account, e.g. owner)
ADMIN2_PASSWORD       = (choose a strong password)
ADMIN2_NAME           = Owner
```

The ADMIN1/ADMIN2 variables are only read once, by the seed script, to create
the two login accounts in the database. Change the passwords before seeding —
they are not meant to be the final production passwords.

## Step 3: Install, Migrate, Seed

```bash
cd employee-leave-app
npm install

# Create the database tables
npx prisma db push

# Create the 2 admin accounts + seed 2026 Cyprus public holidays
npm run db:seed

# Run locally
npm run dev
```

Open http://localhost:3000 and sign in with the ADMIN1/ADMIN2 credentials
you set in `.env`.

## Step 4: Deploy to Railway

1. Push this folder to a GitHub repository.
2. Railway → New Project → Deploy from GitHub.
3. Attach the PostgreSQL plugin if you haven't already.
4. Set the environment variables listed above on the Railway service.
5. Railway will run `prisma generate && next build` automatically (see
   `package.json`'s `build` script), then `next start`.
6. After the first deploy, run `npx prisma db push` and `npm run db:seed`
   once (via Railway's shell/CLI) to create tables and the two accounts.

---

## How It Works

- **Employees** have a fixed annual leave entitlement (23 days by default,
  editable per employee).
- **Leave Entries** (Annual or Sick) are logged with a date range. Working
  days are calculated automatically — weekends and Cyprus public holidays
  are excluded.
- **Sick leave** is tracked with no cap, purely for record-keeping.
- **Shop Closures** let you log one date range (e.g. the August break or
  Christmas) and apply it as annual leave to every active employee in one
  step, deducting from each person's balance automatically.
- **Public Holidays** page lets you add next year's Cyprus holiday dates
  once they're announced — 2026 is pre-seeded.
- **Team Calendar** shows the whole team's leave for any month at a glance.

## Adding More Admin Accounts Later

The two seeded accounts are stored in the `User` table (bcrypt-hashed
passwords). To add a third account, insert a row via `npx prisma studio`
or extend the seed script — there's no per-seat UI for this yet since the
brief called for exactly two admins.

## A Note on This Build

This project was developed and verified in a sandboxed environment without
access to Prisma's binary CDN (`binaries.prisma.sh`), so the Prisma query
engine itself could not be downloaded here. The application code compiles
cleanly and its core leave-calculation logic was verified with standalone
tests. Running `npm install` on your own machine or on Railway (both have
normal internet access) will let `prisma generate` complete fully — this is
a routine step and not expected to cause any issues.
