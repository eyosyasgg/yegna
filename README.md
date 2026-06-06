# Yegna — Wellness Growth-Partner Matching Platform

A full-stack web MVP that connects users with growth partners. Choose a mode, get matched, and track shared progress.

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL via `pg` (raw SQL, no ORM)
- **Auth:** JWT stored in localStorage

## Prerequisites

- Node.js 18+
- PostgreSQL running locally on port 5432

## Setup

### 1. Create the database

```bash
createdb yegna
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
# Edit .env with your database credentials and a JWT secret
npm install
npm run dev
```

The server auto-runs `init.js` which creates all tables and seeds test data.

### 3. Start the client

```bash
cd client
npm install
npm run dev
```

### 4. Open in browser

Visit `http://localhost:5173`

## Test Credentials

| Name | Email | Password | Mode | Status |
|---|---|---|---|---|
| Aisha Tadesse | test1@yegna.com | password123 | Commit | Matched with Bereket |
| Bereket Haile | test2@yegna.com | password123 | Commit | Matched with Aisha |
| Selam Girma | test3@yegna.com | password123 | Explore | Pending match |

## Pages

- **Landing (/)** — Hero, how it works, three modes, footer
- **Register (/register)** — Create an account
- **Login (/login)** — Sign in
- **Onboarding (/onboarding)** — 3-step wizard (mode → goal → profile)
- **Dashboard (/dashboard)** — Match card, progress, activity feed
- **Profile (/profile)** — Edit profile, goal summary, check-in history

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/onboarding | Yes | Complete onboarding |
| GET | /api/profile | Yes | Get full profile |
| PUT | /api/profile | Yes | Update profile |
| GET | /api/match | Yes | Get match details |
| POST | /api/checkins | Yes | Submit daily check-in |
| GET | /api/checkins | Yes | Get recent check-ins |
| GET | /api/checkins/activity | Yes | Get activity feed |

## Known Limitations / Future Improvements

- No email verification or password reset flow
- Matching is basic (first available pending user)
- No real-time notifications when matched
- No messaging or chat between partners
- Limited to one active goal per user
- No image upload for avatars
- No admin panel or moderation
- Test coverage not yet implemented
