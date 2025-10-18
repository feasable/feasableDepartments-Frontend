'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId } from '@/lib/tenant'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { analytics } from '@/lib/analytics'
import { backend } from '@/lib/api'

interface Task {
  id: string
  title: string
  description: string
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  priority: string | null
  department: string | null
  created_at: string
}

export default function TasksListPage() {
  const router = useRouter()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [depart, setDepart] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const id = getBusinessId()
    setBusinessId(id)
    if (!id) {
      router.replace('/dashboard')
      return
    }
    analytics.track('tasks_list_viewed')
    fetchTasks(id)
    const supabase = createClient()
    const channel = supabase
      .channel('tasks-list-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `business_id=eq.${id}` }, () => fetchTasks(id))
      .subscribe()
    return () => channel.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTasks = async (id: string) => {
    setLoading(true)
    try {
      const data = await backend<{ tasks: Task[] }>(`/v1/tasks?businessId=${id}&limit=100`)
      setTasks(data.tasks || [])
    } catch {
      const supabase = createClient()
      const { data } = await supabase
        .from('tasks')
        .select('id,title,description,status,priority,department,created_at')
        .eq('business_id', id)
        .order('created_at', { ascending: false })
        .limit(100)
      setTasks((data as Task[]) || [])
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let list = tasks
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
    }
    if (depart) list = list.filter(t => (t.department || '') === depart)
    if (status) list = list.filter(t => t.status === status)
    return list
  }, [tasks, query, depart, status])

  const updateStatus = async (task: Task, next: Task['status']) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('tasks').update({ status: next }).eq('id', task.id)
      if (error) throw error
    } catch {}
  }

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto py-4 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div className="flex items-center gap-2">
            <input
              placeholder="Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            />
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={depart} onChange={e => setDepart(e.target.value)}>
              <option value="">All departments</option>
              <option value="marketing">Marketing</option>
              <option value="analytics">Analytics</option>
              <option value="project">Project</option>
            </select>
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All status</option>
              <option value="queued">Queued</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-12 text-xs uppercase text-muted-foreground px-4 py-2 bg-muted/40">
            <div className="col-span-4">Title</div>
            <div className="col-span-3">Department</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No tasks found</div>
          ) : (
            <ul>
              {filtered.map((t) => (
                <li key={t.id} className="grid grid-cols-12 items-center px-4 py-3 border-t hover:bg-muted/30">
                  <div className="col-span-4">
                    <div className="font-medium truncate">{t.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{t.description}</div>
                  </div>
                  <div className="col-span-3 capitalize text-sm">{t.department || '—'}</div>
                  <div className="col-span-2 capitalize text-sm">{t.status.replace('_',' ')}</div>
                  <div className="col-span-3 text-right">
                    {t.status !== 'completed' && (
                      <button className="text-xs px-2 py-1 rounded-md border mr-2" onClick={() => updateStatus(t, 'completed')}>Mark done</button>
                    )}
                    {t.status !== 'in_progress' && (
                      <button className="text-xs px-2 py-1 rounded-md border mr-2" onClick={() => updateStatus(t, 'in_progress')}>Start</button>
                    )}
                    {t.status !== 'failed' && (
                      <button className="text-xs px-2 py-1 rounded-md border mr-2" onClick={() => updateStatus(t, 'failed')}>Fail</button>
                    )}
                    {t.status !== 'cancelled' && (
                      <button className="text-xs px-2 py-1 rounded-md border" onClick={() => updateStatus(t, 'cancelled')}>Cancel</button>
                    )}
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
