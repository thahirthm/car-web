import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/trips - Get trips (filtered by role)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const driverId = searchParams.get('driverId')

    let whereClause: any = {}

    // If driver, only show their trips
    if (session.user.role === 'DRIVER') {
      whereClause.driverId = parseInt(session.user.id)
    }

    // Apply filters
    if (vehicleId) {
      whereClause.vehicleId = parseInt(vehicleId)
    }
    if (driverId && session.user.role === 'ADMIN') {
      whereClause.driverId = parseInt(driverId)
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        driver: { select: { id: true, name: true, username: true } },
        vehicle: { select: { id: true, vehicleNo: true } }
      },
      orderBy: { startTime: 'desc' }
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/trips - Start a new trip
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vehicleId, startKm } = body

    if (!vehicleId || startKm === undefined) {
      return NextResponse.json({ error: 'Vehicle ID and start KM are required' }, { status: 400 })
    }

    // Check if vehicle exists and is available
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (vehicle.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'Vehicle is not available' }, { status: 400 })
    }

    // Validate start KM
    const startKmFloat = parseFloat(startKm)
    if (startKmFloat < vehicle.currentKm) {
      return NextResponse.json({ 
        error: `Start KM (${startKmFloat}) cannot be less than current KM (${vehicle.currentKm})` 
      }, { status: 400 })
    }

    // Check if driver has any running trips
    const runningTrip = await prisma.trip.findFirst({
      where: {
        driverId: parseInt(session.user.id),
        status: 'RUNNING'
      }
    })

    if (runningTrip) {
      return NextResponse.json({ error: 'You already have a running trip' }, { status: 400 })
    }

    // Start transaction to create trip and update vehicle status
    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          driverId: parseInt(session.user.id),
          vehicleId: parseInt(vehicleId),
          startKm: startKmFloat,
          status: 'RUNNING'
        },
        include: {
          driver: { select: { id: true, name: true, username: true } },
          vehicle: { select: { id: true, vehicleNo: true } }
        }
      })

      await tx.vehicle.update({
        where: { id: parseInt(vehicleId) },
        data: { status: 'RUNNING' }
      })

      return trip
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error starting trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
