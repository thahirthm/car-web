// Shared TypeScript interfaces for the application

export interface Vehicle {
  id: number
  vehicleNo: string
  currentKm: number
  status: 'AVAILABLE' | 'RUNNING'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  name: string
  username: string
  role: 'ADMIN' | 'DRIVER'
  createdAt: string
  updatedAt: string
}

export interface Trip {
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

export interface TripFormData {
  vehicleId: number
  startKm?: number
  endKm?: number
}

export interface VehicleFormData {
  vehicleNo: string
  currentKm: number
}

export interface UserFormData {
  name: string
  username: string
  password: string
  role: 'ADMIN' | 'DRIVER'
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface FilterOptions {
  vehicleId?: string
  driverId?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}
