# 🚗 Vehicle KM Tracking Web App

A modern, full-stack web application for tracking vehicle kilometers per driver, built with Next.js 14, TypeScript, Prisma, and NextAuth.js.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure login with username/password
- Role-based access control (Admin/Driver)
- Session management with NextAuth.js

### 👨‍💼 Admin Dashboard
- **Trip Management**: View all trips with filtering by vehicle/driver
- **Vehicle Management**: Add, edit, and delete vehicles
- **User Management**: Add new drivers and admins
- **Export Functionality**: Download trip data as CSV
- **Real-time Statistics**: Track total trips, vehicles, and distances

### 🚗 Driver Dashboard
- **Vehicle Selection**: Choose from available vehicles
- **Trip Management**: Start and end trips with KM tracking
- **Real-time Updates**: See current trip status
- **Trip History**: View recent trip records
- **Input Validation**: Prevent invalid KM entries

### 🎨 Modern UI/UX
- Beautiful gradient backgrounds with glass morphism effects
- Responsive design for all devices
- Smooth CSS animations and transitions
- Professional dashboard interface
- Dark theme with vibrant accents

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Authentication**: NextAuth.js with JWT
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom animations

## 🚀 Demo Credentials

- **Admin**: `admin` / `admin123`
- **Driver**: `driver1` / `driver123`

## 📦 Local Development

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev --name init
npx prisma generate

# Seed database with demo data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🌐 Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Steps:
1. Push to GitHub
2. Connect to Vercel
3. Add Vercel Postgres database
4. Set environment variables
5. Deploy!

## 📊 Database Schema

- **Users**: Admin and Driver roles
- **Vehicles**: Vehicle information and status
- **Trips**: Trip records with KM tracking

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://..." # Vercel Postgres URL
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-secure-secret"
```
