# Appointment Booking System

A full-stack appointment booking application for a small clinic, built with React, Node.js, Express, and PostgreSQL.

## 🚀 Live Demo

- **Frontend URL**: [Deploy to Vercel/Netlify]
- **API URL**: [Deploy to Render/Railway]
- **Test Credentials**:
  - **Patient**: `patient@example.com` / `Passw0rd!`
  - **Admin**: `admin@example.com` / `Passw0rd!`

## 🏗️ Architecture

### Tech Stack Choices & Trade-offs

**Backend**: Node.js + Express + Prisma + PostgreSQL
- **Express**: Lightweight, fast, and widely adopted for REST APIs
- **Prisma**: Type-safe database access with excellent developer experience
- **PostgreSQL**: ACID compliance, JSON support, and robust constraints for booking integrity

**Frontend**: React + Vite + Tailwind CSS
- **React**: Component-based architecture with excellent ecosystem
- **Vite**: Fast development server and optimized builds
- **Tailwind**: Utility-first CSS for rapid UI development

**Authentication**: JWT with role-based access control
- **JWT**: Stateless authentication, easy to scale
- **Role-based**: Simple but effective for patient/admin separation

### Folder Structure Rationale

```
├── backend/                 # Express API server
│   ├── src/
│   │   ├── middleware/      # Auth and validation middleware
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic layer
│   │   └── types.ts         # TypeScript definitions
│   └── prisma/              # Database schema and migrations
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React context providers
│   │   ├── services/        # API client and utilities
│   │   └── types.ts         # TypeScript definitions
└── package.json             # Monorepo configuration
```

### Auth + RBAC Approach

- **JWT tokens** stored in localStorage for persistence across page refreshes
- **Role-based middleware** protects routes based on user roles (PATIENT/ADMIN)
- **Automatic token refresh** handled by axios interceptors
- **Secure password hashing** using bcrypt with 12 rounds

### Concurrency/Atomicity for Booking

- **Database transactions** ensure atomic booking operations
- **Unique constraints** on `bookings.slot_id` prevent double booking
- **Optimistic locking** through Prisma's transaction API
- **Proper error handling** for race conditions

### Error Handling Strategy

- **Consistent error format** across all API endpoints
- **Zod validation** for request/response schemas
- **Global error middleware** for unhandled exceptions
- **Toast notifications** for user feedback
- **HTTP status codes** following REST conventions

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd appointment-booking-app
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your database URL and JWT secret
   
   # Frontend
   cp frontend/env.example frontend/.env
   # Edit frontend/.env with your API URL
   ```

3. **Set up database**:
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development servers**:
   ```bash
   # From root directory
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

### Environment Variables

**Backend (.env)**:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/appointment_booking"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Frontend (.env)**:
```env
VITE_API_URL="http://localhost:3000/api"
```

## 🚀 Deployment Steps

### Backend (Render/Railway)

1. **Create new service** on Render/Railway
2. **Connect repository** and set build command:
   ```bash
   cd backend && npm install && npm run build
   ```
3. **Set start command**:
   ```bash
   cd backend && npm start
   ```
4. **Add environment variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Secure random string
   - `FRONTEND_URL`: Your frontend deployment URL

### Frontend (Vercel/Netlify)

1. **Import repository** to Vercel/Netlify
2. **Set build settings**:
   - Build command: `cd frontend && npm run build`
   - Output directory: `frontend/dist`
3. **Add environment variable**:
   - `VITE_API_URL`: Your backend API URL

### Database (Neon/Railway)

1. **Create PostgreSQL database** on Neon or Railway
2. **Get connection string** and add to backend environment
3. **Run migrations**:
   ```bash
   cd backend && npm run db:push
   ```

## 🧪 Testing

### API Testing with curl

```bash
# 1. Register a new patient
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# 2. Login as patient
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# 3. Get available slots (use token from login)
curl -X GET "http://localhost:3000/api/slots?from=2024-01-01&to=2024-01-07" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. Book a slot
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"slotId":"SLOT_ID_HERE"}'

# 5. Get my bookings
curl -X GET http://localhost:3000/api/book/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 6. Login as admin
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Passw0rd!"}'

# 7. Get all bookings (admin only)
curl -X GET http://localhost:3000/api/book/all-bookings \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 🔒 Security Features

- **Password hashing** with bcrypt (12 rounds)
- **JWT token authentication** with expiration
- **CORS protection** with origin allowlist
- **Rate limiting** (100 requests per 15 minutes)
- **Input validation** with Zod schemas
- **SQL injection protection** via Prisma ORM
- **XSS protection** with helmet middleware
- **No secrets in code** - all via environment variables

## 📋 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/register` | ❌ | - | Register new patient |
| POST | `/api/login` | ❌ | - | Login user |
| GET | `/api/slots` | ❌ | - | Get available slots |
| POST | `/api/book` | ✅ | PATIENT | Book a slot |
| GET | `/api/book/my-bookings` | ✅ | PATIENT | Get user's bookings |
| GET | `/api/book/all-bookings` | ✅ | ADMIN | Get all bookings |

## 🎯 Known Limitations & Future Improvements

### Current Limitations
- No email notifications for bookings
- No booking cancellation functionality
- No recurring appointment support
- Basic UI without advanced filtering
- No real-time updates

### With 2 More Hours, I Would Add:
1. **Booking cancellation** with proper state management
2. **Email notifications** using a service like SendGrid
3. **Advanced slot filtering** by date range and availability
4. **Real-time updates** using WebSockets
5. **Booking confirmation emails** and reminders
6. **Admin slot management** (add/remove slots)
7. **Patient profile management**
8. **Basic analytics** for admin dashboard

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**:
   - Check `DATABASE_URL` in backend `.env`
   - Ensure PostgreSQL is running
   - Run `npm run db:push` to sync schema

2. **CORS errors**:
   - Verify `FRONTEND_URL` in backend `.env`
   - Check that frontend URL matches exactly

3. **JWT token issues**:
   - Ensure `JWT_SECRET` is set in backend `.env`
   - Clear localStorage and re-login

4. **Build failures**:
   - Run `npm run install:all` from root
   - Check Node.js version (18+ required)

## 📝 License

MIT License - feel free to use this project for learning and development. 