# Render Deployment Guide

This guide explains how to deploy Rock Stock to Render.com for production use.

## Overview

Render is a modern cloud platform that makes it easy to deploy web applications. We'll deploy:
- **Backend API** as a Node.js web service
- **Frontend** as a static site (served from Render)

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Project pushed to GitHub (already done!)
3. **Environment Variables**: RapidAPI credentials

## Deployment Methods

### Option 1: One-Click Deployment (Recommended)

Click the button below to deploy directly:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Then follow the prompts to authorize GitHub and deploy.

### Option 2: Manual Deployment via Render Dashboard

#### Step 1: Create Backend Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in the configuration:
   - **Name**: `rock-stock-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: 
     ```
     cd backend && npm install && npm run build
     ```
   - **Start Command**: 
     ```
     cd backend && npm start
     ```
   - **Plan**: Free (or paid if you need better uptime)
5. Click **Advanced** and add environment variables
6. Click **Create Web Service**

#### Step 2: Configure Environment Variables

In the Render dashboard for your backend service:

1. Go to **Environment** tab
2. Add the following variables:

| Key | Value | Type |
|-----|-------|------|
| `NODE_ENV` | `production` | Standard |
| `PORT` | `3000` | Standard |
| `USE_MOCK` | `false` | Standard |
| `CACHE_TTL_SECONDS` | `600` | Standard |
| `RAPIDAPI_KEY` | `your_key_here` | Secret |
| `RAPIDAPI_HOST` | `real-time-finance-data.p.rapidapi.com` | Standard |
| `REDIS_URL` | `redis://url_here` (optional) | Secret |

3. Click **Save**

#### Step 3: Deploy Frontend

**Option A: Static Site (Recommended)**

1. Build the frontend locally:
   ```bash
   cd frontend
   npm run build
   ```

2. In Render Dashboard, click **New +** → **Static Site**
3. Connect repository or upload build folder
4. Set **Build Command**: `cd frontend && npm run build`
5. Set **Publish Directory**: `frontend/dist/rock-stock`
6. Click **Create Static Site**

**Option B: Serve Frontend from Backend**

For a simpler single-service deployment:

1. Build frontend to backend's public directory:
   ```bash
   cd frontend
   npm run build
   cp -r dist/rock-stock ../backend/public
   ```

2. Update backend `server.ts` to serve static files:
   ```typescript
   import express from 'express';
   import path from 'path';
   
   const app = express();
   
   // Serve static files
   app.use(express.static(path.join(__dirname, '../public')));
   
   // API routes
   app.use('/api', routes);
   
   // Fallback to index.html for SPA routing
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../public/index.html'));
   });
   ```

3. Update backend `package.json` build script to include frontend build

## Configuration Files

### render.yaml

The `render.yaml` file in your repository root configures both services:

```yaml
services:
  - type: web
    name: rock-stock-backend
    runtime: node
    region: oregon
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: RAPIDAPI_KEY
        scope: secret
```

This allows one-click deployment.

## Post-Deployment Configuration

### 1. Update Frontend API URL

After deployment, update the frontend to use your Render backend URL:

1. Go to `frontend/src/environments/environment.prod.ts`
2. Update `apiBaseUrl`:
   ```typescript
   export const environment = {
     apiBaseUrl: 'https://rock-stock-backend.onrender.com/api',
     pollingIntervalMs: 15000
   };
   ```
3. Rebuild and redeploy frontend

### 2. CORS Configuration

Update backend CORS settings for your frontend URL:

```typescript
// backend/src/server.ts
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://your-frontend-url.onrender.com',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

### 3. Custom Domain (Optional)

To use a custom domain:

1. In Render Dashboard, go to your service
2. Click **Settings** → **Custom Domain**
3. Add your domain
4. Follow DNS configuration instructions
5. Update CORS and frontend API URL

## Monitoring and Logs

### View Logs

In Render Dashboard:
1. Click your service
2. Go to **Logs** tab
3. View real-time application logs

### Monitor Performance

1. Check **Metrics** tab for CPU, memory, and requests
2. Set up alerts for high error rates
3. Monitor database connections (if using Redis)

## Troubleshooting

### Build Fails

```bash
# Check build command output in Render logs
# Ensure all dependencies are in package.json
npm install  # Run locally first
```

### Application Crashes

1. Check logs in Render Dashboard
2. Verify environment variables are set correctly
3. Test backend locally: `npm run dev`

### CORS Errors

- Check CORS origin in `server.ts`
- Add frontend URL to allowed origins
- Verify both services are deployed and running

### API Returns 404

- Verify backend is running
- Check API endpoint paths
- Confirm environment variables are set

### Free Plan Limitations

- Services spin down after 15 minutes of inactivity
- First request will be slower (cold start)
- Upgrade to paid plan for persistent uptime

## Upgrading to Paid

To avoid cold starts and get 99.9% uptime:

1. In Render Dashboard, go to your service
2. Click **Settings** → **Plan**
3. Select **Starter** or higher
4. Update billing information

## Scaling

### Horizontal Scaling

Render automatically handles scaling, but for better control:

1. Go to **Settings** → **Instance Count**
2. Increase number of instances for load balancing

### Database Scaling

If using Redis:
1. Use Render's Redis add-on or external service
2. Set `REDIS_URL` environment variable
3. Restart service

## Continuous Deployment

Render automatically deploys on push to your main branch if configured via dashboard.

To disable auto-deploy:
1. Go to service **Settings**
2. Uncheck **Auto-deploy**

## Cost Optimization

1. Use free tier for development
2. Enable auto-shut down for non-critical services
3. Use caching to reduce API calls
4. Monitor and optimize database queries
5. Consider CDN for static assets

## Backup and Recovery

### Database Backups

If using Redis:
1. Enable Redis backups in Render
2. Store sensitive data securely
3. Test restore process regularly

### Code Recovery

1. Maintain clean git history
2. Tag releases: `git tag v1.0.0`
3. Keep backup branch: `git push origin backup-main`

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Deployment environment | `production` |
| `PORT` | API server port | `3000` |
| `USE_MOCK` | Use mock data (dev/testing) | `false` |
| `RAPIDAPI_KEY` | RapidAPI authentication key | `abc123...` |
| `RAPIDAPI_HOST` | RapidAPI host URL | `real-time-finance-data.p.rapidapi.com` |
| `CACHE_TTL_SECONDS` | Cache expiration time | `600` |
| `REDIS_URL` | Redis connection URL (optional) | `redis://host:6379` |

## Support

- Render Documentation: https://render.com/docs
- Rock Stock Issues: https://github.com/YOUR_USERNAME/rock-stock/issues
- Support Email: support@render.com

## Next Steps

1. Deploy backend service first
2. Deploy frontend static site or update backend to serve it
3. Test API endpoints
4. Configure custom domain
5. Set up monitoring and alerts
6. Optimize for production

---

**Happy Rendering! 🚀**
