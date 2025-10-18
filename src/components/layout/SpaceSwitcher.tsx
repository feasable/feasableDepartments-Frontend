'use client'

import { useEffect, useState } from 'react'

const DEPARTMENTS = [
  { id: '', name: 'All departments' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'project', name: 'Project' },
]

export function SpaceSwitcher() {
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const v = localStorage.getItem('currentDepartment') || ''
      setValue(v)
    } catch {}
  }, [])

  const onChange = (v: string) => {
    setValue(v)
    try { localStorage.setItem('currentDepartment', v) } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground">Department</label>
      <select className="text-sm rounded-md border bg-background px-2 py-1" value={value} onChange={e => onChange(e.target.value)}>
        {DEPARTMENTS.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  )
}
