# MyPet — Smart Veterinary Practice Management

> **Manage Pets. Track Vaccinations. Never Miss a Reminder.**

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v22-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Framework-Express.js-lightgrey)](https://expressjs.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-teal)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20MongoMemoryServer-green)](https://www.mongodb.com)

**MyPet** is a production-quality full-stack veterinary practice management platform designed for pet doctors to organize patient records, track vaccination schedules, manage veterinary product inventory, and receive automated vaccination reminders.

---

## 📋 The Real-World Problem Solved

Veterinary practices treat dozens of pets weekly. A doctor administers a vaccine today, but must track:
- **Which pet** received the vaccine?
- **Which vaccine** was given and what batch number?
- **On what date** was it administered?
- **When is the next booster date** due?
- **Which pets** are due today, due soon, or overdue?

Manual paper notebooks or spreadsheets frequently lead to missed vaccination dates. **MyPet** digitizes all pet records, automatically computes vaccination statuses (`Overdue`, `Due Today`, `Due Soon`, `Upcoming`), and runs a background scheduler to send deduplicated alerts to the doctor's dashboard.

---

## ✨ Core Features

1. **Patient & Owner Records**: Full pet medical profiles, breeds, age, weight, medical notes, and owner contact details.
2. **Vaccination Management**: Record vaccines, doses, batch numbers, administered dates, and next scheduled booster dates.
3. **Smart Dynamic Status Logic**:
   - `Overdue`: `nextVaccinationDate < today`
   - `Due Today`: `nextVaccinationDate == today`
   - `Due Soon`: Next 1–2 days
   - `Upcoming`: More than 2 days away
4. **Automated Background Reminders**: Node-cron background service checks upcoming & overdue vaccinations daily and creates deduplicated alerts in MongoDB.
5. **Product & Inventory Control**: Track vaccines, medicines, supplies, unit prices, low stock thresholds, and expiration date warnings.
6. **Practice Analytics Dashboard**: Interactive Recharts graphs (Species distribution & Inventory breakdown) and dynamic stat cards.
7. **Search, Filter & Sort**: Global instant search across pet names, owner phones, vaccine names, plus multi-criteria filters and sorting (A-Z, dates, status).
8. **Multi-Tenancy Security**: Strict doctor data isolation using JWT authentication and password hashing.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios, React Router v6
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, node-cron
- **Database**: MongoDB & Mongoose (with automatic fallback to `mongodb-memory-server` for zero-configuration local runs)

---

## 📁 Project Architecture

```text
MyPet/
├── backend/
│   ├── config/          # Database connector (MongoDB + MongoMemoryServer fallback)
│   ├── controllers/     # Auth, Pet, Owner, Vaccination, Product, Notification, Dashboard
│   ├── jobs/            # Node-cron automated vaccination reminder scheduler
│   ├── middleware/      # JWT route protection & centralized error handler
│   ├── models/          # User, Owner, Pet, Vaccination, Product, Notification schemas
│   ├── routes/          # REST API route handlers
│   ├── utils/           # Demo dataset seeder script
│   ├── server.js        # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Sidebar, StatCard, LoadingSkeleton, EmptyState, ConfirmModal
│   │   ├── context/     # AuthContext (JWT session) & ToastContext (global alerts)
│   │   ├── layouts/     # DashboardLayout wrapper
│   │   ├── pages/       # LandingPage, LoginPage, RegisterPage, Dashboard, PetsPage, PetDetailPage,
│   │   │                # VaccinationsPage, ProductsPage, NotificationsPage, ProfilePage, SettingsPage, AboutPage
│   │   ├── services/    # Axios API client with auth interceptor
│   │   ├── App.jsx      # Router & Protected route configuration
│   │   └── main.jsx     # App entry point
│   └── package.json
└── README.md
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+) & npm

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Note: The backend automatically detects if a local MongoDB service is running. If not, it seamlessly starts an in-memory MongoDB instance and pre-seeds realistic veterinary practice demo data!*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

### Option 1: Monorepo Deployment (Recommended)
1. Push your repository to GitHub.
2. Import the root repository in Vercel.
3. In Vercel Project Settings -> **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/mypet?retryWrites=true&w=majority` (MongoDB Atlas URI)
   - `JWT_SECRET`: `your_secure_jwt_secret_key`
4. Vercel will automatically detect `vercel.json`, deploy the React frontend static build, and route `/api/*` to the Express Serverless Function.

### Option 2: Separate Deployments
- **Backend Deployment**: Set Root Directory to `backend`. Add `MONGO_URI` and `JWT_SECRET` in environment variables.
- **Frontend Deployment**: Set Root Directory to `frontend`. Add `VITE_API_BASE_URL` pointing to your backend URL (e.g. `https://mypet-backend.vercel.app/api`).


### Auth
- `POST /api/auth/register` — Register new practice
- `POST /api/auth/login` — Doctor authentication
- `GET /api/auth/me` — Current doctor profile
- `PUT /api/auth/profile` — Update clinic info
- `PUT /api/auth/password` — Change password

### Pets & Owners
- `GET /api/pets` — Get doctor's pets (supports `?search=` and `?petType=`)
- `GET /api/pets/:id` — Get pet profile & vaccination history
- `POST /api/pets` — Register new pet & owner
- `PUT /api/pets/:id` — Update pet
- `DELETE /api/pets/:id` — Delete pet & associated records

### Vaccinations
- `GET /api/vaccinations` — List vaccinations (supports `?search=`, `?status=`, `?sort=`)
- `POST /api/vaccinations` — Add vaccination record
- `PUT /api/vaccinations/:id` — Update record
- `DELETE /api/vaccinations/:id` — Delete record

### Products & Inventory
- `GET /api/products` — List inventory products
- `POST /api/products` — Add inventory product
- `PATCH /api/products/:id/stock` — Adjust stock quantity (+/-)
- `DELETE /api/products/:id` — Delete product

### Notifications & Dashboard
- `GET /api/notifications` — Fetch doctor notifications & unread count
- `PATCH /api/notifications/read-all` — Mark all read
- `GET /api/dashboard/stats` — Aggregate stats, lists, and chart analytics
