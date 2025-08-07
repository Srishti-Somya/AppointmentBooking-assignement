# Appointment Booking System - Local Development Guide

A complete full-stack appointment booking application built with React, Node.js, Express, and SQLite.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download here](https://git-scm.com/))

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd appointment-booking-app

# Install all dependencies (backend + frontend)
npm run install:all
```

### 2. Environment Setup
```bash
# Copy environment files
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

### 3. Database Setup
```bash
# Generate Prisma client and setup database
cd backend
npm run db:generate
npm run db:push
npm run db:seed
cd ..
```

### 4. Start Development Servers
```bash
# Start both backend and frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 📋 Detailed Setup Instructions

### Step 1: Environment Configuration

The application uses environment variables for configuration. The example files are already set up for local development:

**Backend (.env)** - Already configured for SQLite:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Frontend (.env)** - Already configured:
```env
VITE_API_URL="http://localhost:3000/api"
```

### Step 2: Database Initialization

The application uses SQLite for local development (no external database needed):

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed initial data (admin user, test patient, slots)
npm run db:seed
```

This will create:
- ✅ Admin user: `admin@example.com` / `Passw0rd!`
- ✅ Test patient: `patient@example.com` / `Passw0rd!`
- ✅ 7 days of appointment slots (9:00 AM - 5:00 PM, 30-minute intervals)

### Step 3: Start Development Servers

#### Option A: Start Both Servers (Recommended)
```bash
# From project root
npm run dev
```

This starts:
- Backend on http://localhost:3000
- Frontend on http://localhost:5173

#### Option B: Start Servers Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Verify Installation

#### Check Backend Health
```bash
curl http://localhost:3000/health
```
Expected response:
```json
{"status":"OK","timestamp":"2025-08-07T...","uptime":...}
```

#### Check Frontend
Open http://localhost:5173 in your browser. You should see the login page.

## 🧪 Testing the Application

### Test Credentials

#### Admin Account
- **Email**: `admin@example.com`
- **Password**: `Passw0rd!`
- **Access**: Admin dashboard with all bookings

#### Patient Account
- **Email**: `patient@example.com`
- **Password**: `Passw0rd!`
- **Access**: Patient dashboard with slot booking

### Manual Testing Flow

1. **Register a new patient**:
   - Go to http://localhost:5173/register
   - Create account with your details

2. **Login as patient**:
   - Use your new account or `patient@example.com`
   - View available slots for next 7 days
   - Book an appointment slot

3. **Login as admin**:
   - Use `admin@example.com` / `Passw0rd!`
   - View all bookings across all patients

### API Testing

Run the automated test script:
```bash
# Make script executable
chmod +x test-api.sh

# Run tests
./test-api.sh
```

Or test manually with curl:
```bash
# Test registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test slots (use token from login)
curl -X GET "http://localhost:3000/api/slots?from=2025-08-07&to=2025-08-14" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛠️ Development Commands

### Backend Commands
```bash
cd backend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed initial data
npm run db:studio      # Open Prisma Studio (database GUI)
```

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Root Commands
```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev

# Build both for production
npm run build
```

## 📁 Project Structure

```
appointment-booking-app/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── middleware/      # Auth and validation
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── types.ts         # TypeScript definitions
│   ├── prisma/              # Database schema
│   └── dev.db              # SQLite database (created automatically)
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── contexts/        # React context providers
│   │   ├── services/        # API client
│   │   └── types.ts         # TypeScript definitions
│   └── dist/               # Build output (created automatically)
├── README.md               # Main documentation
├── README_LOCAL.md         # This file
├── DEPLOYMENT.md           # Production deployment guide
└── test-api.sh            # API testing script
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill processes on ports 3000 and 5173
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

#### Database Issues
```bash
cd backend

# Reset database
rm dev.db
npm run db:push
npm run db:seed
```

#### Dependencies Issues
```bash
# Clean install
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm run install:all
```

#### TypeScript Errors
```bash
cd backend
npm run build  # Check for compilation errors
```

### Error Messages

#### "EADDRINUSE: address already in use :::3000"
- Another process is using port 3000
- Solution: Kill the process or use a different port

#### "Database connection failed"
- Check if `.env` file exists in backend/
- Verify `DATABASE_URL` is set correctly

#### "CORS errors"
- Ensure frontend is running on http://localhost:5173
- Check `FRONTEND_URL` in backend `.env`

#### "JWT token issues"
- Clear browser localStorage
- Re-login to get a new token

## 🎯 Features to Test

### Patient Features
- ✅ Register new account
- ✅ Login with credentials
- ✅ View available slots (next 7 days)
- ✅ Book appointment slots
- ✅ View booking history
- ✅ Cannot book already booked slots

### Admin Features
- ✅ Login with admin credentials
- ✅ View all bookings across patients
- ✅ See patient details and booking times
- ✅ Access restricted to admin role

### System Features
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Database persistence
- ✅ Error handling and validation
- ✅ Security measures

## 📊 Performance

- **Backend**: Express.js with TypeScript
- **Frontend**: React 18 with Vite
- **Database**: SQLite (local) / PostgreSQL (production)
- **Authentication**: JWT with bcrypt
- **Styling**: Tailwind CSS

## 🚀 Next Steps

After successful local setup:

1. **Explore the codebase** - Check the architecture and implementation
2. **Test all features** - Try booking slots, admin access, etc.
3. **Modify and extend** - Add new features or customize existing ones
4. **Deploy to production** - Follow the DEPLOYMENT.md guide

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly
4. Check the console for error messages
5. Review the TEST_RESULTS.md for expected behavior

## 🎉 Success!

Once you see:
- Backend running on port 3000
- Frontend running on port 5173
- Login page accessible in browser
- API endpoints responding

You've successfully set up the appointment booking system locally! 🚀 