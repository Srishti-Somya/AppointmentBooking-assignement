# Deployment Guide

This guide will help you deploy the Appointment Booking System to production.

## 🚀 Quick Deployment Overview

1. **Database**: Set up PostgreSQL on Neon/Railway
2. **Backend**: Deploy to Render/Railway
3. **Frontend**: Deploy to Vercel/Netlify
4. **Environment**: Configure environment variables

## 📊 Database Setup (Neon/Railway)

### Option 1: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string from the dashboard
4. The connection string looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname`

### Option 2: Railway

1. Go to [railway.app](https://railway.app) and create an account
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string from the database settings

## 🔧 Backend Deployment (Render)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure the service:

**Build Command:**
```bash
cd backend && npm install && npm run build
```

**Start Command:**
```bash
cd backend && npm start
```

**Environment Variables:**
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Step 3: Deploy

1. Click "Create Web Service"
2. Wait for the build to complete
3. Copy the generated URL (e.g., `https://your-app.onrender.com`)

## 🎨 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### Step 2: Import Project

1. Click "New Project"
2. Import your repository
3. Configure the project:

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

**Environment Variables:**
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Copy the generated URL (e.g., `https://your-app.vercel.app`)

## 🔄 Alternative: Railway Deployment

### Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a service from GitHub
4. Configure environment variables
5. Deploy

### Frontend on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Import your repository
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variables
6. Deploy

## 🔐 Environment Variables Checklist

### Backend (.env)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Secure random string (32+ characters)
- [ ] `FRONTEND_URL` - Your frontend deployment URL
- [ ] `NODE_ENV` - Set to "production"

### Frontend (.env)
- [ ] `VITE_API_URL` - Your backend API URL

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend-url.onrender.com/health
```

### 2. Test API Endpoints
```bash
# Test registration
curl -X POST https://your-backend-url.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST https://your-backend-url.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Frontend
1. Visit your frontend URL
2. Try registering a new user
3. Test the booking flow
4. Verify admin access

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that the URL matches exactly (including https://)

2. **Database Connection Failed**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from your deployment region

3. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check build logs for specific errors

4. **Environment Variables Not Working**
   - Ensure variables are set in the deployment platform
   - Restart the service after adding variables
   - Check variable names match exactly

### Debug Commands

```bash
# Check backend logs
# Render: View logs in dashboard
# Railway: railway logs

# Check frontend build
# Vercel: View build logs in dashboard
# Netlify: Check deploy logs
```

## 📈 Monitoring & Maintenance

### Health Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Set up error alerting

### Database Maintenance
- Regular backups (Neon/Railway handle this automatically)
- Monitor connection limits
- Check for slow queries

### Security
- Rotate JWT secrets periodically
- Monitor for suspicious activity
- Keep dependencies updated

## 🎯 Performance Optimization

### Backend
- Enable compression middleware
- Implement caching for slots
- Use connection pooling

### Frontend
- Enable gzip compression
- Optimize bundle size
- Implement lazy loading

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment platform documentation
3. Check application logs
4. Verify environment variables

## 🚀 Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and alerting
4. Plan for scaling as needed 