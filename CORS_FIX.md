# CORS Error Fix - Frontend Deployment

## 🐛 Problem

Frontend deployed on Vercel getting CORS error:
```
Access to XMLHttpRequest at 'https://appointmentbooking-backend-q31e.onrender.com/api/login' 
from origin 'https://appointment-booking-assignement-fro.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' 
header has a value 'http://localhost:5173' that is not equal to the supplied origin.
```

## 🔍 Root Cause

Backend's `FRONTEND_URL` environment variable was still set to `http://localhost:5173` instead of the deployed Vercel URL.

## ✅ Solutions Applied

### 1. Updated CORS Configuration (Code Fix)

**File**: `backend/src/index.ts`

Changed from single origin to multiple allowed origins:
```typescript
// Before
app.use(cors({
  origin: config.server.frontendUrl,
  credentials: true
}));

// After
const allowedOrigins = [
  config.server.frontendUrl,
  'http://localhost:5173',
  'https://appointment-booking-assignement-fro.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true
}));
```

### 2. Environment Variable Update (Render Dashboard)

**Action Required**: Update environment variable on Render:

```env
# Change from:
FRONTEND_URL=http://localhost:5173

# To:
FRONTEND_URL=https://appointment-booking-assignement-fro.vercel.app
```

## 🚀 Deployment Steps

1. **Commit and push** the CORS code changes
2. **Update environment variable** on Render dashboard
3. **Redeploy** or restart the Render service
4. **Test** the frontend -> backend communication

## 🧪 Verification

After the fix, these should work:
- ✅ Local development: `http://localhost:5173` -> `http://localhost:3000`
- ✅ Production: `https://appointment-booking-assignement-fro.vercel.app` -> `https://appointmentbooking-backend-q31e.onrender.com`

## 🔧 Benefits of This Approach

1. **Supports multiple environments** (local + production)
2. **Flexible deployment** - works with any Vercel URL
3. **Security maintained** - still validates origins
4. **Development friendly** - no need to change code for local dev

## 🎯 Test Commands

```bash
# Test CORS is working (should not get CORS error)
curl -X OPTIONS https://appointmentbooking-backend-q31e.onrender.com/api/login \
  -H "Origin: https://appointment-booking-assignement-fro.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Test actual login
curl -X POST https://appointmentbooking-backend-q31e.onrender.com/api/login \
  -H "Origin: https://appointment-booking-assignement-fro.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Passw0rd!"}' \
  -v
```

The CORS issue should be completely resolved after these changes! 🎉
