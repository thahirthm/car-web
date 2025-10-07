'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (session) {
      // Redirect based on role
      if (session.user.role === 'ADMIN') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard/driver')
      }
    } else {
      // Not authenticated, redirect to login
      router.push('/login')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="text-center relative z-10 animate-fade-in">
        <div className="glass rounded-3xl p-12 max-w-md mx-auto">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/25 animate-scale-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight mb-6 animate-slide-in">
            Vehicle KM Tracker
          </h1>

          <div className="flex items-center justify-center space-x-2 text-white/80 animate-fade-in">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full animate-pulse delay-300"></div>
            <span className="ml-3 font-medium">Redirecting...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

