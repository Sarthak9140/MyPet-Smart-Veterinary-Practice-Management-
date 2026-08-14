# MyPet — Smart Veterinary Practice Management

> **Manage Pets. Track Vaccinations. Never Miss a Reminder.**

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v22-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Framework-Express.js-lightgrey)](https://expressjs.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-teal)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)](https://www.mongodb.com)

**MyPet** is a production-quality full-stack veterinary practice management platform designed for pet doctors to organize patient records, track vaccination schedules, manage veterinary product inventory, and receive automated vaccination reminders.

---

## 🏗️ Architecture (Single Vercel Project & Domain)

```text
                        GitHub Repository (MYPET)
                                   │
                                   ▼
                   ONE VERCEL PROJECT (https://mypet.vercel.app)
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
  Frontend (React + Vite SPA)                  Backend (Express API)
  Serves: /, /dashboard, /pets,               Serves: /api/* endpoints &
          /vaccinations, /products                    Vercel Cron (/api/cron/*)
             │                                           │
             └─────────── Communicates via /api ─────────┘
                                                         │
                                                         ▼
                                                  MongoDB Atlas
```

- **Frontend Domain**: Single Vercel domain (e.g. `https://mypet.vercel.app`)
- **API Routing**: All frontend API calls go through relative `/api` path (e.g., `axios.get("/api/pets")`), eliminating CORS issues and cross-domain dependencies.
- **Client-Side SPA Routing**: Vite SPA rules in `vercel.json` ensure refreshing routes like `/dashboard` or `/pets` never throw 404 errors.
- **Automated Vercel Cron**: Daily vaccination reminder checks are triggered via Vercel Cron (`/api/cron/reminders`).

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Locally
- **Start Backend API** (Port 5000):
  ```bash
  cd backend
  npm start
  ```
  *(Note: Locally, if `MONGO_URI` is not set, the backend automatically uses an in-memory database pre-seeded with demo data!)*

- **Start Frontend App** (Port 3000):
  ```bash
  cd frontend
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Environment Variables (.env)

| Variable | Description | Required in Production (Vercel) |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas Connection String (`mongodb+srv://...`) | **Yes** |
| `JWT_SECRET` | Secret key for signing JWT doctor auth tokens | **Yes** |
| `VITE_API_URL` | Frontend API base path (defaults to `/api`) | Optional (Default: `/api`) |

*See [.env.example](file:///.env.example) for placeholder values.*

---

## 🌐 Deploying the ENTIRE App to Vercel (One Click)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare MyPet for single-project Vercel deployment"
git push origin main
```

### 2. Import into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository (`MYPET`).
4. Keep the **Root Directory** as `./` (do NOT select subfolders).

### 3. Add Environment Variables in Vercel
Under **Environment Variables**, add:
- `MONGO_URI` = `mongodb+srv://<username>:<password>@cluster0.mongodb.net/mypet?retryWrites=true&w=majority`
- `JWT_SECRET` = `your_random_secret_key_here`

### 4. Deploy!
Click **Deploy**. Vercel will build the React Vite application and serve all backend Express API endpoints under your single public Vercel domain!

---

## 📡 Key REST API Endpoints

- `GET /api/health` — API health check (`{"status": "online", "app": "MyPet Backend API"}`)
- `POST /api/auth/login` — Doctor authentication
- `POST /api/auth/register` — Practice registration
- `GET /api/pets` — Get patient pets
- `GET /api/vaccinations` — Vaccination schedules & statuses (`Overdue`, `Due Today`, `Due Soon`, `Upcoming`)
- `GET /api/products` — Inventory products with stock level badges (`In Stock`, `Low Stock`, `Out of Stock`)
- `GET /api/cron/reminders` — Automated vaccination reminder scan endpoint (Vercel Cron)

---

## 🔐 Default Demo Credentials (Local Dev)
- **Email**: `dr.smith@mypet.com`
- **Password**: `Doctor123!`
