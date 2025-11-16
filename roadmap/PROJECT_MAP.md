# 🎯 CBELight v1 - Complete Project Map

## 📦 Project Structure

```
CBELight-v1/
│
├── 📄 README.md (Main documentation)
├── 📄 DEPLOYMENT_GUIDE.md (Quick start & iteration strategy)
├── 📄 DEPLOYMENT_CHECKLIST.md (Pre-deployment verification)
├── 📄 PROJECT_COMPLETION.md (Completion status & summary)
├── 📄 RENDER_DEPLOYMENT.md (Backend deployment guide)
├── 📄 VERCEL_DEPLOYMENT.md (Frontend deployment guide)
│
├── 🔧 backend/
│   ├── 📄 package.json (Node dependencies)
│   ├── 📄 .env (Environment variables - KEEP SECRET)
│   ├── 📄 .env.example (Template)
│   │
│   └── src/
│       ├── 🚀 server.js (Express + Socket.IO)
│       │
│       ├── config/
│       │   └── db.js (MongoDB connection)
│       │
│       ├── models/
│       │   ├── User.js (User schema + auth)
│       │   ├── StudentRegistration.js (Registration schema)
│       │   └── index.js (Consolidated exports)
│       │
│       ├── controllers/
│       │   ├── authController.js (Signup/Login)
│       │   ├── registrationsController.js (CRUD, edit, stats)
│       │   └── usersController.js (Profile management)
│       │
│       ├── middleware/
│       │   └── auth.js (JWT verification)
│       │
│       ├── routes/
│       │   ├── authRoutes.js (POST /signup, /login)
│       │   ├── registrationRoutes.js (CRUD endpoints)
│       │   └── userRoutes.js (Profile endpoints)
│       │
│       └── tests/
│           ├── setup.js (MongoDB memory setup)
│           ├── auth.test.js (Authentication tests)
│           ├── registrations.test.js (Registration CRUD + edit)
│           └── users.test.js (Profile endpoint tests)
│
├── ⚛️ frontend/
│   ├── 📄 package.json (React dependencies)
│   ├── 📄 index.html (HTML entry point + favicon)
│   ├── 📄 vite.config.js (Vite build config)
│   ├── 📄 tailwind.config.cjs (Tailwind CSS v3)
│   ├── 📄 postcss.config.cjs (PostCSS for Tailwind)
│   ├── 📄 jsconfig.json (JS config)
│   ├── 📄 eslint.config.js (Linting)
│   ├── 📄 .env.example (Template)
│   │
│   ├── public/
│   │   └── 🎨 logo.svg (Golden bulb logo)
│   │
│   └── src/
│       ├── 🚀 main.jsx (React entry point)
│       ├── 🎯 App.jsx (Routes - 7 routes)
│       ├── 🔌 api.js (Axios instance + interceptor)
│       ├── 🎨 index.css (Global styles)
│       ├── setupTests.js (Test setup)
│       │
│       ├── components/
│       │   ├── Layout.jsx (Navbar + Sidebar + Footer + UserMenu)
│       │   └── RequireAuth.jsx (Route protection)
│       │
│       ├── pages/
│       │   ├── Home.jsx (Landing page)
│       │   ├── Signup.jsx (User registration)
│       │   ├── Login.jsx (User login)
│       │   ├── RegistrationForm.jsx (Create & edit mode)
│       │   ├── EditRegistrationGateway.jsx (Student ID search)
│       │   ├── Dashboard.jsx (Pie chart + table + Socket.IO)
│       │   └── Account.jsx (Profile management)
│       │
│       └── tests/
│           ├── Signup.test.jsx
│           ├── RegistrationForm.test.jsx
│           ├── RegistrationEdit.test.jsx
│           ├── Dashboard.test.jsx
│           ├── Layout.test.jsx
│           └── Account.test.jsx
│
└── 🔄 .github/
    └── workflows/
        └── ci.yml (GitHub Actions CI/CD)
```

---

## 🔗 Routes & Navigation

### Public Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home | Landing page |
| `/signup` | Signup | Create account |
| `/login` | Login | Login to account |

### Protected Routes (Auth Required)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/register` | RegistrationForm | Submit new registration |
| `/register/:id` | RegistrationForm | Edit existing registration |
| `/edit-registration` | EditRegistrationGateway | Find registration by Student ID |
| `/dashboard` | Dashboard | View stats & registrations |
| `/account` | Account | Profile settings |

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
```

### Registrations
```
POST /api/registrations (create)
GET /api/registrations (list user's)
GET /api/registrations/:id (get one)
PUT /api/registrations/:id (update)
GET /api/registrations/stats (aggregated stats)
```

### User Profile
```
GET /api/users/me
PUT /api/users/me
```

---

## 🧪 Testing Commands

### Backend Tests
```bash
cd backend
npm test
```
**Coverage**: Auth, Registrations (CRUD + edit), Users

### Frontend Tests
```bash
cd frontend
npm test
```
**Coverage**: Signup, Registration, Dashboard, Layout, Account

### Both
```bash
cd backend && npm test && cd ../frontend && npm test
```

---

## 🚀 Development Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Start dev server (nodemon)
npm start           # Production start
npm test            # Run tests
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start dev server (Vite)
npm run build       # Production build
npm run preview     # Preview build
npm test            # Run tests
npm run test:ui     # UI test runner
```

---

## 📊 Data Flow

### User Registration Flow
```
1. User signs up → Credentials stored in Users collection
2. JWT token generated → Stored in localStorage
3. User fills registration form → Stored in Registrations collection
4. Socket.IO emits "registration:created"
5. Dashboard listens → Updates pie chart
6. Other users see updated stats in real-time
```

### Edit Registration Flow
```
1. User enters Student ID → EditRegistrationGateway
2. Gateway searches user's registrations
3. Found → Navigate to RegistrationForm with :id
4. Form loads existing data via GET /api/registrations/:id
5. User edits → PUT /api/registrations/:id
6. Socket.IO emits "registration:updated"
7. Dashboard refreshes → Shows updated data
```

---

## 🔐 Authentication Flow

```
1. Signup
   ├── POST /api/auth/signup { firstName, lastName, email, password }
   ├── Password hashed with bcryptjs
   ├── User stored in MongoDB
   ├── JWT token generated
   └── Token + user sent to frontend

2. Frontend
   ├── Token stored in localStorage
   ├── User data stored in localStorage
   └── Token attached to all requests via interceptor

3. Backend
   ├── JWT verified by auth middleware
   ├── req.user populated with decoded token
   └── Route proceeds or returns 401

4. Logout
   ├── localStorage cleared
   ├── Token removed from interceptor
   └── Redirect to /login
```

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  passwordHash: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Registrations Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref to User),
  studentId: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  program: String,
  intakeYear: Number,
  department: String (enum),
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- email (searchable)
- studentId (searchable)
- user (queryable)
- department (groupable)

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #1e40af | Headings, buttons, links |
| White | #ffffff | Backgrounds, text |
| Gold Accent | #D4AF37 | Accents, animations |
| Light Blue | #87CEEB | Logo background |

### Components
- **Cards**: White with gold glow animation
- **Buttons**: Primary blue with hover shadow
- **Tables**: Striped rows with hover effect
- **Forms**: Clean input fields with validation
- **Navigation**: Blue navbar with user menu
- **Sidebar**: Navigation links

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^5.1.0",
  "mongoose": "^8.19.3",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "socket.io": "^4.7.2",
  "dotenv": "^17.2.3"
}
```

### Frontend
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.30.2",
  "axios": "^1.13.2",
  "recharts": "^2.15.4",
  "socket.io-client": "^4.7.2",
  "tailwindcss": "^3.4.18"
}
```

---

## 🚀 Deployment Architecture

```
Internet
   │
   ├─→ Vercel (Frontend)
   │   ├─ Static files (React SPA)
   │   ├─ CDN distributed
   │   └─ Auto-deployed from main
   │
   └─→ Render (Backend)
       ├─ Node.js server
       ├─ Express API
       ├─ Socket.IO WebSocket
       └─ Connected to MongoDB Atlas

   Database: MongoDB Atlas
   ├─ Cloud hosted
   ├─ Automatic backups
   └─ Scalable storage
```

---

## ✅ Deployment Checklist

### Before Deployment
- [x] All tests passing
- [x] No console errors
- [x] Environment variables configured
- [x] .env files in .gitignore
- [x] Logo assets present
- [x] Deployment guides written

### Deployment Steps
1. Deploy Backend (Render) - 10 min
2. Deploy Frontend (Vercel) - 10 min
3. End-to-end testing - 10 min

---

## 📈 Monitoring Post-Deploy

### Render (Backend)
- View logs in Render dashboard
- Monitor CPU/Memory usage
- Check error rates

### Vercel (Frontend)
- View analytics dashboard
- Monitor lighthouse score
- Track API integration

### MongoDB Atlas
- Monitor connection metrics
- Check storage usage
- Review backup status

---

## 🎯 Success Criteria

All of these must work end-to-end:
1. ✅ Signup/Login
2. ✅ Registration submission
3. ✅ Dashboard display
4. ✅ Registration editing
5. ✅ Real-time updates
6. ✅ Profile management
7. ✅ Account menu

---

## 📞 Quick Reference

### Important URLs
- **Frontend Dev**: http://localhost:5173
- **Backend Dev**: http://localhost:5000
- **Frontend Prod**: https://cbelight-frontend.vercel.app
- **Backend Prod**: https://cbelight-backend.onrender.com

### Important Files
- **Logo**: `frontend/public/logo.svg`
- **Theme**: `frontend/tailwind.config.cjs`
- **Routes**: `frontend/src/App.jsx`
- **API**: `backend/src/server.js`

### Important Commands
```bash
# Development
npm run dev              # Start dev server
npm test               # Run tests

# Production
npm run build          # Build for production
npm start              # Start production server

# Deployment
git push origin main   # Deploy to Render & Vercel
```

---

**Status**: ✅ READY FOR DEPLOYMENT  
**Date**: November 15, 2025  
**Next Step**: Push to GitHub & Deploy! 🚀
