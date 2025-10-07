import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check environment variables
    const databaseUrl = process.env.DATABASE_URL
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET

    // Test database connection
    const userCount = await prisma.user.count()
    const vehicleCount = await prisma.vehicle.count()
    const tripCount = await prisma.trip.count()

    return NextResponse.json({
      status: 'success',
      message: 'Full system check passed',
      data: {
        environment: {
          DATABASE_URL: databaseUrl ? 'Set' : 'Missing',
          NEXTAUTH_URL: nextAuthUrl ? 'Set' : 'Missing',
          NEXTAUTH_SECRET: nextAuthSecret ? 'Set' : 'Missing',
          NODE_ENV: process.env.NODE_ENV
        },
        database: {
          users: userCount,
          vehicles: vehicleCount,
          trips: tripCount,
          connection: 'Working'
        }
      }
    })
  } catch (error) {
    console.error('System test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'System check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure to run the SQL script in Supabase to create database tables'
    }, { status: 500 })
  }
}
