import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const vehicleCount = await prisma.vehicle.count()
    const tripCount = await prisma.trip.count()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      data: {
        users: userCount,
        vehicles: vehicleCount,
        trips: tripCount
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
