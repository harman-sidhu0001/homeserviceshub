# Frontend Railway Setup Guide

## Problem

Your frontend (`homeserviceshub.in`) is not sending cookies to your Railway backend because the frontend doesn't know the correct backend URL.

## Solution

### 1. **Create/Update Your .env.local File**

In your `client/` directory, create or update `.env.local` with only production variables:

```env
# Production API Configuration (Railway Backend)
VITE_API_BASE_URL_PROD=https://homeserviceshub-production.up.railway.app/api

# App Configuration
VITE_APP_NAME=HomeServicesHub
VITE_APP_URL_PROD=https://homeserviceshub.in
```

### 2. **Set Environment Variables in Vercel (Alternative)**

If you prefer to set them in Vercel dashboard instead of using a file:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```env
VITE_API_BASE_URL_PROD=https://homeserviceshub-production.up.railway.app/api
VITE_APP_NAME=HomeServicesHub
VITE_APP_URL_PROD=https://homeserviceshub.in
```

### 3. **How It Works**

The configuration automatically uses:

- **Development**: Hardcoded values → `http://localhost:5000/api`
- **Production**: Environment variables → `https://homeserviceshub-production.up.railway.app/api`

### 4. **Verify Configuration**

After setting the environment variables:

1. **Check the API URL**: Your frontend should now make requests to `https://homeserviceshub-production.up.railway.app/api` in production
2. **Test Login**: Try logging in and check if cookies are sent
3. **Check Network Tab**: Verify requests are going to the Railway URL

### 5. **Testing Steps**

1. **Before Fix:**

   - Frontend requests go to `http://localhost:5000/api` (wrong in production)
   - No cookies sent to Railway backend
   - 401 Unauthorized errors

2. **After Fix:**
   - Frontend requests go to `https://homeserviceshub-production.up.railway.app/api` (correct)
   - Cookies should be sent with requests
   - Authentication should work

### 6. **Debug Commands**

Check if the environment variables are working:

```javascript
// In browser console on your live site
console.log("Environment:", import.meta.env.MODE);
console.log("API URL:", import.meta.env.VITE_API_BASE_URL_PROD);
console.log("App Name:", import.meta.env.VITE_APP_NAME);
console.log("App URL:", import.meta.env.VITE_APP_URL_PROD);
```

### 7. **Expected Output**

After setting the environment variables, you should see:

- `Environment`: `production`
- `API URL`: `https://homeserviceshub-production.up.railway.app/api`
- `App Name`: `HomeServicesHub`
- `App URL`: `https://homeserviceshub.in`

### 8. **Deploy and Test**

1. Add the variables to your `.env.local` file OR set them in Vercel dashboard
2. Redeploy your frontend
3. Test login functionality
4. Check browser Network tab for:
   - Requests going to Railway URL
   - Cookies being sent with requests
   - Successful authentication

## Why This Fixes the Issue

- **Before**: Frontend was trying to send cookies to `localhost:5000` (which doesn't exist in production)
- **After**: Frontend sends cookies to the actual Railway backend URL
- **Result**: Cross-domain cookies work properly with `sameSite: "none"` and `secure: true`

## Troubleshooting

If cookies still aren't sent after this fix:

1. **Check CORS**: Verify Railway backend allows `https://homeserviceshub.in`
2. **Check HTTPS**: Both frontend and backend must be HTTPS
3. **Check Browser**: Some browsers block third-party cookies
4. **Check Network**: Look for CORS preflight errors
5. **Check Environment**: Make sure `import.meta.env.MODE` is `production` on your live site
