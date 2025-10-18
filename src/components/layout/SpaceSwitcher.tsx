'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId } from '@/lib/tenant'
import { analytics } from '@/lib/analytics'

const DEPARTMENTS = [
  { id: '', name: 'All departments' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'project', name: 'Project' },
]

export function SpaceSwitcher() {
  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (typeof window === 'undefined') return
      let v = ''
      try { v = localStorage.getItem('currentDepartment') || '' } catch {}
      try {
        const supabase = createClient()
        const biz = getBusinessId()
        const { data: { user } } = await supabase.auth.getUser()
        if (user && biz) {
          const { data } = await supabase
            .from('user_workspace_preferences')
            .select('value')
            .eq('user_id', user.id)
            .eq('business_id', biz)
            .eq('key', 'currentDepartment')
            .maybeSingle()
          const pref = (data as any)?.value
          if (pref && typeof pref.department === 'string') v = pref.department
        }
      } catch {}
      setValue(v)
      setLoading(false)
    })()
  }, [])

  const onChange = (v: string) => {
    setValue(v)
    try { localStorage.setItem('currentDepartment', v) } catch {}
    analytics.track('prefs_set', { key: 'currentDepartment', value: v || 'all' })
    ;(async () => {
      try {
        const supabase = createClient()
        const biz = getBusinessId()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !biz) return
        await supabase
          .from('user_workspace_preferences')
          .upsert({ user_id: user.id, business_id: biz, key: 'currentDepartment', value: { department: v } })
      } catch {}
    })()
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground">Department</label>
      <select className="text-sm rounded-md border bg-background px-2 py-1" value={value} onChange={e => onChange(e.target.value)} disabled={loading}>
        {DEPARTMENTS.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    </div>
  )
}
