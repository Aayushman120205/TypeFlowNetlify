# 🚀 TypeFlow - Vercel Deployment Guide

## Prerequisites
- GitHub account with the typeflow repository
- MongoDB Atlas account (free tier available at mongodb.com/cloud/atlas)
- Vercel account (free tier available at vercel.com)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with a strong password
4. Get your connection string from "Connect" → "Connect your application"
5. It should look like: `mongodb+srv://username:password@cluster.mongodb.net/typeflow?retryWrites=true&w=majority`

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Log in with GitHub
3. Click "New Project"
4. Select your typeflow repository
5. In **Environment Variables**, add:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string from Step 1
6. Click "Deploy" ✨

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables when prompted
# - MONGODB_URI: your-mongodb-uri

# For production deployment
vercel --prod
```

## Step 3: Verify Deployment

After deployment:

1. Visit your Vercel domain (e.g., `typeflow.vercel.app`)
2. Try to create an account
3. Check if data is saving to MongoDB
4. Go to Leaderboard to see if data persists

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Getting 504/502 Errors?
- Make sure `MONGODB_URI` environment variable is set in Vercel
- Check MongoDB Atlas allows connections from Vercel's IP (should be automatic with Atlas)
- Verify MongoDB URI is correct

### API calls not working?
- Check browser console for errors
- Verify `/api/health` endpoint returns `{"ok":true}`
- MongoDB connection might be timing out - check Atlas settings

### Environment Variables Not Working?
1. In Vercel Dashboard → Project Settings → Environment Variables
2. Make sure `MONGODB_URI` is set for Production
3. Redeploy after adding variables: `vercel --prod`

## File Structure for Vercel

```
typeflow/
├── api/                    # Serverless functions
│   ├── auth.js            # Auth endpoint
│   ├── sessions.js        # Sessions endpoint
│   ├── leaderboard.js     # Leaderboard endpoint
│   └── health.js          # Health check
├── src/                    # Backend models & utilities
│   ├── models/
│   ├── lib/
│   └── ...
├── *.html                  # Frontend (served as static)
├── shared.js              # Shared frontend code
├── api.js                 # Frontend API client
├── vercel.json            # Vercel config
└── package.json
```

## How It Works

- **Frontend**: Static HTML/CSS/JS served by Vercel
- **Backend**: Serverless functions in `/api/` folder
- **Database**: MongoDB Atlas (cloud)
- **API Calls**: Frontend calls `/api/*` which triggers serverless functions

## Next Steps After Deployment

1. **Share your Vercel link**: Others can now register and compete!
2. **Monitor usage**: Check Vercel dashboard for logs
3. **Scale MongoDB**: Upgrade MongoDB plan if needed
4. **Add custom domain**: Make it look professional

## Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- TypeFlow Issues: Check GitHub issues

---

**Deployed successfully? 🎉 Share your TypeFlow link!**
