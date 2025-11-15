# CBELight v1 - Digital Registration Platform

A modern MERN (MongoDB, Express, React, Node.js) full-stack application for managing digital registration for the College of Business Education (CBE) programs.

## Features

✨ **User Authentication**
- Secure signup and login with JWT tokens
- Password hashing with bcryptjs
- Persistent session using localStorage

📝 **Digital Registration**
- Students can submit registration forms
- Edit and update existing registrations
- Multiple department selection (Accountancy, ICT & Mathematics, Business Administration, Procurement & Logistic, Marketing)
- Real-time form validation

📊 **Interactive Dashboard**
- View registration statistics
- Pie chart visualization by department with percentages
- Real-time updates via Socket.IO (polls every 10s with socket fallback)
- Live broadcast when new registrations are submitted

👤 **User Account Management**
- View profile information
- Edit first name, last name, and email
- Account settings page
- User menu with account initial avatar

🎨 **Design**
- Tailwind CSS v3 with custom theme (blue #1e40af, white, gold #D4AF37)
- Responsive layout with navbar, sidebar, main content, footer
- Gold glow animations
- Professional styling

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Real-time**: Socket.IO
- **Testing**: Jest, Supertest, mongodb-memory-server
- **Process Manager**: Nodemon (dev)

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Real-time**: Socket.IO Client
- **Styling**: Tailwind CSS v3 + PostCSS + Autoprefixer
- **Testing**: Vitest, @testing-library/react, jsdom

## Quick Start

### Backend
```bash
cd backend
npm install
# Create .env with MONGO_URI and JWT_SECRET
npm run dev  # Development
npm start    # Production
npm test     # Run tests
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # Development on http://localhost:5173
npm run build    # Production build
npm test         # Run tests
```

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Register new user
- **POST** `/api/auth/login` - Login user

### Registrations (Auth Required)
- **POST** `/api/registrations` - Submit new registration
- **GET** `/api/registrations` - List user's registrations (admin sees all)
- **GET** `/api/registrations/:id` - Get registration by ID
- **PUT** `/api/registrations/:id` - Update registration
- **GET** `/api/registrations/stats` - Get aggregated stats by department

### User Profile (Auth Required)
- **GET** `/api/users/me` - Get current user profile
- **PUT** `/api/users/me` - Update current user profile

## Pages

| Route | Description | Protection |
|-------|-------------|-----------|
| `/` | Landing page | Public |
| `/signup` | Create account | Public |
| `/login` | Login | Public |
| `/register` | Digital registration form | Protected |
| `/register/:id` | Edit existing registration | Protected |
| `/dashboard` | Stats & visualization | Protected |
| `/account` | User profile settings | Protected |

## Real-time Updates

- Dashboard listens for Socket.IO events: `registration:created`, `registration:updated`
- Falls back to polling every 10 seconds
- Stats refresh automatically when registrations are submitted or edited

## Testing

**Backend Tests**
```bash
cd backend && npm test
```
- Jest + Supertest + mongodb-memory-server
- Tests: auth, registration CRUD, user profile, edit operations

**Frontend Tests**
```bash
cd frontend && npm test
```
- Vitest + @testing-library/react
- Tests: signup, registration, dashboard, layout, account

## Environment Variables

### Backend `.env`
```env
MONGO_URI=mongodb://localhost:27017/cbelight
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend `.env.local` (optional)
```env
VITE_API_URL=http://localhost:5000
```

## Styling

- **Theme**: Blue (#1e40af), White, Gold (#D4AF37)
- **Framework**: Tailwind CSS v3
- **Animations**: Gold glow effects
- **Responsive**: Mobile-first design

## CI/CD

GitHub Actions workflow runs tests on push/PR to `main`:
- Backend Jest tests
- Frontend Vitest tests

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/db.js
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── tests/
│   │   └── index.css
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   ├── vite.config.js
│   └── package.json
├── .github/workflows/ci.yml
└── README.md
```

## License

ISC

---

**Built with ❤️ for College of Business Education | CBELight 2025**
