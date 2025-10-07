import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin User',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create driver users
  const driver1Password = await bcrypt.hash('driver123', 10)
  const driver1 = await prisma.user.upsert({
    where: { username: 'driver1' },
    update: {},
    create: {
      name: 'John Driver',
      username: 'driver1',
      password: driver1Password,
      role: 'DRIVER',
    },
  })

  const driver2Password = await bcrypt.hash('driver123', 10)
  const driver2 = await prisma.user.upsert({
    where: { username: 'driver2' },
    update: {},
    create: {
      name: 'Jane Driver',
      username: 'driver2',
      password: driver2Password,
      role: 'DRIVER',
    },
  })

  // Create vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { vehicleNo: 'CAR-001' },
    update: {},
    create: {
      vehicleNo: 'CAR-001',
      currentKm: 15000,
      status: 'AVAILABLE',
    },
  })

  const vehicle2 = await prisma.vehicle.upsert({
    where: { vehicleNo: 'CAR-002' },
    update: {},
    create: {
      vehicleNo: 'CAR-002',
      currentKm: 22000,
      status: 'AVAILABLE',
    },
  })

  const vehicle3 = await prisma.vehicle.upsert({
    where: { vehicleNo: 'TRUCK-001' },
    update: {},
    create: {
      vehicleNo: 'TRUCK-001',
      currentKm: 45000,
      status: 'AVAILABLE',
    },
  })

  console.log('Seed data created successfully!')
  console.log('Admin credentials: admin / admin123')
  console.log('Driver credentials: driver1 / driver123, driver2 / driver123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
