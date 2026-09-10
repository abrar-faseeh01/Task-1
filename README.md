Absolutely. Copy-paste **everything below** directly into your root `README.md`:

````md
# Task-1 6Sense

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
````

### 2. Backend Setup

Open a terminal and run:

```bash
cd backend
npm install
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

Create a `backend/.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### 3. Frontend Setup

Open another terminal from the project root and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:3001
```

Create a `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Day 1

- Set up NestJS backend
- Connected MongoDB Atlas using Mongoose
- Added environment-based configuration
- Added feature-based `health` module
- Added `GET /health` endpoint
- Set up Next.js with App Router
- Connected frontend to backend health check
- Added `.env.example` files for backend and frontend
- Added AI usage documentation

## Health Check

The backend provides:

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

The frontend also calls this endpoint and displays the API and database connection status.

## Environment Variables

Real environment files containing secrets are not committed to the repository.

Use the provided example files as references:

- `backend/.env.example`
- `frontend/.env.example`
