"use client"

import React from 'react'
import clsx from 'clsx'

export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4" aria-label="progress">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            'h-2 w-2 rounded-full transition-all',
            i === current ? 'bg-foreground scale-110' : 'bg-muted'
          )}
        />
      ))}
    </div>
  )
}
