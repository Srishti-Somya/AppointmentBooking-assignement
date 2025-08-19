# Appointment Booking System

A full-stack appointment booking application for a small clinic, built with React, Node.js, Express, and PostgreSQL.

## 🚀 Live Demo

- **Frontend**: https://appointment-booking-assignement-fro.vercel.app
- **Backend API**: https://appointmentbooking-backend-q31e.onrender.com/api
- **Test Credentials**:
  - **Patient**: Any email with password `password123`
  - **Admin**: `admin@example.com` / `Passw0rd!`

## 🏗️ Tech Stack Choices & Trade-offs

### Backend: Node.js + Express + Prisma + PostgreSQL
- **Express**: Lightweight and fast, with excellent middleware ecosystem for rapid API development. Trade-off: Less opinionated than frameworks like NestJS, requiring more setup for enterprise features.
- **Prisma**: Type-safe database access with excellent developer experience and automatic migrations. Trade-off: Adds abstraction layer that can limit complex queries compared to raw SQL.
- **PostgreSQL**: ACID compliance and robust constraints perfect for booking integrity. Trade-off: More resource-intensive than SQLite for small applications.

### Frontend: React + Vite + Tailwind CSS
- **React**: Component-based architecture with excellent ecosystem and TypeScript support. Trade-off: Requires additional libraries for routing and state management unlike full frameworks.
- **Vite**: Extremely fast development server and optimized production builds. Trade-off: Newer ecosystem compared to webpack, potential compatibility issues with older packages.
- **Tailwind CSS**: Utility-first approach enables rapid UI development and consistent design. Trade-off: Can lead to verbose HTML and requires learning utility classes.

### Authentication: JWT + Role-based Access Control
- **JWT**: Stateless authentication that's easy to scale across multiple services. Trade-off: Difficult to revoke tokens before expiration, unlike session-based auth.

## 🛠️ How to Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud)

### Commands (one per service)

1. **Install dependencies**:
   ```bash
   npm install && cd backend && npm install && cd ../frontend && npm install
   ```

2. **Setup environment variables** (see section below)

3. **Backend** (from project root):
   ```bash
   cd backend && npm run db:push && npm run dev
   ```

4. **Frontend** (from project root, in new terminal):
   ```bash
   cd frontend && npm run dev
   ```

5. **Access application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api
   - Health check: http://localhost:3000/health

## 🔧 Environment Variables Required

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/appointment_booking"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
PORT=3000
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL="http://localhost:3000/api"
```

### Getting Database URL
- **Local PostgreSQL**: `postgresql://username:password@localhost:5432/database_name`
- **Neon (Cloud)**: Sign up at neon.tech and copy connection string
- **Railway**: Create PostgreSQL service and copy connection string

## 🚀 Deployment Steps Taken

### 1. Database Setup (Neon)
```bash
# Created PostgreSQL database on neon.tech
# Got connection string: postgresql://user:pass@ep-xxx.aws.neon.tech/dbname
```

### 2. Backend Deployment (Render)
```bash
# Commands used in Render dashboard:
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start

# Environment variables set:
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/dbname
JWT_SECRET=super-secret-production-key-32-chars-min
FRONTEND_URL=https://appointment-booking-assignement-fro.vercel.app
NODE_ENV=production
```

**Key Fix Applied**: Updated build script to run `prisma migrate deploy` to create database tables:
```json
"build": "prisma migrate deploy && prisma generate && tsc"
```

### 3. Frontend Deployment (Vercel)
```bash
# Vercel auto-detected build settings:
Framework: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: frontend

# Environment variable set:
VITE_API_URL=https://appointmentbooking-backend-q31e.onrender.com/api
```

**Key Fix Applied**: Added `vercel.json` for SPA routing:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 4. Issues Encountered & Solutions

1. **Database Tables Missing**: Fixed by adding proper Prisma migrations
2. **TypeScript Build Errors**: Fixed by adding Vite type definitions  
3. **404 on Direct Routes**: Fixed with vercel.json SPA configuration
4. **CORS Issues**: Fixed by updating FRONTEND_URL and supporting multiple origins

**CORS Fix**: Updated backend to accept both local and production URLs:
```typescript
const allowedOrigins = [
  config.server.frontendUrl,
  'http://localhost:5173',
  'https://appointment-booking-assignement-fro.vercel.app'
];
```

### 5. Verification Commands Used
```bash
# Test backend health
curl https://appointmentbooking-backend-q31e.onrender.com/health

# Test registration
curl -X POST https://appointmentbooking-backend-q31e.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Test frontend routes
# Manually verified: /login, /register, /dashboard, /admin all work
```

## 🎯 Known Limitations & What I'd Do With 2 More Hours

### Current Limitations
1. **No booking cancellation** - patients cannot cancel appointments
2. **No email notifications** - no confirmation or reminder emails
3. **Basic error handling** - some edge cases not covered
4. **No slot management UI** - admin cannot add/modify time slots
5. **No real-time updates** - bookings don't update live

### With 2 More Hours, I Would Add:

1. **Email Notifications (45 minutes)**
   - Integrate SendGrid or Resend for booking confirmations
   - Send reminder emails 24 hours before appointment
   ```bash
   npm install @sendgrid/mail
   # Add email templates and notification service
   ```

2. **Booking Cancellation (30 minutes)**
   - Add cancel button to patient dashboard
   - API endpoint for cancellation with 24-hour minimum notice
   - Update database schema with cancellation status

3. **Admin Slot Management (30 minutes)**
   - Admin UI to create/delete time slots
   - Bulk slot generation for multiple days
   - Validation to prevent deletion of booked slots

4. **Enhanced Error Handling (15 minutes)**
   - Better loading states and error boundaries
   - Retry logic for failed API calls
   - More specific error messages for users

### Future Enhancements
- Real-time updates with WebSockets
- Patient profile management
- Recurring appointment support
- SMS notifications
- Advanced analytics dashboard
- Multi-clinic support

## 📋 Quick Test Guide

1. **Register new patient**: Visit /register
2. **Login as admin**: Use `admin@example.com` / `Passw0rd!`
3. **Book appointment**: Login as patient, select available slot
4. **View bookings**: Check dashboard for confirmed appointments

---

Built with ❤️ using modern web technologies. See individual service READMEs for detailed documentation. 