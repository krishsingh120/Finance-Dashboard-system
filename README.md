





 # FinFlow API — Finance-Dashboard-system

A modular monolith REST API backend for a Finance Dashboard system,
built with Node.js, Express.js, MongoDB Atlas, and Redis.

## Tech Stack

| Layer                   | Technology                        |
| ----------------------- | --------------------------------- |
| Runtime                 | Node.js v20                       |
| Framework               | Express.js v5                     |
| Database                | MongoDB Atlas (Mongoose ODM)      |
| Cache / Token Blacklist | Redis (Docker)                    |
| Auth                    | JWT Dual Token (Access + Refresh) |
| Validation              | Joi                               |
| Security                | Helmet, CORS, Rate Limiting       |

---

## Architecture

This project follows a **Modular Monolith** architecture with a strict
**Layered Pattern** inside each module.
```bash
Request → Route → Controller → Service → Repository → Database
```

Each layer has a single responsibility:

| Layer      | Responsibility                              |
| ---------- | ------------------------------------------- |
| Route      | URL mapping, middleware chain attach karna  |
| Controller | req/res handle karna, service call karna    |
| Service    | Business logic, validations, rules          |
| Repository | Sirf DB queries — Mongoose calls yahan only |

### Folder Structure

``` bash
src/
├── modules/
│ ├── auth/ # register, login, refresh, logout
│ ├── users/ # CRUD, role management, soft delete
│ ├── records/ # financial entries CRUD, filters, pagination
│ └── dashboard/ # aggregation APIs, summary, trends
├── middlewares/ # auth guard, RBAC, validation, error handler
├── config/ # db, redis, server config
├── utils/ # response helper, asyncHandler
└── errors/ # custom error classes

Each module is self-contained:
module/
├── module.routes.js # route definitions
├── module.controller.js # req/res handling
├── module.service.js # business logic
├── module.repository.js # DB queries
├── module.model.js # Mongoose schema
└── module.validator.js # Joi validation schemas

---
```

## Role Based Access Control

| Endpoint                     | viewer | analyst | admin |
| ---------------------------- | ------ | ------- | ----- |
| GET /records                 | ✅     | ✅      | ✅    |
| POST /records                | ❌     | ❌      | ✅    |
| PUT /records/:id             | ❌     | ❌      | ✅    |
| DELETE /records/:id          | ❌     | ❌      | ✅    |
| GET /dashboard/summary       | ✅     | ✅      | ✅    |
| GET /dashboard/recent        | ✅     | ✅      | ✅    |
| GET /dashboard/category-wise | ❌     | ✅      | ✅    |
| GET /dashboard/trends        | ❌     | ✅      | ✅    |
| GET /users                   | ❌     | ❌      | ✅    |
| PATCH /users/:id/role        | ❌     | ❌      | ✅    |
| PATCH /users/:id/status      | ❌     | ❌      | ✅    |
| DELETE /users/:id            | ❌     | ❌      | ✅    |
| GET /users/me                | ✅     | ✅      | ✅    |

---

## Prerequisites

- Node.js v18+
- Docker (for Redis)
- MongoDB Atlas account

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/krishsingh120/Finance-Dashboard-system.git
cd Finance-Dashboard-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Redis via Docker

```bash
docker run -d --name redis-finflow -p 6379:6379 redis:alpine
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.dtlbgzu.mongodb.net/?appName=Cluster0
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 5. Start the server

```bash
npm run dev
```

Expected output:
MongoDB connected: cluster0.dtlbgzu.mongodb.net
Redis connected
Server running on port 3000 in development mode

---

## API Endpoints

### Health Check

GET /health

---

### Auth

| Method | Endpoint           | Description                       | Auth |
| ------ | ------------------ | --------------------------------- | ---- |
| POST   | /api/auth/register | Register new user                 | ❌   |
| POST   | /api/auth/login    | Login, get access + refresh token | ❌   |
| POST   | /api/auth/refresh  | Get new access token              | ❌   |
| POST   | /api/auth/logout   | Blacklist refresh token in Redis  | ❌   |

---

### Users

| Method | Endpoint              | Description           | Roles |
| ------ | --------------------- | --------------------- | ----- |
| GET    | /api/users            | All users             | admin |
| GET    | /api/users/me         | Own profile           | all   |
| GET    | /api/users/:id        | User by id            | admin |
| PATCH  | /api/users/:id/role   | Update role           | admin |
| PATCH  | /api/users/:id/status | Activate / deactivate | admin |
| DELETE | /api/users/:id        | Soft delete           | admin |

---

### Records

| Method | Endpoint         | Description              | Roles |
| ------ | ---------------- | ------------------------ | ----- |
| POST   | /api/records     | Create record            | admin |
| GET    | /api/records     | All records with filters | all   |
| GET    | /api/records/:id | Record by id             | all   |
| PUT    | /api/records/:id | Update record            | admin |
| DELETE | /api/records/:id | Soft delete              | admin |

**Query params for `GET /api/records`:**
?type=income
?type=expense
?category=salary
?startDate=2026-01-01
?endDate=2026-03-31
?page=1&limit=10

---

### Dashboard

| Method | Endpoint                     | Description                        | Roles          |
| ------ | ---------------------------- | ---------------------------------- | -------------- |
| GET    | /api/dashboard/summary       | Total income, expense, net balance | all            |
| GET    | /api/dashboard/recent        | Recent 10 transactions             | all            |
| GET    | /api/dashboard/category-wise | Category wise totals               | analyst, admin |
| GET    | /api/dashboard/trends        | Monthly trends                     | analyst, admin |

---

## Auth Flow

```bash

1.Register / Login → get accessToken (15m) + refreshToken (7d)
2. Protected routes mein header add karo: Authorization: Bearer<accessToken>
3. Access token expire hone pe: POST /api/auth/refresh → { refreshToken } → new accessToken
4. Logout: POST /api/auth/logout → { refreshToken } → token Redis mein blacklist ho jata hai → dobara use karne pe 401 Unauthorized
```

## Request / Response Format

### Success Response

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Assumptions

- First registered user should be manually promoted to admin
  via MongoDB Atlas or direct DB update
- Soft delete is used for both users and records —
  deleted data retained in DB with `isDeleted: true`
- Amount must always be positive — `type` field (income/expense)
  determines the direction
- Date defaults to current date if not provided in record creation

## Design Decisions

| Decision                                | Reason                                                                       |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Modular Monolith                        | Right size for this use case, clean separation without microservice overhead |
| Repository Pattern                      | Decouples DB layer from business logic, easy to swap DB                      |
| Redis blacklist for logout              | Stateless JWT with ability to invalidate tokens                              |
| MongoDB indexes on type, category, date | Faster filter queries on records                                             |
| Soft delete                             | Data integrity and audit trail preserved                                     |
| Joi validation                          | Declarative schema validation, clean error messages                          |
| Custom error classes                    | Consistent error handling across all layers                                  | --> -->
