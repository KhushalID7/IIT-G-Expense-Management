# Backend (Express + MongoDB)

This folder contains a minimal Express backend scaffold for the IIT-G Expense Management app. It provides separate authentication routes for Admin, Manager and Employee collections and uses JWT for authentication.

Quick start

1. Copy `.env.example` to `.env` and fill in the values (do NOT commit `.env`).

2. Install dependencies and run the server:

```powershell
cd backend
npm install
npm run dev
```

3. API endpoints

Auth routes (register/login) for each role:

POST /api/admin/register
POST /api/admin/login

POST /api/manager/register
POST /api/manager/login

POST /api/employee/register
POST /api/employee/login

Each login returns a JSON body with a `token` that should be sent in the `Authorization: Bearer <token>` header for protected endpoints.

Notes
- The repo contains `.env.example` with a placeholder MONGO_URI (do not commit secrets).
- This is a scaffold. Add validation, rate limiting, and tests for production use.
