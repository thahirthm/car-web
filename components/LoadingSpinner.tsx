interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`rounded-full border-2 border-white/30 border-t-white animate-spin ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-3 text-sm text-white/80 font-medium animate-fade-in">
          {text}
        </p>
      )}
    </div>
  )
}
