# DashPro — Full Stack Dashboard Application

A production-ready full-stack dashboard built with **React + Vite** (frontend) and **Python Flask** (backend), connected to **MongoDB Atlas**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios |
| Styling | Vanilla CSS (design system) |
| Backend | Python Flask, Flask-CORS |
| Database | MongoDB Atlas (PyMongo) |
| Auth | JWT (PyJWT) + bcrypt |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
sample_task/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Navbar, Footer, Sidebar, StatCard, ProtectedRoute
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── pages/          # All 6 pages
│   │   └── styles/         # Global CSS design system
│   └── .env
└── backend/                # Flask REST API
    ├── routes/             # auth.py, user.py
    ├── middleware/         # JWT decorator
    ├── app.py
    └── .env
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dashboard_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=5000
```

```bash
python app.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | No | Register new user |
| POST | `/api/login` | No | Login, returns JWT |
| GET | `/api/profile` | ✅ JWT | Get current user profile |
| PUT | `/api/profile` | ✅ JWT | Update username/email |
| GET | `/api/health` | No | Health check |

---

## Pages

| Route | Page | Protected |
|-------|------|-----------|
| `/` | Home | No |
| `/register` | Register | Guest only |
| `/login` | Login | Guest only |
| `/dashboard` | Dashboard | ✅ Yes |
| `/profile` | Profile | ✅ Yes |
| `*` | 404 Not Found | No |

---

## Deployment

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for Render)
3. Copy the connection string into `backend/.env`

### Backend → Render
1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT=10000`
5. Copy the Render URL (e.g. `https://dashpro-api.onrender.com`)

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Set environment variable:
   ```
   VITE_API_URL=https://dashpro-api.onrender.com/api
   ```
4. Deploy — done!

---

## Features

- ✅ JWT Authentication (register, login, auto-login)
- ✅ bcrypt password hashing
- ✅ Protected & guest-only routes
- ✅ Duplicate email prevention
- ✅ Form validation (client + server)
- ✅ Show/Hide password toggle
- ✅ Remember Me checkbox
- ✅ Profile view + edit
- ✅ Responsive sidebar dashboard
- ✅ Toast notifications
- ✅ 404 Not Found page
- ✅ Glassmorphism UI design
- ✅ Smooth animations

---

## License

MIT © 2024 DashPro
