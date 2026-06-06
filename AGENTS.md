# Yegna — AGENTS.md

## Project structure

Two independent packages with separate `npm install` / `npm run dev`:

```
yegna/
├── server/   — Express ESM (`"type": "module"`)
└── client/   — React + Vite + TailwindCSS
```

No monorepo tool, no shared scripts, no test/lint/typecheck config in either package.

## Setup sequence

1. `createdb yegna` (PostgreSQL must be running on :5432)
2. `cd server && cp .env.example .env` then fill `DATABASE_URL` and `JWT_SECRET`
3. `cd server && npm install && npm run dev` — runs `node --watch index.js`, awaits `initDB()` before `app.listen()`, auto-creates tables + seeds 3 test users
4. `cd client && npm install && npm run dev` — Vite proxies `/api` → `http://localhost:3001`

## Server quirks

- **ESM**: all files use `import`/`export`, `package.json` has `"type": "module"`
- **Dev**: Node 18+ `--watch` flag (not nodemon)
- **DB init** (`db/init.js`): async function called via `initDB().then(() => app.listen(...))`. Wraps all CREATE TABLE + seed INSERTs in PostgreSQL queries. If `users` table has rows, seed is skipped. Seed dates are computed in JS as `YYYY-MM-DD` strings and passed as parameters with `$N::DATE` cast — do NOT pass SQL expressions like `NOW() - INTERVAL` as parameter values (pg treats them as literal strings, causing type errors).
- **Auth**: JWT with `expiresIn: '7d'`. Middleware sets `req.user = { userId, email }`.
- **All API responses**: `{ success: boolean, data: ..., error: "..." }` — check `success` before accessing `data`.

## Client quirks

- **Auth**: Token stored in `localStorage` key `yegna_token`, user object in `yegna_user`. AuthContext verifies token via `GET /api/auth/me` on mount. Axios interceptor in `api/client.js` attaches `Authorization: Bearer` header and redirects to `/login` on 401.
- **Tailwind custom colors** (extended in `tailwind.config.js`): `amber`, `amber-light`, `cream`, `cream-light`, `coral`, `near-black`, `warm-gray`, `border`. Used throughout instead of default Tailwind colors.
- **Dark mode**: managed via `AuthContext.darkMode` state + `toggleDarkMode()`. `.dark` class on `<html>` cascades through CSS custom properties — no `dark:` variant prefixes needed.
- **Fonts**: `font-display` (Playfair Display) for headings, `font-body` (Inter) for everything else — set via Tailwind fontFamily extension, not CSS classes on elements.
- **Pages** are auth-guarded by `<AuthGuard>` in `App.jsx` (redirects to `/login` if no token). Landing page uses `<NonAuthLayout>` which shows Navbar but hides sign-in if already authenticated.
- **Toast system**: context-based `ToastProvider` with `useToast()` hook. Auto-dismiss after 3s.
- **Responsive**: mobile-first with breakpoints at 640px and 1024px. Max content width 1280px centered.

## Ports

| Service | Port |
|---------|------|
| Server  | 3001 (or `$PORT`) |
| Client  | 5173 (Vite default) |

## Test accounts

All password `password123`:

| Email | Mode | Status |
|---|---|---|
| test1@yegna.com | commit | Matched with user 2 |
| test2@yegna.com | commit | Matched with user 1 |
| test3@yegna.com | explore | Pending |
