
# Google OAuth Custom Integration Setup Guide

## Overview
This guide will help you set up Google OAuth for Smart Fundi using your own OAuth credentials (Custom Integration).

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it "Smart Fundi" or your preferred name

## Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - User Type: **External** (unless you have a Google Workspace)
   - App name: **Smart Fundi**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `email`, `profile`, and `openid`
   - Test users: Add your email for testing

4. After configuring consent screen, create OAuth client ID:
   - Application type: **Web application**
   - Name: **Smart Fundi Web**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/google/callback
     https://your-production-domain.com/api/auth/google/callback
     ```

5. Click **Create**
6. **IMPORTANT**: Save your **Client ID** and **Client Secret** - you'll need these next

## Step 4: Configure Environment Variables

1. Open your `.env.local` file in the project root (create it if it doesn't exist)
2. Add the following variables with your credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Base URL (update for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Example:**
```env
GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
```

## Step 5: Restart Your Development Server

After adding environment variables, restart your Next.js server:

```bash
# Stop the current server (Ctrl+C or Cmd+C)
# Then restart:
npm run dev
```

## Step 6: Test Google Sign-In

1. Go to http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. You should be redirected to Google's login page
4. After signing in, you'll be redirected back to Smart Fundi

## Production Deployment

### For Vercel Deployment:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
   ```

4. Update your Google Cloud Console OAuth settings:
   - Add your Vercel production URL to Authorized JavaScript origins
   - Add your Vercel callback URL to Authorized redirect URIs:
     ```
     https://your-domain.vercel.app/api/auth/google/callback
     ```

5. Redeploy your application

## Security Best Practices

1. **Never commit `.env.local` to version control** - it's already in `.gitignore`
2. **Use different OAuth credentials for development and production**
3. **Regularly rotate your client secrets**
4. **Monitor OAuth usage in Google Cloud Console**
5. **Enable only necessary scopes** (email, profile, openid)

## Troubleshooting

### "OAuth not configured" Error
- Verify environment variables are set correctly
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present
- Restart your development server after adding variables

### "Redirect URI mismatch" Error
- Ensure the redirect URI in Google Cloud Console exactly matches:
  `http://localhost:3000/api/auth/google/callback` (for development)
  `https://your-domain.com/api/auth/google/callback` (for production)

### "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email as a test user (for External apps in testing mode)
- Make sure required scopes (email, profile, openid) are added

### "Token exchange failed"
- Verify `GOOGLE_CLIENT_SECRET` is correct
- Check that the client secret hasn't been regenerated
- Ensure you're using the correct project credentials

## Testing Flow

1. **Local Development:**
   - User clicks "Sign in with Google" → Redirected to Google
   - User authorizes → Redirected to `/api/auth/google/callback`
   - Callback exchanges code for token → Creates user session
   - User redirected to homepage as authenticated

2. **Expected User Data Received:**
   ```json
   {
     "id": "google-user-id",
     "name": "John Doe",
     "email": "john@example.com",
     "picture": "https://lh3.googleusercontent.com/..."
   }
   ```

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs for API errors
3. Verify all environment variables are correct
4. Ensure Google Cloud project is properly configured
5. Make sure the OAuth consent screen is published (for production)

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
