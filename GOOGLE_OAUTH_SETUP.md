# Google OAuth Setup Guide

This guide will help you set up Google OAuth for your SportsApp.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "SportsApp"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain (when deployed)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain (when deployed)
6. Copy the Client ID

## Step 4: Configure Frontend

1. Create a `.env` file in the `frontend` directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:5000/api
```

2. Update the GoogleLogin component:
   - Open `frontend/src/components/GoogleLogin.jsx`
   - Replace `"YOUR_GOOGLE_CLIENT_ID"` with your actual client ID or use:
   ```javascript
   client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
   ```

## Step 5: Configure Backend (Optional)

If you want to add additional security, you can verify the Google token on the backend:

1. Install the Google Auth Library:
```bash
cd backend
npm install google-auth-library
```

2. Add environment variables to your backend `.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

3. Update the auth controller to verify tokens (optional enhancement)

## Step 6: Test the Integration

1. Start your backend server:
```bash
cd backend
npm run dev
```

2. Start your frontend server:
```bash
cd frontend
npm run dev
```

3. Navigate to the login or register page
4. Click the "Continue with Google" button
5. Complete the Google OAuth flow

## Troubleshooting

### Common Issues:

1. **"Invalid Client ID" error**
   - Make sure your Client ID is correct
   - Check that your domain is in the authorized origins

2. **"Redirect URI mismatch" error**
   - Add your development URL to authorized redirect URIs
   - Make sure the protocol (http/https) matches

3. **"OAuth consent screen not configured" error**
   - Complete the OAuth consent screen setup
   - Add your email as a test user

4. **"API not enabled" error**
   - Enable Google+ API and Google Identity API in Google Cloud Console

### Security Notes:

- Never commit your Client ID to version control
- Use environment variables for sensitive data
- In production, use HTTPS
- Regularly rotate your OAuth credentials

## Production Deployment

When deploying to production:

1. Update the OAuth consent screen with your production domain
2. Add your production domain to authorized origins and redirect URIs
3. Update environment variables with production values
4. Ensure your backend is accessible via HTTPS

## Additional Features

You can enhance the Google OAuth integration by:

1. Adding profile picture display
2. Implementing role selection for Google users
3. Adding account linking (connect Google to existing email accounts)
4. Implementing token refresh logic
5. Adding logout functionality that signs out of Google

For more information, visit the [Google Identity Platform documentation](https://developers.google.com/identity).
