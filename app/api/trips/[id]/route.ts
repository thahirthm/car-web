import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/trips/[id] - End a trip
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'DRIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { endKm } = body
    const resolvedParams = await params
    const tripId = parseInt(resolvedParams.id)

    if (isNaN(tripId) || endKm === undefined) {
      return NextResponse.json({ error: 'Invalid trip ID or end KM' }, { status: 400 })
    }

    // Get the trip with vehicle info
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true }
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // Check if the trip belongs to the current driver
    if (trip.driverId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (trip.status !== 'RUNNING') {
      return NextResponse.json({ error: 'Trip is not running' }, { status: 400 })
    }

    // Validate end KM
    const endKmFloat = parseFloat(endKm)
    if (endKmFloat < trip.startKm) {
      return NextResponse.json({ 
        error: `End KM (${endKmFloat}) cannot be less than start KM (${trip.startKm})` 
      }, { status: 400 })
    }

    // Calculate distance
    const distance = endKmFloat - trip.startKm

    // End transaction to update trip and vehicle
    const result = await prisma.$transaction(async (tx) => {
      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: {
          endKm: endKmFloat,
          distance,
          status: 'COMPLETED',
          endTime: new Date()
        },
        include: {
          driver: { select: { id: true, name: true, username: true } },
          vehicle: { select: { id: true, vehicleNo: true } }
        }
      })

      // Update vehicle current KM and status
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          currentKm: endKmFloat,
          status: 'AVAILABLE'
        }
      })

      return updatedTrip
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error ending trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
