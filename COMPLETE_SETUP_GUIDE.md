# 🚀 SportsApp Complete Setup Guide

## ✅ **All Issues Fixed!**

This guide will help you set up the complete SportsApp with all features working.

## 📋 **Prerequisites**

- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)
- Git

## 🔧 **Backend Setup**

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Environment Configuration**
Create `backend/.env` file:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sportsapp
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_here

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### 3. **Start Backend Server**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: 127.0.0.1
✅ Server running on port 5000
```

## 🎨 **Frontend Setup**

### 1. **Install Dependencies**
```bash
cd frontend
npm install
```

### 2. **Environment Configuration**
Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_APP_NAME=SportsApp
VITE_APP_VERSION=1.0.0
```

### 3. **Start Frontend Server**
```bash
npm run dev
```

You should see:
```
VITE v7.1.2 ready in XXX ms
Local: http://localhost:5173/
```

## 🔐 **Google OAuth Setup**

### 1. **Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### 2. **Authorized Origins**
Add these to your Google OAuth credentials:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

### 3. **Authorized Redirect URIs**
Add:
- `http://localhost:5173/login`
- `http://localhost:3000/login`

## 💳 **Razorpay Setup**

### 1. **Razorpay Account**
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your test API keys
3. Add keys to both backend and frontend `.env` files

## 🎯 **Features Working**

### ✅ **Authentication**
- User registration and login
- Google OAuth integration
- Password reset functionality
- Role-based access control

### ✅ **Dashboard Features**
- Admin Dashboard with user management
- Coach Dashboard with team management
- Player Dashboard with club enrollment
- Real-time statistics

### ✅ **AI Integration**
- Performance analysis
- Training recommendations
- Match predictions
- Personalized insights

### ✅ **Payment System**
- Razorpay integration
- Club enrollment payments
- Payment history tracking
- Secure payment verification

### ✅ **Advanced Features**
- Match management
- Tournament organization
- Achievement system
- Performance analytics
- Real-time notifications

## 🎨 **Design Features**

### ✅ **Consistent Design**
- Dark theme across all pages
- Animated sports icons
- Glassmorphism effects
- Responsive design
- Framer Motion animations

### ✅ **UI Components**
- Modern card designs
- Gradient buttons
- Animated backgrounds
- Interactive elements
- Loading states

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google-login` - Google OAuth
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### **Admin Routes**
- `GET /api/admin/players` - List all players
- `GET /api/admin/coaches` - List all coaches
- `GET /api/admin/clubs` - List all clubs
- `PUT /api/admin/:userType/:userId/status` - Toggle user status

### **Performance Routes**
- `GET /api/performance/player/me` - Get user performance
- `GET /api/performance/player/me/trends` - Get performance trends
- `GET /api/performance/player/me/insights` - Get AI insights

### **Payment Routes**
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

## 🚀 **Testing**

### 1. **Backend Health Check**
```bash
curl http://localhost:5000/
# Should return: "Sports App Backend Running 🚀"
```

### 2. **API Test**
```bash
curl http://localhost:5000/api/auth/login
# Should return a response (even if error about missing data)
```

### 3. **Frontend Test**
Visit: `http://localhost:5173`
- Should show the landing page
- Login should work
- All features should be accessible

## 🎉 **Success Indicators**

### ✅ **Backend**
- Server starts without errors
- MongoDB connects successfully
- All routes respond correctly
- Environment variables load

### ✅ **Frontend**
- No console errors
- Login works
- Navigation works
- All components render
- API calls succeed

### ✅ **Features**
- User registration/login
- Dashboard access
- AI features work
- Payment system functions
- Design consistency

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Backend won't start**
   - Check MongoDB is running
   - Verify `.env` file exists
   - Check all dependencies installed

2. **Frontend API errors**
   - Verify backend is running
   - Check `VITE_API_URL` in `.env`
   - Restart frontend after `.env` changes

3. **Google OAuth errors**
   - Check authorized origins in Google Console
   - Verify `VITE_GOOGLE_CLIENT_ID` is correct
   - Restart both servers

4. **Payment errors**
   - Verify Razorpay keys in both `.env` files
   - Check backend payment routes
   - Test with Razorpay test mode

## 🎯 **Next Steps**

1. **Test all features** thoroughly
2. **Create test users** for each role
3. **Test payment flow** with test cards
4. **Verify AI features** work correctly
5. **Check design consistency** across all pages

## 🏆 **All Issues Resolved**

- ✅ API base URL fixed
- ✅ Tailwind CSS warning resolved
- ✅ Google OAuth origin issue fixed
- ✅ Design consistency achieved
- ✅ All backend routes implemented
- ✅ Payment system integrated
- ✅ AI features working
- ✅ Environment variables configured
- ✅ Error handling improved
- ✅ Component imports fixed

**Your SportsApp is now fully functional!** 🚀
