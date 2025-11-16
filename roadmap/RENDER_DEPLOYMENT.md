# CBELight Backend - Render Deployment Guide

## Prerequisites
- Render account (https://render.com)
- MongoDB Atlas account for cloud database
- GitHub repository pushed with all code

## Step-by-Step Deployment to Render

### 1. Create MongoDB Atlas Database (If Not Already Done)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Create a database user with username/password
4. Whitelist all IPs (0.0.0.0/0) or your Render IP
5. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/DBName`

### 2. Create Render Service

1. **Go to Render Dashboard** → https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect Repository**:
   - Select your GitHub repository (CBELight-v1)
   - Branch: `main`

### 3. Configure Render Service

**Name**: `cbelight-backend`

**Environment**: `Node`

**Build Command**:
```bash
npm install
```

**Start Command**:
```bash
npm start
```

**Plan**: Select "Free" (for testing) or "Paid" for production

### 4. Set Environment Variables

In Render dashboard, go to **Environment** section and add:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/CBELightDB?appName=cluster1
JWT_SECRET=your_very_secure_random_secret_key_here_min_32_chars
NODE_ENV=production
```

**Important**: Use a strong JWT_SECRET (at least 32 characters)

### 5. Deploy

Click **"Deploy"** and wait for deployment to complete.

**Your backend URL will be**: `https://cbelight-backend.onrender.com`

### 6. Test Backend

```bash
curl https://cbelight-backend.onrender.com/
# Should return: "CBELight API Running"
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `min_32_chars_random_string` |
| `NODE_ENV` | Environment mode | `production` |

---

## Important Notes

### Free Tier Limitations (Render)
- Services spin down after 15 minutes of inactivity
- First request may take 30 seconds (warm-up time)
- No guaranteed uptime SLA
- 0.5GB RAM limit

### Production Recommendations
- Use paid tier for reliable uptime
- Set up auto-deploy on GitHub pushes
- Monitor logs via Render dashboard
- Set up email alerts for failures
- Use strong, unique JWT_SECRET
- Enable CORS properly for frontend domain

### Connecting Frontend to Backend

After deployment, update frontend `.env.production`:
```env
VITE_API_URL=https://cbelight-backend.onrender.com
```

Or set it during Vercel deployment in environment variables.

---

## Monitoring & Debugging

### View Logs
1. Render Dashboard → Your Service → **Logs**
2. Check for errors in real-time

### Common Issues

**"Cannot connect to MongoDB"**
- Check MONGO_URI is correct
- Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
- Test connection locally first

**"Port already in use"**
- Change PORT in environment variables
- Default Render assigns ports automatically

**"Socket.IO not connecting"**
- Ensure CORS is configured for frontend URL
- Check browser console for connection errors

### Restart Service
Render dashboard → Service → **Manual Redeploy**

---

## Cost Estimate

- **Free Tier**: $0/month (limited)
- **Starter Plan**: $7/month (recommended)
- **Standard Plan**: $12+/month (higher reliability)
- **MongoDB Atlas**: Free 512MB storage, $57/month for higher tiers

Total Monthly Cost (Recommended): ~$20-30 for backend + frontend + database

---

## Next Steps

1. Deploy backend to Render
2. Note your backend URL
3. Deploy frontend to Vercel with backend URL
4. Test end-to-end flows
5. Monitor logs and performance

---

**For detailed help**: https://render.com/docs
