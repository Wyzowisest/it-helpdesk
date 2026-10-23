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

For local development, if neither `MONGODB_URI` nor `MONGO_URI` is configured, the backend uses in-memory demo data. Production mode refuses to start without a MongoDB connection and a strong `JWT_SECRET`.

## Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

Copy `server/.env.example` to `server/.env`, then set values from MongoDB Atlas:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<db-user>:<db-password>@<cluster-host>/it_helpdesk_system?retryWrites=true&w=majority
JWT_SECRET=<random-secret-at-least-32-characters>
SEED_ADMIN_PASSWORD=<unique-admin-password-at-least-12-characters>
```

### Create a MongoDB Atlas database

1. Create a MongoDB Atlas project and free/paid cluster.
2. In **Database Access**, create a database user with a strong password. This is separate from your Atlas website login.
3. In **Network Access**, allow your development IP. For a hosted deployment, allow the host's outbound IPs; use `0.0.0.0/0` only if necessary and with a strong database password.
4. Choose **Connect → Drivers**, copy the Node.js connection string, replace the username/password placeholders, and use `it_helpdesk_system` as the database name.
5. If the password contains reserved URL characters, URL-encode them. Never commit `.env` or share connection strings, passwords, or JWT secrets.
6. Start locally with `npm run dev` from `server`. A configured MongoDB connection must succeed before the API starts accepting requests.

For local demo records only, `npm run seed` imports the demo sample dataset. Do not use that seed mode for production. To initialize a production database, set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, and `SEED_ADMIN_PASSWORD`, then run `npm run seed`; production seeding creates only the initial admin account (default email `itdirector@company.com`, configurable with `SEED_ADMIN_EMAIL`).

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

## Deployment checklist

- Deploy the Express API and React/Vite client as separate services (or configure the host to serve the built client).
- Set API environment variables in the hosting provider: `NODE_ENV=production`, `MONGODB_URI`, `CLIENT_ORIGIN` (the exact public frontend origin, or comma-separated allowed origins), and a unique `JWT_SECRET` of at least 32 characters. Set `PORT` only if required by the host.
- Set `VITE_API_URL` to the public API URL ending in `/api` before building the client.
- Restrict MongoDB Atlas network access to the deployment provider where possible, set `CLIENT_ORIGIN` for CORS, and use HTTPS.
- Run the production seed once with `SEED_ADMIN_PASSWORD` (12+ characters) set. Log in with the initial admin email and that password, then manage accounts from the admin UI.
- Public registration can only create employee accounts. Creating elevated accounts requires an authenticated admin invitation.
- Keep all secrets in local `.env` files or the deployment provider's secret settings; never commit them.
