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

## Quick Start: Manual Deployment via Render Dashboard

### Step 1: Create Backend Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the repository and configure:
   - **Name**: `rock-stock-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Root Directory**: `backend` (important!)
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `node dist/server.js`
   - **Plan**: Free tier (or Starter for better uptime)
5. Click **Advanced** and scroll to **Environment** section
6. Add environment variables (see below)
7. Click **Create Web Service**

### Step 2: Configure Environment Variables

In the Render dashboard for your backend service, go to **Settings** → **Environment** and add:

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

### Step 3: Deploy Frontend (Static Site - Recommended)

1. In Render Dashboard, click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `rock-stock-frontend`
   - **Branch**: `main`
   - **Build Command**: `cd frontend && npm run build`
   - **Publish Directory**: `frontend/dist/rock-stock`
4. Click **Create Static Site**

## Post-Deployment: Connect Frontend to Backend

After both services are deployed, update the frontend API URL:

1. Edit `frontend/src/environments/environment.prod.ts`
2. Update the backend URL to your Render service:
   ```typescript
   export const environment = {
     apiBaseUrl: 'https://rock-stock-backend.onrender.com/api',
     pollingIntervalMs: 15000
   };
   ```
3. Redeploy frontend with this change
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
