# Week-1_6Sense

Developer Community project built during the 6Sense Agentic Software Engineer internship.

## Project Structure

- `backend/` — NestJS backend
- `frontend/` — Next.js frontend

## Setup

### 1. Clone the Repository

```bash
git clone git@github.com:abrar-faseeh01/Week-1_6Sense.git
cd Week-1_6Sense
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `backend/.env` file (see `backend/.env.example`):

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=a_random_string_at_least_32_characters_long
JWT_EXPIRES_IN=2h
FRONTEND_ORIGIN=http://localhost:3001
```

`JWT_SECRET` and `MONGODB_URI` are required — the app fails fast at startup
if they're missing or `JWT_SECRET` is under 32 characters (see
`backend/src/config/env.validation.ts`).

Run it:

```bash
npm run start:dev
```

The backend runs on `http://localhost:3000`.

#### Bootstrapping the first admin user

Signup (`POST /auth/signup`) always creates a `user`-role account — there is
no way to create an `admin` through the API. To get your first admin, add
these two vars to `backend/.env` **temporarily**:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=a_strong_password
```

Then run:

```bash
npm run seed:admin
```

This creates one `admin` user if none exists yet (it's a no-op if an admin
already exists). You can remove `ADMIN_EMAIL`/`ADMIN_PASSWORD` from `.env`
afterwards — they're only read by this script, never by the running app.

### 3. Frontend Setup

Open another terminal from the project root and run:

```bash
cd frontend
npm install
```

Create a `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run it:

```bash
npm run dev
```

The frontend runs on `http://localhost:3001`.

## Authentication

- JWT access tokens carry `sub` (user id), `email`, and `role`.
- The token is stored in an **httpOnly cookie** (`access_token`), not in
  client-accessible storage — the frontend never reads or stores the token
  itself, it just sends `credentials: "include"` on every API request.
- Roles are `admin` | `user`. Every new signup defaults to `user`; there is
  no client-supplied field that can set or change a role.
- Available endpoints:
  - `POST /auth/signup` — register (public)
  - `POST /auth/login` — log in, sets the cookie (public)
  - `POST /auth/logout` — clears the cookie (public — always succeeds, even
    with an expired/invalid/missing token)
  - `GET /auth/me` — current user (requires a valid session)
  - `PATCH /auth/me` — change password and/or (admin-only) email, requires
    `currentPassword` (requires a valid session)

## Health Check

```text
GET http://localhost:3000/health
```

A successful response confirms that both the API and database connection are working:

```json
{
  "success": true,
  "data": {
    "api": "ok",
    "database": "connected"
  }
}
```

If the database is unreachable, this returns a `503` with the standard error
envelope instead:

```json
{
  "success": false,
  "statusCode": 503,
  "message": "Database not connected",
  "errors": []
}
```

The frontend home page calls this endpoint and displays the result.

## Environment Variables

Real environment files containing secrets are not committed to the repository.

Use the provided example files as references:

- `backend/.env.example`
- `frontend/.env.example`

## Progress

### Day 1

- Set up NestJS backend
- Connected MongoDB Atlas using Mongoose
- Added environment-based configuration
- Added feature-based `health` module
- Added `GET /health` endpoint
- Set up Next.js with App Router
- Connected frontend to backend health check
- Added `.env.example` files for backend and frontend
- Added AI usage documentation

### Day 2

- User schema with `role: admin | user` (default `user` on signup)
- `POST /auth/signup`, `POST /auth/login` (JWT in an httpOnly cookie)
- Global auth guard (protected by default; opt out with `@Public()`) and
  roles guard for admin-only routes
- `npm run seed:admin` to bootstrap the first admin account
- Signup, login, logout, and settings (credential update) pages on the
  frontend; header shows the current user and role; protected routes
  redirect unauthenticated users to `/login`
