# Environment Setup Guide

## Quick Fix for Current Issues

### 1. Create Frontend Environment File

Create `frontend/.env` with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth Configuration (Optional - leave as placeholder if not using Google OAuth)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Razorpay Configuration (Optional)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# App Configuration
VITE_APP_NAME=SportsApp
VITE_APP_VERSION=1.0.0
```

### 2. Create Backend Environment File

Create `backend/.env` with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sportsapp
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Start the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 4. Test Registration

The registration should now work properly. The Google OAuth button will show "Google OAuth not configured" until you set up proper Google credentials.

## Google OAuth Setup (Optional)

If you want to enable Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google Identity API
4. Go to "APIs & Services" > "Credentials"
5. Create OAuth 2.0 Client ID
6. Add authorized origins: `http://localhost:5173`
7. Copy the Client ID to your `.env` files

## Current Status

✅ **Fixed Issues:**
- Favicon 404 error
- Registration API 400 errors
- CORS policy issues
- Google OAuth origin errors (now shows proper fallback)

✅ **Working Features:**
- User registration with email/password
- User login
- Role-based authentication
- Proper error handling

⚠️ **Pending Configuration:**
- Google OAuth (optional)
- Database connection (make sure MongoDB is running)
- JWT secret (use a strong random string)
