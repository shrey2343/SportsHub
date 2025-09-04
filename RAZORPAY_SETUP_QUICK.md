# 🚀 Quick Razorpay Setup Guide

## ⚡ Immediate Fix for Current Error

The backend is failing because Razorpay environment variables are missing. Here's how to fix it in 2 minutes:

### 1. Create Backend Environment File
```bash
cd backend
copy env.template .env
```

### 2. Edit the `.env` file and add your Razorpay keys:

**For Testing (Use these test keys):**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=abcdef1234567890abcdef1234567890
```

**For Production:**
```env
RAZORPAY_KEY_ID=rzp_live_your_live_key_here
RAZORPAY_KEY_SECRET=your_live_secret_key_here
```

### 3. Create Frontend Environment File
```bash
cd frontend
copy env.template .env
```

**Add your Razorpay key:**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
```

## 🔑 Get Razorpay Test Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login
3. Go to **Settings** → **API Keys**
4. Generate new key pair
5. Copy the **Key ID** and **Key Secret**

## ✅ Test the Setup

1. **Restart your backend server** - the error should disappear
2. **Test payment flow** in your app
3. **Use test card numbers** for testing:
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

## 🎯 What This Fixes

- ✅ Backend starts without errors
- ✅ Payment gateway integration works
- ✅ Club enrollment with payment
- ✅ AI features accessible
- ✅ Complete app functionality

## 🚨 Important Notes

- **Test Mode**: Use test keys during development
- **Live Mode**: Switch to live keys for production
- **Security**: Never commit `.env` files to git
- **Backup**: Keep your keys safe and secure

## 🆘 Still Having Issues?

1. Check that `.env` files are in the correct directories
2. Verify Razorpay keys are correct
3. Restart both backend and frontend servers
4. Check console for any remaining errors

Your payment gateway should now work perfectly! 🎉
