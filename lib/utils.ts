// Utility functions for the application

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function generateReportData(trips: any[]) {
  return trips.map(trip => ({
    'Trip ID': trip.id,
    'Driver': trip.driver.name,
    'Vehicle': trip.vehicle.vehicleNo,
    'Start KM': trip.startKm,
    'End KM': trip.endKm || 'N/A',
    'Distance': trip.distance ? `${trip.distance} km` : 'N/A',
    'Status': trip.status,
    'Start Time': new Date(trip.startTime).toLocaleString(),
    'End Time': trip.endTime ? new Date(trip.endTime).toLocaleString() : 'N/A',
    'Duration': trip.endTime 
      ? `${Math.round((new Date(trip.endTime).getTime() - new Date(trip.startTime).getTime()) / (1000 * 60))} minutes`
      : 'N/A'
  }))
}

export function calculateTripStats(trips: any[]) {
  const completedTrips = trips.filter(trip => trip.status === 'COMPLETED')
  const runningTrips = trips.filter(trip => trip.status === 'RUNNING')
  
  const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0)
  const averageDistance = completedTrips.length > 0 ? totalDistance / completedTrips.length : 0
  
  return {
    totalTrips: trips.length,
    completedTrips: completedTrips.length,
    runningTrips: runningTrips.length,
    totalDistance: Math.round(totalDistance * 100) / 100,
    averageDistance: Math.round(averageDistance * 100) / 100
  }
}

export function getVehicleStats(vehicles: any[], trips: any[]) {
  return vehicles.map(vehicle => {
    const vehicleTrips = trips.filter(trip => trip.vehicle.id === vehicle.id)
    const completedTrips = vehicleTrips.filter(trip => trip.status === 'COMPLETED')
    const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0)
    
    return {
      ...vehicle,
      totalTrips: vehicleTrips.length,
      totalDistance: Math.round(totalDistance * 100) / 100,
      utilizationRate: vehicleTrips.length > 0 ? (completedTrips.length / vehicleTrips.length) * 100 : 0
    }
  })
}

export function getDriverStats(users: any[], trips: any[]) {
  const drivers = users.filter(user => user.role === 'DRIVER')
  
  return drivers.map(driver => {
    const driverTrips = trips.filter(trip => trip.driver.id === driver.id)
    const completedTrips = driverTrips.filter(trip => trip.status === 'COMPLETED')
    const totalDistance = completedTrips.reduce((sum, trip) => sum + (trip.distance || 0), 0)
    
    return {
      ...driver,
      totalTrips: driverTrips.length,
      completedTrips: completedTrips.length,
      totalDistance: Math.round(totalDistance * 100) / 100,
      averageDistance: completedTrips.length > 0 ? Math.round((totalDistance / completedTrips.length) * 100) / 100 : 0
    }
  })
}

export function filterTrips(trips: any[], filters: any) {
  return trips.filter(trip => {
    if (filters.vehicleId && trip.vehicle.id !== parseInt(filters.vehicleId)) return false
    if (filters.driverId && trip.driver.id !== parseInt(filters.driverId)) return false
    if (filters.status && trip.status !== filters.status) return false
    if (filters.dateFrom && new Date(trip.startTime) < new Date(filters.dateFrom)) return false
    if (filters.dateTo && new Date(trip.startTime) > new Date(filters.dateTo)) return false
    return true
  })
}

export function sortTrips(trips: any[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') {
  return [...trips].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.startTime).getTime()
        bValue = new Date(b.startTime).getTime()
        break
      case 'distance':
        aValue = a.distance || 0
        bValue = b.distance || 0
        break
      case 'driver':
        aValue = a.driver.name.toLowerCase()
        bValue = b.driver.name.toLowerCase()
        break
      case 'vehicle':
        aValue = a.vehicle.vehicleNo.toLowerCase()
        bValue = b.vehicle.vehicleNo.toLowerCase()
        break
      default:
        return 0
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}
