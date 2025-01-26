# IMF Gadget Management API 🕵️‍♂️🔧

## Overview

Secure API for managing IMF gadget inventory with authentication and role-based access control.

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Prerequisites

- Node.js 18+
- PostgreSQL
- npm/yarn

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/imf-gadget-api.git
cd imf-gadget-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

- Copy `.env.example` to `.env`
- Update database and JWT credentials

### 4. Database Setup

```bash
# Create database
createdb imf_gadget_db

# Run migrations
npx prisma migrate dev
```

### 5. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

### Gadgets

- `GET /api/gadgets`
- `POST /api/gadgets`
- `PATCH /api/gadgets/:id`
- `DELETE /api/gadgets/:id`
- `POST /api/gadgets/:id/self-destruct`

## Authentication

Role-based access:

- AGENT: Read-only
- HANDLER: Modify gadgets
- DIRECTOR: Full access

## TO-DO

- [ ] Create and build Docker container
- [ ] Deploy to Production
