'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId } from '@/lib/tenant'
import { analytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'

export default function NewTaskPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('marketing')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      const supabase = createClient()
      const biz = getBusinessId()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !biz) {
        router.push('/auth')
        return
      }
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          business_id: biz,
          created_by: user.id,
          title,
          description,
          department,
          status: 'queued',
        })
        .select('id')
        .single()
      if (error) throw error
      analytics.track('task_created', { id: data.id, department })
      router.push('/dashboard')
    } catch (e) {
      // noop error toast for brevity
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create Task</h1>
      <div className="space-y-2">
        <label className="text-sm">Title</label>
        <input className="w-full border rounded-md px-3 py-2 bg-background" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Description</label>
        <textarea className="w-full border rounded-md px-3 py-2 bg-background" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Department</label>
        <select className="w-full border rounded-md px-3 py-2 bg-background" value={department} onChange={e => setDepartment(e.target.value)}>
          <option value="marketing">Marketing</option>
          <option value="analytics">Analytics</option>
          <option value="project">Project</option>
        </select>
      </div>
      <div>
        <button disabled={saving} className="px-6 py-2 rounded-full bg-primary text-primary-foreground" onClick={save}>
          {saving ? 'Saving...' : 'Create Task'}
        </button>
      </div>
    </div>
  )
}
