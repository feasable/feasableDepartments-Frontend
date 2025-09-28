import Link from 'next/link'

interface DepartmentCardProps {
  title: string
  description: string
  icon: string
  href: string
  status?: 'active' | 'beta' | 'coming_soon'
  tasks?: number
}

export default function DepartmentCard({
  title,
  description,
  icon,
  href,
  status = 'active',
  tasks = 0
}: DepartmentCardProps) {
  const isDisabled = status === 'coming_soon'
  
  const StatusBadge = () => {
    if (status === 'beta') {
      return (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-mono bg-yellow-100 text-yellow-800 rounded">
          BETA
        </span>
      )
    }
    if (status === 'coming_soon') {
      return (
        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded">
          SOON
        </span>
      )
    }
    return null
  }

  const CardContent = () => (
    <div className={`relative p-6 rounded-lg border-2 border-border bg-white dark:bg-gray-900 department-card sketch-border ${
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'
    }`}>
      <StatusBadge />
      
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {tasks > 0 && (
          <div className="px-2 py-1 bg-primary/10 rounded-full">
            <span className="text-xs font-mono font-bold">{tasks}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold font-mono mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      
      {!isDisabled && (
        <div className="mt-4 text-sm font-mono text-primary">
          View Department →
        </div>
      )}
    </div>
  )

  if (isDisabled) {
    return <CardContent />
  }

  return (
    <Link href={href}>
      <CardContent />
    </Link>
  )
}
