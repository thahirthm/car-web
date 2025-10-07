import { signOut } from 'next-auth/react'

interface DashboardHeaderProps {
  title: string
  userName?: string
  subtitle?: string
}

export default function DashboardHeader({ title, userName, subtitle }: DashboardHeaderProps) {
  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50 animate-slide-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">
              {title}
            </h1>
            {userName && (
              <p className="text-white/70 mt-1 font-medium">
                Welcome back, <span className="text-white/90">{userName}</span>
              </p>
            )}
            {subtitle && (
              <p className="text-sm text-white/60 mt-1">{subtitle}</p>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 border border-white/10 hover:scale-105 active:scale-95 animate-fade-in"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
