'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId, setBusinessId } from '@/lib/tenant'
import { analytics } from '@/lib/analytics'

interface Biz { id: string; name: string }

export function WorkspaceSwitcher() {
  const [businesses, setBusinesses] = useState<Biz[]>([])
  const [current, setCurrent] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    setCurrent(getBusinessId())
    ;(async () => {
      try {
        const { data } = await supabase
          .from('businesses')
          .select('id,name')
          .order('name', { ascending: true })
        setBusinesses((data as Biz[]) || [])
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  if (businesses.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground">Workspace</label>
      <select
        className="text-sm rounded-md border bg-background px-2 py-1"
        value={current || ''}
        onChange={(e) => {
          const id = e.target.value
          setCurrent(id)
          setBusinessId(id)
          analytics.track('workspace_switched', { businessId: id })
          window.location.reload()
        }}
      >
        {businesses.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
    </div>
  )
}
