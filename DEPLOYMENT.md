# Deployment Guide: Pop-Up Workspace to Vercel + GitHub

## Overview
This guide covers deploying both the backend (Node.js/Express) and frontend (HTML) to production.

### Deployment Strategy
- **Backend**: Vercel Serverless Functions (or Railway/Heroku for database persistence)
- **Frontend**: Vercel Static Hosting or Netlify
- **Database**: Managed PostgreSQL on Railway, AWS RDS, or Neon

---

## ✅ Prerequisites

1. **GitHub Account** - Create at https://github.com
2. **Vercel Account** - Create at https://vercel.com (free tier available)
3. **PostgreSQL Database** - For production (we'll use Neon or Railway)
4. **Git installed** - Download from https://git-scm.com

---

## 🚀 Step 1: Push to GitHub

### 1.1 Add New Changes to Existing Repository
Since you already have a GitHub repo, just add and commit the new files:

```bash
cd "C:\Users\BIT\Desktop\New folder\stitch"
git add .
git commit -m "Add: Frontend integration, deployment configs, and production setup"
git push origin main
```

### 1.2 Verify Files on GitHub
1. Go to your GitHub repository
2. You should see these new files added:
   - `code.html` (updated)
   - `.gitignore` (root level)
   - `DEPLOYMENT.md`
   - `backend/vercel.json`
   - `backend/src/` (all API files)

✅ Your repo is now updated with all production-ready code!

---

## 🗄️ Step 2: Set Up Production Database

### Option A: Using Neon (Recommended - Free Tier)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project
4. Copy the connection string: `postgresql://user:password@host.neon.tech/dbname`
5. Save this safely - you'll need it for Vercel environment variables

### Option B: Using Railway
1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the database URL

---

## 🌐 Step 3: Deploy Backend to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Search for `popup-workspace` repository
5. Click "Import"

### 3.2 Configure Environment Variables
In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables (from your production database):
   ```
   DB_HOST = your-neon-host.neon.tech
   DB_PORT = 5432
   DB_NAME = neondb
   DB_USER = neondb_owner
   DB_PASSWORD = your-password-here
   JWT_SECRET = your-random-jwt-secret-here
   JWT_EXPIRE = 7d
   NODE_ENV = production
   CORS_ORIGIN = http://localhost:3000,https://your-vercel-domain.vercel.app,https://yourdomain.com
   ```

### 3.3 Configure Build Settings
1. Go to **Settings** → **Build & Development Settings**
2. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty for Node.js)

### 3.4 Deploy
- Vercel automatically deploys when you push to GitHub
- Check deployment status at https://vercel.com/dashboard

---

## 🎨 Step 4: Deploy Frontend to Vercel (Alternative)

### Option: Host HTML on Vercel
If you want the frontend on Vercel too:

1. Create a `vercel.json` in root:
```json
{
  "version": 2,
  "buildCommand": "",
  "devCommand": "",
  "builds": [
    {
      "src": "code.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "code.html"
    }
  ]
}
```

2. Push to GitHub
3. Vercel will auto-deploy the frontend too

---

## 🔄 Step 5: Update Frontend API URL

After deploying backend, update `code.html`:

```bash
# Find this line (around line 550):
const API_BASE_URL = 'http://localhost:3000/api';

# Change to:
const API_BASE_URL = 'https://your-backend-on-vercel.vercel.app/api';
```

Then push to GitHub:
```bash
git add code.html
git commit -m "Update API URL to production"
git push
```

---

## ✅ Testing Production

1. **Visit frontend**: `https://your-project.vercel.app`
2. **Sign up** with test account
3. **Browse locations** - Should load from production API
4. **Create booking** - Should save to production database
5. **View profile** - Should show actual bookings

---

## 🐛 Troubleshooting

### Backend not connecting to database
- ✓ Check environment variables in Vercel
- ✓ Verify database connection string
- ✓ Check database firewall allows Vercel IPs

### CORS errors
- ✓ Verify `CORS_ORIGIN` in `.env` includes your Vercel domain
- ✓ Add new domain: `https://your-domain.vercel.app`

### 502 Bad Gateway
- ✓ Check Vercel logs: https://vercel.com/dashboard → project → Deployments
- ✓ Verify server is listening on port (Vercel assigns PORT env var)

---

## 📊 Useful Vercel Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from terminal
vercel

# View logs
vercel logs --backend

# Redeploy
vercel --prod
```

---

## 💾 Production Checklist

- [ ] Database migrated to production PostgreSQL
- [ ] Environment variables set in Vercel
- [ ] Git repository pushed to GitHub
- [ ] Backend deployed on Vercel
- [ ] Frontend API URL updated to production
- [ ] CORS_ORIGIN includes production domains
- [ ] Test signup/login flow
- [ ] Test location browsing
- [ ] Test booking creation
- [ ] Check Vercel logs for errors
- [ ] Set up custom domain (optional)

---

## 📝 Custom Domain (Optional)

1. Buy domain from GoDaddy, Namecheap, etc.
2. In Vercel project → **Settings** → **Domains**
3. Add your domain
4. Follow DNS configuration instructions
5. Wait 24-48 hours for propagation

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Node.js on Vercel: https://vercel.com/docs/concepts/functions/serverless-functions/node-js
- Neon Docs: https://neon.tech/docs
- Railway Docs: https://docs.railway.app

