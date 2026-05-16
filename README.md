# GigFlow — Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the **MERN stack + TypeScript**. Manage your sales pipeline with authentication, role-based access control, advanced filtering, debounced search, CSV export, and backend pagination.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, TailwindCSS, Zustand, React Router v6 |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Containerization | Docker + Docker Compose |

---

## Features

### Authentication
- JWT-based login / registration
- Password hashing with bcrypt (salt rounds: 12)
- Protected routes (frontend + backend middleware)
- Persistent sessions via localStorage

### Leads Management (CRUD)
- Create, read, update, delete leads
- Fields: Name, Email, Status, Source, Notes
- Status: `New` | `Contacted` | `Qualified` | `Lost`
- Source: `Website` | `Instagram` | `Referral`

### Advanced Filtering & Search
- Filter by Status, Source
- Debounced search (400ms) by Name or Email
- Sort by Latest / Oldest
- **All filters compose together**

### Pagination
- Backend pagination with `skip` / `limit`
- 10 records per page (configurable)
- Full pagination metadata in API responses

### Role-Based Access Control
| Action | Admin | Sales |
|--------|-------|-------|
| View leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Edit own leads | ✅ | ✅ |
| Edit all leads | ✅ | ❌ |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

### CSV Export
- Exports current filtered view to `.csv`
- Includes: Name, Email, Status, Source, Notes, Created At

---

## Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # authController, leadController
│   │   ├── middleware/       # auth.ts, errorHandler.ts
│   │   ├── models/          # User.ts, Lead.ts
│   │   ├── routes/          # authRoutes.ts, leadRoutes.ts
│   │   ├── types/           # Shared TypeScript types
│   │   └── index.ts         # Express app entry
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute
│   │   │   ├── layout/      # Layout, Sidebar
│   │   │   ├── leads/       # LeadsTable, LeadForm, LeadFiltersBar, Pagination, LeadDetail
│   │   │   └── ui/          # Modal, StatusBadge, States (Spinner, Empty, Error)
│   │   ├── hooks/           # useLeads, useDebounce
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage, LeadsPage
│   │   ├── services/        # api.ts (axios), authService, leadService
│   │   ├── store/           # authStore (Zustand)
│   │   ├── types/           # index.ts
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |

### Leads

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/leads` | Yes | Any | List leads (paginated + filtered) |
| GET | `/api/leads/:id` | Yes | Any | Get single lead |
| POST | `/api/leads` | Yes | Any | Create lead |
| PUT | `/api/leads/:id` | Yes | Any* | Update lead |
| DELETE | `/api/leads/:id` | Yes | Admin | Delete lead |
| GET | `/api/leads/stats` | Yes | Any | Aggregated stats |
| GET | `/api/leads/export` | Yes | Any | Export CSV |

#### GET /api/leads — Query Params

| Param | Type | Example |
|-------|------|---------|
| `page` | number | `1` |
| `limit` | number | `10` |
| `status` | string | `Qualified` |
| `source` | string | `Instagram` |
| `search` | string | `Rahul` |
| `sort` | string | `latest` or `oldest` |

#### Example Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Setup — Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally (or use Docker)

### 1. Clone & install

```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow

# Backend
cd backend
npm install
cp .env.example .env   # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Configure environment

**backend/.env**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run development servers

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

App available at: `http://localhost:5173`
API available at: `http://localhost:5000`

---

## Setup — Docker

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with your JWT_SECRET

docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

---

## Evaluation Highlights

| Criterion | Implementation |
|-----------|---------------|
| TypeScript | Strict mode, full interfaces, no `any` |
| Code quality | Controllers, services, hooks all separated |
| API design | RESTful, proper status codes, centralized errors |
| Reusability | Shared UI components, custom hooks |
| Error handling | Frontend states + backend middleware |
| Validation | express-validator (backend) + form validation (frontend) |
| Git hygiene | Atomic commits, no secrets committed |
| Scalability | MongoDB indexes, pagination, debounced search |

---

## Submission

📩 **To:** ritik.yadav@servicehive.tech  
📩 **CC:** hr.recruitment@servicehive.tech  
**Subject:** MERN Internship Assignment Submission - [Your Name]
