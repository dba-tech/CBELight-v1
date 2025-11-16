# CBELight Frontend - Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with frontend code pushed
- Backend deployed and running (get the URL from Render)

## Step-by-Step Deployment to Vercel

### 1. Create Vercel Account & Connect GitHub

1. Go to https://vercel.com and sign up
2. Click **"Import Project"** or **"New Project"**
3. Select your GitHub repository: **CBELight-v1**
4. Vercel will auto-detect it's a React/Vite project

### 2. Configure Project Settings

**Project Name**: `cbelight-frontend`

**Framework Preset**: Select **"Vite"** (Vercel auto-detects)

**Root Directory**: `frontend/`

**Build Command**: 
```bash
npm run build
```

**Output Directory**: 
```bash
dist
```

**Install Command**:
```bash
npm install
```

### 3. Set Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**

Add the following:

```
VITE_API_URL=https://cbelight-backend.onrender.com
```

**Important**: Replace with your actual Render backend URL

### 4. Deploy

Click **"Deploy"** and wait for build to complete (usually 2-3 minutes)

**Your frontend URL will be**: `https://cbelight-frontend.vercel.app`

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://cbelight-backend.onrender.com` |

---

## Automatic Deployments

Vercel automatically redeploys when you:
- Push to `main` branch (or configured branch)
- Create a pull request (preview deployment)
- Update environment variables

### Disable Auto-Deploy (Optional)
Vercel Settings → **Git** → Uncheck "Deploy on push"

---

## Custom Domain (Optional)

1. Go to Vercel Project → **Settings** → **Domains**
2. Add your custom domain (e.g., `cbelight.com`)
3. Follow DNS instructions from your domain registrar
4. SSL certificate auto-provisioned by Vercel

---

## Production Recommendations

### Performance Optimization
✅ Already configured:
- Vite production build (minified)
- Tailwind CSS tree-shaking
- Code splitting via React Router

### Security Headers
Vercel adds by default:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block

### CORS Configuration
Make sure backend allows frontend domain:

In `backend/src/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://cbelight-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ]
}));
```

---

## Monitoring & Debugging

### View Logs
1. Vercel Dashboard → Project → **Deployments**
2. Click a deployment → **Logs**
3. Check **Build Logs** and **Runtime Logs**

### Preview Deployments
- Every pull request gets a preview URL
- Test changes before merging to main

### Rollback to Previous Deployment
1. Vercel Dashboard → **Deployments**
2. Find previous deployment
3. Click **...** → **Promote to Production**

---

## Common Issues & Solutions

### "VITE_API_URL not defined"
```
Solution: Check Environment Variables in Vercel Settings
- Variable name must start with VITE_
- Redeploy after adding
```

### "CORS error - blocked by browser"
```
Solution: Backend CORS not configured for frontend URL
1. Update backend CORS to include Vercel URL
2. Redeploy backend
3. Restart frontend
```

### "Cannot GET /"
```
Solution: Build configuration issue
1. Check Root Directory is set to "frontend/"
2. Verify Build Command and Output Directory
3. Try redeploying
```

### "API calls showing localhost:5000"
```
Solution: Frontend using wrong API URL
- Check VITE_API_URL environment variable
- Ensure it's set to Render backend URL, not localhost
- Redeploy frontend
```

### Socket.IO not connecting
```
Solution: CORS or WebSocket issues
1. Enable WebSocket in backend (Socket.IO handles this)
2. Check CORS allows frontend domain
3. Verify backend is running (check Render logs)
4. Try hard refresh: Ctrl+Shift+R
```

---

## Testing in Production

After deployment, test these flows:

1. **Home Page**: Visit https://cbelight-frontend.vercel.app
2. **Signup**: Create new account
3. **Login**: Login with created account
4. **Register**: Submit registration with department
5. **Dashboard**: Check pie chart and registrations table
6. **Edit Registration**: Test Student ID gateway
7. **Account**: View and edit profile

---

## Performance Monitoring

### Vercel Analytics
1. Project → **Analytics**
2. Monitor:
   - Page Load Time
   - Core Web Vitals
   - Lighthouse Score

### Optimize Bundle Size
```bash
# Check bundle size
npm run build

# See which packages are large
npm ls
```

---

## Cost Estimate

- **Vercel Free Tier**: $0/month (recommended for MVP)
  - 100GB bandwidth
  - Unlimited deployments
  - Standard performance
  
- **Vercel Pro**: $20/month (for production)
  - Priority support
  - Higher limits
  - Advanced analytics

---

## Environment Setup Summary

### Local Development
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev  # runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev  # runs on http://localhost:5173
```

### Production (Vercel + Render)
- Backend: `https://cbelight-backend.onrender.com`
- Frontend: `https://cbelight-frontend.vercel.app`
- Database: MongoDB Atlas cloud

---

## Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend environment variable set in Vercel
- [ ] Frontend deployed to Vercel
- [ ] All tests passing locally
- [ ] Signup flow tested end-to-end
- [ ] Dashboard shows registrations
- [ ] Socket.IO connecting in browser console
- [ ] Custom domain configured (optional)
- [ ] Analytics monitoring enabled

---

## Next Steps

1. Deploy backend first (Render)
2. Get backend URL
3. Deploy frontend with backend URL (Vercel)
4. Test all features
5. Set up custom domain if desired
6. Monitor logs and performance
7. Iterate based on user feedback

---

**For detailed help**: https://vercel.com/docs
