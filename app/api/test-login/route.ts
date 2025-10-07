import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user) {
      return NextResponse.json({
        status: 'error',
        message: 'User not found',
        debug: { username, userExists: false }
      })
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    return NextResponse.json({
      status: passwordMatch ? 'success' : 'error',
      message: passwordMatch ? 'Login successful' : 'Password mismatch',
      debug: {
        username,
        userExists: true,
        passwordMatch,
        storedPasswordHash: user.password.substring(0, 20) + '...',
        role: user.role
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Login test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        password: true
      }
    })
    
    return NextResponse.json({
      status: 'success',
      message: 'All users in database',
      users: users.map(user => ({
        ...user,
        password: user.password.substring(0, 20) + '...' // Show partial hash for security
      }))
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
