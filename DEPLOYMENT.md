# 🚀 Vercel Deployment Guide

## Prerequisites
- ✅ Vercel account (free at vercel.com)
- ✅ GitHub account
- ✅ Project pushed to GitHub: https://github.com/thahirthm/car-web.git

## Step-by-Step Deployment

### 1. ✅ GitHub Setup Complete
Your project is now available at: **https://github.com/thahirthm/car-web.git**

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Add Database (Vercel Postgres)
1. In your Vercel project dashboard, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose a database name (e.g., "vehicle-tracker-db")
4. Copy the connection string provided

### 4. Set Environment Variables
In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://[your-vercel-postgres-url]
NEXTAUTH_URL=https://[your-app-name].vercel.app
NEXTAUTH_SECRET=[generate-a-secure-random-string]
```

### 5. Run Database Migration
After deployment, you need to set up the database schema:

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Run migration: `vercel env pull .env.local && npx prisma migrate deploy`

### 6. Seed Database (Optional)
To add demo data:
```bash
npx prisma db seed
```

## Demo Credentials
After deployment, you can login with:
- **Admin**: username: `admin`, password: `admin123`
- **Driver**: username: `driver1`, password: `driver123`

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string from Vercel | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your deployed app URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Generate with `openssl rand -base64 32` |

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is correctly set in Vercel environment variables
- Check that Vercel Postgres is properly configured

### Authentication Issues
- Verify NEXTAUTH_URL matches your deployed domain
- Ensure NEXTAUTH_SECRET is set and secure

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json

## Post-Deployment
1. Test login functionality
2. Create test vehicles and trips
3. Verify admin and driver dashboards work
4. Test CSV export functionality

Your Vehicle KM Tracker is now live! 🎉
