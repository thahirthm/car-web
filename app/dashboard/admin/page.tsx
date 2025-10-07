'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Vehicle {
  id: number
  vehicleNo: string
  currentKm: number
  status: 'AVAILABLE' | 'RUNNING'
  createdAt: string
  updatedAt: string
}

interface User {
  id: number
  name: string
  username: string
  role: 'ADMIN' | 'DRIVER'
  createdAt: string
  updatedAt: string
}

interface Trip {
  id: number
  startKm: number
  endKm?: number
  distance?: number
  status: 'RUNNING' | 'COMPLETED'
  startTime: string
  endTime?: string
  driver: {
    id: number
    name: string
    username: string
  }
  vehicle: {
    id: number
    vehicleNo: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'trips' | 'vehicles' | 'users'>('trips')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    vehicleId: '',
    driverId: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [vehiclesRes, usersRes, tripsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/users'),
        fetch('/api/trips')
      ])

      if (vehiclesRes.ok && usersRes.ok && tripsRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        const usersData = await usersRes.json()
        const tripsData = await tripsRes.json()
        setVehicles(vehiclesData)
        setUsers(usersData)
        setTrips(tripsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = trips.filter(trip => {
    if (filters.vehicleId && trip.vehicle.id !== parseInt(filters.vehicleId)) return false
    if (filters.driverId && trip.driver.id !== parseInt(filters.driverId)) return false
    return true
  })

  const exportToCSV = () => {
    const csvContent = [
      ['Trip ID', 'Driver', 'Vehicle', 'Start KM', 'End KM', 'Distance', 'Status', 'Start Time', 'End Time'],
      ...filteredTrips.map(trip => [
        trip.id,
        trip.driver.name,
        trip.vehicle.vehicleNo,
        trip.startKm,
        trip.endKm || '',
        trip.distance || '',
        trip.status,
        new Date(trip.startTime).toLocaleString(),
        trip.endTime ? new Date(trip.endTime).toLocaleString() : ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trips-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
            <h1 className="text-2xl font-bold text-white mb-2">Loading Admin Dashboard...</h1>
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
                Admin Dashboard
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-slide-in">
        <div className="glass rounded-2xl mt-6 p-2">
          <nav className="flex space-x-2">
            {[
              { key: 'trips', label: 'Trips', icon: '📊' },
              { key: 'vehicles', label: 'Vehicles', icon: '🚗' },
              { key: 'users', label: 'Users', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'trips' | 'vehicles' | 'users')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div className="px-4 py-6 sm:px-0 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Trip Management</h2>
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200 flex items-center hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-6 mb-8 animate-scale-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Filter by Vehicle
                  </label>
                  <select
                    value={filters.vehicleId}
                    onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-white">All Vehicles</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id} className="bg-gray-800 text-white">
                        {vehicle.vehicleNo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    Filter by Driver
                  </label>
                  <select
                    value={filters.driverId}
                    onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800 text-white">All Drivers</option>
                    {users.filter(user => user.role === 'DRIVER').map((driver) => (
                      <option key={driver.id} value={driver.id} className="bg-gray-800 text-white">
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ vehicleId: '', driverId: '' })}
                    className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl text-sm font-semibold border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Trips Table */}
            <div className="glass rounded-2xl overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                        Distance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredTrips.map((trip) => (
                      <tr
                        key={trip.id}
                        className="hover:bg-white/5 transition-colors duration-200 animate-fade-in"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          {trip.driver.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {trip.vehicle.vehicleNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {trip.distance ? `${trip.distance} km` : (
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                              In progress
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            trip.status === 'RUNNING'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${trip.status === 'RUNNING' ? 'bg-blue-400' : 'bg-green-400'} animate-pulse`}></div>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {new Date(trip.startTime).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="animate-fade-in">
            <VehicleManagement vehicles={vehicles} onRefresh={fetchData} />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <UserManagement users={users} onRefresh={fetchData} />
          </div>
        )}
      </main>
    </div>
  )
}

// Vehicle Management Component
function VehicleManagement({ vehicles, onRefresh }: { vehicles: Vehicle[], onRefresh: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ vehicleNo: '', currentKm: '' })
  const [loading, setLoading] = useState(false)

  const addVehicle = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle)
      })

      if (response.ok) {
        setNewVehicle({ vehicleNo: '', currentKm: '' })
        setShowAddForm(false)
        onRefresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add vehicle')
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Vehicle Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center hover:scale-105 active:scale-95"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showAddForm && (
        <div className="glass rounded-2xl p-6 mb-8 animate-scale-in">
          <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Add New Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Vehicle Number
              </label>
              <input
                type="text"
                value={newVehicle.vehicleNo}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNo: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                placeholder="e.g., CAR-003"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Current KM
              </label>
              <input
                type="number"
                value={newVehicle.currentKm}
                onChange={(e) => setNewVehicle({ ...newVehicle, currentKm: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={addVehicle}
              disabled={loading || !newVehicle.vehicleNo || !newVehicle.currentKm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewVehicle({ vehicleNo: '', currentKm: '' })
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current KM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vehicle.vehicleNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.currentKm} km
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vehicle.status === 'RUNNING' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vehicle.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// User Management Component
function UserManagement({ users, onRefresh }: { users: User[], onRefresh: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'DRIVER' })
  const [loading, setLoading] = useState(false)

  const addUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        setNewUser({ name: '', username: '', password: '', role: 'DRIVER' })
        setShowAddForm(false)
        onRefresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add user')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('Failed to add user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'DRIVER' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="DRIVER">Driver</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={addUser}
              disabled={loading || !newUser.name || !newUser.username || !newUser.password}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewUser({ name: '', username: '', password: '', role: 'DRIVER' })
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
