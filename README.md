# Finance Dashboard Backend

A Node.js backend for a financial management dashboard built with Express, TypeScript, and Prisma. This project provides a secure, production-ready API with Role-Based Access Control (RBAC), JWT authentication, and automated database migrations specifically configured for Supabase PostgreSQL.

---

## Architecture
The project follows a clean, modular architecture:
- **Routes**: API endpoint definitions and middleware orchestration.
- **Controllers**: HTTP request/response handling.
- **Services**: Business logic and application rules.
- **Repositories**: Data access layer using Prisma ORM.
- **Middleware**: Authentication, Authorization (RBAC), and Validation.

---

## Core Features
1. **RBAC Security**: Granular permissions for Admin, Analyst, and Viewer roles.
2. **JWT Authentication**: Secure login and session management.
3. **Optimized Aggregation**: Efficient database-level calculations for dashboard metrics.
4. **Validation**: Strict input schema validation using Zod.
5. **Security Middleware**: Integration with Helmet, CORS, and Express Rate Limit.
6. **Logging**: Structured industry-standard logging with Pino.

---

## Setup Instructions

### Pre-requisites
- Node.js (v18 or higher)
- Supabase account with a PostgreSQL project

### Database Setup
1. Copy the Connection URI from your Supabase project settings.
2. In your `.env` file, set `DATABASE_URL` (using Transactional mode on port 6543) and `DIRECT_URL` (using port 5432).

### Installation
```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run build
npm run start
```

---

## Environment Variables
- `NODE_ENV`: Application environment (development/production).
- `PORT`: Server port.
- `DATABASE_URL`: Connection string for PostgreSQL (Pooled).
- `DIRECT_URL`: Connection string for PostgreSQL (Direct).
- `JWT_SECRET`: Minimum 32-character secure secret.
- `JWT_EXPIRES_IN`: Token life (e.g., 7d).
- `LOG_LEVEL`: Pino log severity (info/error/debug).

---

## Deployment
This project is configured for deployment on platforms like Render or Railway.
- **Build Settings**: `npm install && npm run build`
- **Start Command**: `npm run prisma:deploy && npm start`

---

## API Documentation
The API includes integrated OpenAPI/Swagger documentation.
- **Link**: `/api-docs` on the running server.
- **Spec**: `/api-docs.json` for external tools.
# Finance-Dashboard-Backend
