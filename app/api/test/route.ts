import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if environment variables are available
    const databaseUrl = process.env.DATABASE_URL
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET

    return NextResponse.json({
      status: 'success',
      message: 'Environment check',
      data: {
        DATABASE_URL: databaseUrl ? 'Set' : 'Missing',
        NEXTAUTH_URL: nextAuthUrl ? 'Set' : 'Missing',
        NEXTAUTH_SECRET: nextAuthSecret ? 'Set' : 'Missing',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Environment test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Environment check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
