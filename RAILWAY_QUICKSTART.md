# 🚂 Railway Deployment - Quick Guide

## Deploy in 3 Steps (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "GYATT PPL web service"
git remote add origin YOUR_GITHUB_REPO_URL
git push origin main
```

### 2. Deploy on Railway
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Railway auto-detects and deploys!

### 3. Set Environment Variables
In Railway Dashboard → Variables tab:

```
JWT_SECRET=<generate below>
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Done! 🎉
- Your app is live at: `https://your-app.railway.app`
- Login: `abhinav.reddivari@gmail.com` / `Abhi143$`
- Change password immediately!

---

## What Railway Does Automatically

✅ Detects Node.js  
✅ Runs `npm install`  
✅ Starts your server  
✅ Provides HTTPS  
✅ Sets PORT variable  
✅ Auto-deploys on git push  

---

## Testing Your Deployment

```bash
curl https://your-app.railway.app/api/health
# Should return: {"status":"ok","message":"GYATT PPL Backend is running"}
```

---

## Data Persistence

Your JSON files persist automatically. For extra safety, add a Volume:
- Railway Dashboard → Settings → Volumes
- Add volume: `/database`

---

## Troubleshooting

**"Application failed to respond"**  
✅ Already fixed - code uses `process.env.PORT`

**"Authentication failing"**  
- Verify JWT_SECRET is set in Railway
- Generate a new one if needed
- Restart the service

**View Logs:**  
Railway Dashboard → Deployments → View Logs

---

**The Gyatts will prevail - on Railway!** 🚂🔥

### Method 1: Railway Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects and deploys! ✨

3. **Set Environment Variables**
   - In Railway Dashboard, click on your project
   - Go to "Variables" tab
   - Add these variables:
   
   ```
   JWT_SECRET=<generate with command below>
   NODE_ENV=production
   ```
   
   Generate JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Done!** 🎉
   - Railway gives you a URL: `https://your-app.railway.app`
   - Default login: `abhinav.reddivari@gmail.com` / `Abhi143$`
   - Change password immediately!

---

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Run the automated script
./deploy-railway.sh
```

---

## 🎯 What Railway Does Automatically

✅ Detects Node.js project  
✅ Installs dependencies (`npm install`)  
✅ Starts your server (`npm start`)  
✅ Provides HTTPS automatically  
✅ Sets PORT environment variable  
✅ Gives you a public URL  
✅ Auto-deploys on git push  

---

## 📦 Project Structure for Railway

```
gyattppl/
├── backend/
│   ├── server.js          ← Railway starts from here
│   ├── package.json       ← Railway reads this
│   └── .env               ← Don't commit this!
├── railway.json           ← Railway configuration
├── nixpacks.toml          ← Build configuration
└── .railwayignore         ← Files to ignore
```

All configuration files are already set up! ✅

---

## 🔒 Required Environment Variables

Set these in Railway Dashboard:

| Variable | Value | How to Generate |
|----------|-------|-----------------|
| `JWT_SECRET` | Random 64-char hex | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` | Just type it |

**Don't set `PORT`** - Railway sets this automatically!

---

## 💾 Data Persistence

Your JSON files will persist by default. For extra safety:

### Add a Volume (Optional)
1. Railway Dashboard → Your Service
2. Click "Settings"
3. Scroll to "Volumes"
4. Add volume: `/database`

This ensures your data survives across deployments.

---

## 🔍 Testing Your Deployment

```bash
# Replace with your Railway URL
curl https://your-app.railway.app/api/health

# Should return:
# {"status":"ok","message":"GYATT PPL Backend is running"}
```

---

## 📊 Monitoring

Railway Dashboard provides:
- Real-time logs
- CPU/Memory metrics
- Deployment history
- Custom domains
- Environment variables

---

## 🔄 Continuous Deployment

Once connected to GitHub:

```bash
git add .
git commit -m "Update app"
git push
# Railway automatically redeploys! 🚀
```

---

## 🐛 Common Issues

### "Application failed to respond"
✅ Already fixed! The code uses `process.env.PORT`

### "Database files not found"
✅ They're created automatically on first run

### "CORS errors"
✅ Already configured for Railway domains

### "Authentication failing"
1. Check JWT_SECRET is set in Railway
2. Generate a new one if needed
3. Restart the service

---

## 💡 Pro Tips

1. **Custom Domain**: Add in Railway Settings → Domains
2. **View Logs**: Railway Dashboard → Deployments → View Logs
3. **Rollback**: Railway Dashboard → Deployments → Pick previous version
4. **Clone for Testing**: Create a new Railway service for testing

---

## 🎓 Railway CLI Commands

```bash
railway login              # Login to Railway
railway init               # Initialize project
railway link               # Link to existing project
railway up                 # Deploy
railway open               # Open in browser
railway logs               # View logs
railway variables          # Manage environment variables
railway status             # Check deployment status
```

---

## ✅ Post-Deployment Checklist

- [ ] App is accessible at Railway URL
- [ ] Can login with default credentials
- [ ] Changed admin password
- [ ] JWT_SECRET is set
- [ ] Tested creating users
- [ ] Tested creating missions
- [ ] Tested suggestions
- [ ] Tested admin panel

---

## 🌐 Your App is Live!

```
URL: https://your-app.railway.app
Admin: abhinav.reddivari@gmail.com
Password: Abhi143$ (CHANGE THIS!)
```

**The Gyatts will prevail - now on Railway!** 🚂🔥
