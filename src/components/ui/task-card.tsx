import * as React from 'react'
import { cn } from '@/lib/utils'

export type TaskCardProps = {
  title: string
  description: string
  status: 'queued' | 'in_progress' | 'blocked' | 'completed' | string
  priority: 'low' | 'medium' | 'high' | string
  createdAt?: string
  className?: string
  onClick?: () => void
}

function statusClasses(status: string) {
  switch (status) {
    case 'completed':
      return 'text-green-700 bg-green-100 border-green-200 dark:text-green-200 dark:bg-green-900/30 dark:border-green-800'
    case 'in_progress':
      return 'text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
    case 'queued':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800'
    case 'blocked':
      return 'text-red-700 bg-red-100 border-red-200 dark:text-red-200 dark:bg-red-900/30 dark:border-red-800'
    default:
      return 'text-foreground bg-muted border-border'
  }
}

function priorityDot(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'low':
      return 'bg-green-500'
    default:
      return 'bg-gray-400'
  }
}

export function TaskCard({ title, description, status, priority, createdAt, className, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-900 sketch-border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-default',
        className
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-mono font-bold line-clamp-1">{title}</h3>
        <span className={cn('text-xs px-2 py-0.5 rounded border font-mono', statusClasses(status))}>{status}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className={cn('inline-block w-2 h-2 rounded-full', priorityDot(priority))} />
          <span>Priority: {priority}</span>
        </div>
        {createdAt && <span>{new Date(createdAt).toLocaleDateString()}</span>}
      </div>
    </div>
  )
}
