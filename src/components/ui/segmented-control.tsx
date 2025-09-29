import * as React from 'react'
import { cn } from '@/lib/utils'

type Option = { label: string; value: string }

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: Option[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex rounded-lg bg-muted p-1', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'min-w-24 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              active ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
