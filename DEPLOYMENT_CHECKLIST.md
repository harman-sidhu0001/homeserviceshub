# 🚀 Deployment Checklist for HomeServicesHub

## ✅ **Backend Configuration**

### 1. Environment Variables

Make sure these are set in your backend deployment (Render/Railway/etc.):

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Redis Configuration
REDIS_URL=your_redis_connection_string

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com


```

### 2. CORS Configuration ✅

- ✅ Backend now supports configurable domains via environment variables
- ✅ Set `CORS_ORIGINS` environment variable with comma-separated URLs
- ✅ Example: `CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`

### 3. API Endpoints ✅

- ✅ All 78 controller functions working
- ✅ Health check endpoint: `/health`

## ✅ **Frontend Configuration**

### 1. Environment Setup ✅

- ✅ Environment-based API configuration
- ✅ Set `VITE_API_BASE_URL` environment variable for production
- ✅ Set `VITE_APP_NAME` and `VITE_APP_URL` for app configuration

### 2. Build Configuration

Make sure your Vite build is configured for production:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  // ... other config
});
```

## 🔧 **Testing Steps**

### 1. Backend Health Check

```bash
curl https://your-backend-url.com/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "environment": "production",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 2. CORS Test

Test from both domains:

```bash
# Test from homeserviceshub.in
curl -H "Origin: https://www.homeserviceshub.in" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://your-backend-url.com/api/services
```

### 3. API Endpoint Test

```bash
curl https://your-backend-url.com/api/services
```

## 🌐 **Domain Configuration**

### 1. DNS Settings

Ensure your domain points to the correct hosting:

- `www.homeserviceshub.in` → Vercel
- `homeserviceshub.in` → Vercel (with redirect to www)

### 2. SSL Certificates

- ✅ Vercel provides automatic SSL
- ✅ Backend should have SSL certificate

## 🔍 **Troubleshooting**

### Common Issues:

1. **CORS Errors**

   - Check if backend CORS includes your domain
   - Verify frontend is making requests to correct backend URL

2. **API Connection Issues**

   - Check backend health endpoint
   - Verify environment variables are set
   - Check network connectivity

3. **API Connection Issues**
   - Check Redis connection
   - Verify `NODE_ENV=production` is set
   - Check health endpoint status

### Debug Commands:

```bash
# Check backend health
curl https://your-backend-url.com/health

# Check environment
curl https://your-backend-url.com/health/env

# Test health endpoint
curl https://your-backend-url.com/health
```

## 🔒 **Security Checklist**

### ✅ **Environment Variables**

- ✅ All sensitive data moved to environment variables
- ✅ No hardcoded URLs in code
- ✅ No sensitive data exposed in API responses
- ✅ CORS origins configurable via environment variables

### ✅ **API Security**

- ✅ Health endpoint sanitized (no sensitive data)
- ✅ Environment endpoint shows only non-sensitive info
- ✅ Server logs don't expose sensitive URLs
- ✅ JWT secrets stored in environment variables

### ✅ **Frontend Security**

- ✅ API URLs configurable via environment variables
- ✅ No hardcoded backend URLs
- ✅ Environment-based configuration

## 📞 **Support**

If issues persist:

1. Check backend logs
2. Verify all environment variables
3. Test health endpoints
4. Check CORS configuration
5. Ensure `.env` files are in `.gitignore`
