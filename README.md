# IT Help Desk and Support Ticketing System

Full-stack IT Help Desk and Support Ticketing System built with:
- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB
- JWT Authentication

## Core Features

- User registration and login with JWT
- Admin, support staff, and user roles
- Ticket creation with category and priority
- Ticket assignment for admin/support staff
- Ticket status tracking from Open to Closed
- Comments section for ticket conversations
- Search and filtering by status or priority
- Analytics dashboard with ticket status report
- Knowledge base API for FAQ articles
- Service catalog and service requests
- Asset, problem, change, automation, report, and user management APIs

## Backend API Modules

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `GET/POST /api/tickets`, `GET /api/tickets/:id`, `PATCH /api/tickets/:id`
- `GET/POST /api/tickets/:id/messages` and `POST /api/tickets/:id/comments`
- `GET/POST /api/knowledge`
- `GET/POST /api/catalog`
- `GET/POST /api/requests`
- `GET/POST /api/assets`
- `GET/POST /api/problems`
- `GET/POST /api/changes`, `PATCH /api/changes/:id/approve`
- `GET/POST /api/automation`, `PATCH /api/automation/:id/toggle`
- `GET /api/reports/service-desk`
- `GET /api/users`, `PATCH /api/users/:id/role`

If neither `MONGODB_URI` nor `MONGO_URI` is configured, or the URI is still set to `your_mongodb_connection_string`, the backend runs in demo mode with in-memory seeded data. Use a real MongoDB connection string for persistent data.

## Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

Create `server/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/it_helpdesk_system?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_secure_secret
```

Seed MongoDB with the demo data:

```bash
npm run seed
```

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` by default. To change it, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```
