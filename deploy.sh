#!/bin/bash

echo "🚀 Preparing Vehicle KM Tracker for Vercel Deployment"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Prepare Vehicle KM Tracker for Vercel deployment

✨ Features:
- Modern gradient UI with glass morphism
- Admin dashboard with trip/vehicle/user management
- Driver dashboard with trip tracking
- Role-based authentication
- CSV export functionality
- PostgreSQL database support
- Fully responsive design

🛠️ Tech Stack:
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- NextAuth.js
- Tailwind CSS
- Vercel deployment ready"

echo "✅ Repository prepared for deployment!"
echo ""
echo "🌐 Next Steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "2. Go to vercel.com and import your repository"
echo "3. Add Vercel Postgres database in Storage tab"
echo "4. Set environment variables (see DEPLOYMENT.md)"
echo "5. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
