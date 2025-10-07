// Validation functions for business logic

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateStartTrip(
  startKm: number, 
  vehicleCurrentKm: number, 
  vehicleStatus: string
): ValidationResult {
  if (vehicleStatus !== 'AVAILABLE') {
    return {
      isValid: false,
      error: 'Vehicle is not available for trips'
    }
  }

  if (startKm < vehicleCurrentKm) {
    return {
      isValid: false,
      error: `Start KM (${startKm}) cannot be less than current vehicle KM (${vehicleCurrentKm})`
    }
  }

  if (startKm < 0) {
    return {
      isValid: false,
      error: 'Start KM cannot be negative'
    }
  }

  return { isValid: true }
}

export function validateEndTrip(
  endKm: number, 
  startKm: number, 
  tripStatus: string
): ValidationResult {
  if (tripStatus !== 'RUNNING') {
    return {
      isValid: false,
      error: 'Trip is not currently running'
    }
  }

  if (endKm < startKm) {
    return {
      isValid: false,
      error: `End KM (${endKm}) cannot be less than start KM (${startKm})`
    }
  }

  if (endKm < 0) {
    return {
      isValid: false,
      error: 'End KM cannot be negative'
    }
  }

  return { isValid: true }
}

export function validateVehicleData(vehicleNo: string, currentKm: number): ValidationResult {
  if (!vehicleNo || vehicleNo.trim().length === 0) {
    return {
      isValid: false,
      error: 'Vehicle number is required'
    }
  }

  if (vehicleNo.length < 3) {
    return {
      isValid: false,
      error: 'Vehicle number must be at least 3 characters long'
    }
  }

  if (currentKm < 0) {
    return {
      isValid: false,
      error: 'Current KM cannot be negative'
    }
  }

  return { isValid: true }
}

export function validateUserData(
  name: string, 
  username: string, 
  password: string, 
  role: string
): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Name is required'
    }
  }

  if (!username || username.trim().length === 0) {
    return {
      isValid: false,
      error: 'Username is required'
    }
  }

  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username must be at least 3 characters long'
    }
  }

  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required'
    }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long'
    }
  }

  if (!['ADMIN', 'DRIVER'].includes(role)) {
    return {
      isValid: false,
      error: 'Invalid role specified'
    }
  }

  return { isValid: true }
}

export function calculateDistance(startKm: number, endKm: number): number {
  return Math.round((endKm - startKm) * 100) / 100 // Round to 2 decimal places
}

export function formatDistance(distance: number): string {
  return `${distance.toFixed(2)} km`
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

export function isValidKmReading(km: number): boolean {
  return km >= 0 && km <= 9999999 // Max 7 digits
}

export function sanitizeKmInput(input: string): number {
  const parsed = parseFloat(input)
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
}
