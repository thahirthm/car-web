import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/vehicles/[id] - Update a vehicle (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vehicleNo, currentKm, status } = body
    const resolvedParams = await params
    const vehicleId = parseInt(resolvedParams.id)

    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: 'Invalid vehicle ID' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(vehicleNo && { vehicleNo }),
        ...(currentKm !== undefined && { currentKm: parseFloat(currentKm) }),
        ...(status && { status })
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Vehicle number already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/vehicles/[id] - Delete a vehicle (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const vehicleId = parseInt(resolvedParams.id)

    if (isNaN(vehicleId)) {
      return NextResponse.json({ error: 'Invalid vehicle ID' }, { status: 400 })
    }

    // Check if vehicle has any trips
    const tripCount = await prisma.trip.count({
      where: { vehicleId }
    })

    if (tripCount > 0) {
      return NextResponse.json({ error: 'Cannot delete vehicle with existing trips' }, { status: 400 })
    }

    await prisma.vehicle.delete({
      where: { id: vehicleId }
    })

    return NextResponse.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
