'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId } from '@/lib/tenant'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { analytics } from '@/lib/analytics'
import Link from 'next/link'

interface TemplateRow {
  id: string
  business_id: string
  department: string | null
  title: string
  default_payload: any
  created_by: string
  created_at: string
}

export default function TemplatesPage() {
  const [bizId, setBizId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<TemplateRow[]>([])
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const id = getBusinessId()
    setBizId(id)
    if (!id) return
    analytics.track('templates_list_viewed')
    void fetchRows(id)
  }, [])

  const fetchRows = async (id: string) => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('task_templates')
      .select('id,business_id,department,title,default_payload,created_by,created_at')
      .eq('business_id', id)
      .order('created_at', { ascending: false })
    setRows((data as any[]) || [])
    setLoading(false)
  }

  const addTemplate = async () => {
    if (!bizId) return
    if (!title.trim()) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const payload = { title, description: desc, department: department || null }
      const { error } = await supabase
        .from('task_templates')
        .insert({
          business_id: bizId,
          department: department || null,
          title,
          default_payload: payload,
          created_by: user.id,
        })
      if (error) throw error
      analytics.track('template_created')
      setTitle('')
      setDepartment('')
      setDesc('')
      void fetchRows(bizId)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  const removeTemplate = async (id: string) => {
    if (!bizId) return
    try {
      const supabase = createClient()
      await supabase.from('task_templates').delete().eq('id', id)
      analytics.track('template_deleted')
      void fetchRows(bizId)
    } catch {}
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Templates</h1>
          <Link href="/tasks/new" className="text-sm text-primary hover:underline">Create task</Link>
        </div>

        <div className="bg-card border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">New Template</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Title</label>
              <input className="w-full border rounded-md px-3 py-2 bg-background" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Department</label>
              <select className="w-full border rounded-md px-3 py-2 bg-background" value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="">All</option>
                <option value="marketing">Marketing</option>
                <option value="analytics">Analytics</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm">Default Description</label>
              <textarea className="w-full border rounded-md px-3 py-2 bg-background" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
          </div>
          <div>
            <button disabled={saving} className="px-4 py-2 rounded-md border" onClick={addTemplate}>{saving ? 'Saving...' : 'Add Template'}</button>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Your Templates</h2>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted-foreground">No templates yet</div>
          ) : (
            <ul className="divide-y">
              {rows.map(t => (
                <li key={t.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">{t.department || 'All departments'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link className="text-sm underline" href={`/tasks/new?template=${t.id}`}>Use</Link>
                    <button className="text-sm text-destructive" onClick={() => removeTemplate(t.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
