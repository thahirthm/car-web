interface StatusBadgeProps {
  status: string
  variant?: 'vehicle' | 'trip' | 'user'
}

export default function StatusBadge({ status, variant = 'trip' }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (variant) {
      case 'vehicle':
        return status === 'RUNNING'
          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
          : 'bg-green-500/20 text-green-300 border border-green-500/30'

      case 'trip':
        return status === 'RUNNING'
          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          : 'bg-green-500/20 text-green-300 border border-green-500/30'

      case 'user':
        return status === 'ADMIN'
          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'

      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    }
  }

  const getDotColor = () => {
    switch (variant) {
      case 'vehicle':
        return status === 'RUNNING' ? 'bg-red-400' : 'bg-green-400'
      case 'trip':
        return status === 'RUNNING' ? 'bg-blue-400' : 'bg-green-400'
      case 'user':
        return status === 'ADMIN' ? 'bg-purple-400' : 'bg-blue-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusClasses()}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${getDotColor()} ${status === 'RUNNING' ? 'animate-pulse' : ''}`}></div>
      {status}
    </span>
  )
}
