'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Vehicle {
  id: number
  vehicleNo: string
  currentKm: number
  status: 'AVAILABLE' | 'RUNNING'
}

interface Trip {
  id: number
  startKm: number
  endKm?: number
  distance?: number
  status: 'RUNNING' | 'COMPLETED'
  startTime: string
  endTime?: string
  vehicle: {
    id: number
    vehicleNo: string
  }
}

export default function DriverDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'DRIVER') {
      router.push('/login')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [vehiclesRes, tripsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/trips')
      ])

      if (vehiclesRes.ok && tripsRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        const tripsData = await tripsRes.json()
        setVehicles(vehiclesData)
        setTrips(tripsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTrip = async (vehicleId: number, startKm: number) => {
    setActionLoading(vehicleId)
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, startKm })
      })

      if (response.ok) {
        await fetchData() // Refresh data
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to start trip')
      }
    } catch (error) {
      console.error('Error starting trip:', error)
      alert('Failed to start trip')
    } finally {
      setActionLoading(null)
    }
  }

  const endTrip = async (tripId: number, endKm: number) => {
    setActionLoading(tripId)
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endKm })
      })

      if (response.ok) {
        await fetchData() // Refresh data
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to end trip')
      }
    } catch (error) {
      console.error('Error ending trip:', error)
      alert('Failed to end trip')
    } finally {
      setActionLoading(null)
    }
  }

  const runningTrip = trips.find(trip => trip.status === 'RUNNING')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10 animate-fade-in">
          <div className="glass rounded-3xl p-12">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Loading Dashboard...</h1>
            <p className="text-white/70">Please wait while we prepare your data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50 animate-slide-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">
                Driver Dashboard
              </h1>
              <p className="text-white/70 mt-1 font-medium">
                Welcome back, <span className="text-white/90">{session?.user?.name}</span>
              </p>
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

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Running Trip Alert */}
        {runningTrip && (
          <div className="mb-8 glass rounded-2xl p-6 border border-blue-400/20 animate-scale-in">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🚗 Trip in Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-white/70 text-xs uppercase tracking-wide font-medium">Vehicle</p>
                    <p className="text-white font-semibold">{runningTrip.vehicle.vehicleNo}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-white/70 text-xs uppercase tracking-wide font-medium">Start KM</p>
                    <p className="text-white font-semibold">{runningTrip.startKm} km</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-white/70 text-xs uppercase tracking-wide font-medium">Started</p>
                    <p className="text-white font-semibold">{new Date(runningTrip.startTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Grid */}
        <div className="px-4 py-6 sm:px-0 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Available Vehicles</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="animate-scale-in">
                <VehicleCard
                  vehicle={vehicle}
                  runningTrip={runningTrip}
                  onStartTrip={startTrip}
                  onEndTrip={endTrip}
                  loading={actionLoading === vehicle.id || actionLoading === runningTrip?.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        <div className="px-4 py-6 sm:px-0 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Recent Trips</h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {trips.slice(0, 5).map((trip) => (
                <div
                  key={trip.id}
                  className="px-6 py-4 hover:bg-white/5 transition-colors duration-200 animate-slide-in"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          trip.status === 'RUNNING'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {trip.vehicle.vehicleNo}
                        </div>
                        <div className="text-sm text-white/60">
                          {new Date(trip.startTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white/80">
                      {trip.distance ? `${trip.distance} km` : (
                        <span className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                          In progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

interface VehicleCardProps {
  vehicle: Vehicle
  runningTrip?: Trip
  onStartTrip: (vehicleId: number, startKm: number) => void
  onEndTrip: (tripId: number, endKm: number) => void
  loading: boolean
}

function VehicleCard({ vehicle, runningTrip, onStartTrip, onEndTrip, loading }: VehicleCardProps) {
  const [startKm, setStartKm] = useState('')
  const [endKm, setEndKm] = useState('')
  const [showStartForm, setShowStartForm] = useState(false)
  const [showEndForm, setShowEndForm] = useState(false)

  const isRunning = vehicle.status === 'RUNNING'
  const isThisVehicleRunning = runningTrip?.vehicle.id === vehicle.id

  const handleStartTrip = () => {
    const km = parseFloat(startKm)
    if (km >= vehicle.currentKm) {
      onStartTrip(vehicle.id, km)
      setStartKm('')
      setShowStartForm(false)
    } else {
      alert(`Start KM must be at least ${vehicle.currentKm}`)
    }
  }

  const handleEndTrip = () => {
    const km = parseFloat(endKm)
    if (runningTrip && km >= runningTrip.startKm) {
      onEndTrip(runningTrip.id, km)
      setEndKm('')
      setShowEndForm(false)
    } else {
      alert(`End KM must be at least ${runningTrip?.startKm}`)
    }
  }

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 hover:scale-110 transition-transform duration-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8z" />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {vehicle.vehicleNo}
            </h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {vehicle.currentKm} km
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white/5 px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            isRunning
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></div>
            {vehicle.status}
          </span>
        </div>

        {!isRunning && !runningTrip && (
          <div>
            {!showStartForm ? (
              <button
                onClick={() => setShowStartForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Start Trip
              </button>
            ) : (
              <div className="space-y-3 animate-scale-in">
                <input
                  type="number"
                  placeholder="Enter start KM"
                  value={startKm}
                  onChange={(e) => setStartKm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  min={vehicle.currentKm}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleStartTrip}
                    disabled={loading || !startKm}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Starting...
                      </div>
                    ) : (
                      'Start'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowStartForm(false)
                      setStartKm('')
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isThisVehicleRunning && runningTrip && (
          <div>
            {!showEndForm ? (
              <button
                onClick={() => setShowEndForm(true)}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                End Trip
              </button>
            ) : (
              <div className="space-y-3 animate-scale-in">
                <input
                  type="number"
                  placeholder="Enter end KM"
                  value={endKm}
                  onChange={(e) => setEndKm(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  min={runningTrip.startKm}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleEndTrip}
                    disabled={loading || !endKm}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Ending...
                      </div>
                    ) : (
                      'End Trip'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowEndForm(false)
                      setEndKm('')
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
