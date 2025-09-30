'use client'

import { useEffect, useMemo, useState } from 'react'
import { backend } from '@/lib/api'
import { getBusinessId } from '@/lib/tenant'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { CardSkeleton } from '@/components/ui/skeleton'
import { GlassButton } from '@/components/ui/glass-button'
import { TaskCard } from '@/components/ui/task-card'
import { createClient } from '@/lib/supabase/client'
import { ensureUserBusiness } from '@/lib/auth-helpers'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  created_at: string
}

export default function MarketingDepartmentPage() {
  const router = useRouter()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [business, setBusiness] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' })
  const [statusFilter, setStatusFilter] = useState<'all' | 'queued' | 'in_progress' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  useEffect(() => {
    const id = getBusinessId()
    setBusinessId(id)
  }, [])

  // If no local businessId, try to ensure one for signed-in user; else redirect to login
  useEffect(() => {
    if (businessId !== null) return
    const tryEnsure = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      try {
        const id = await ensureUserBusiness()
        setBusinessId(id)
      } catch (e: any) {
        // If no workspace, redirect to dashboard which will show onboarding
        if (e.message === 'NO_WORKSPACE') {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      }
    }
    tryEnsure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId])

  useEffect(() => {
    if (!businessId) return
    const run = async () => {
      setLoadingList(true)
      try {
        const biz = await backend(`/v1/businesses/${businessId}`)
        setBusiness(biz)
        const list = await backend<{ tasks: Task[] }>(
          `/v1/tasks?businessId=${businessId}&department=marketing&limit=20`
        )
        setTasks(list.tasks || [])
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load department')
      } finally {
        setLoadingList(false)
      }
    }
    run()
  }, [businessId])

  const canCreate = useMemo(() => form.title.trim().length >= 3 && form.description.trim().length >= 5, [form])

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const statusOk = statusFilter === 'all' || t.status === statusFilter
      const priorityOk = priorityFilter === 'all' || t.priority === priorityFilter
      return statusOk && priorityOk
    })
  }, [tasks, statusFilter, priorityFilter])

  const create = async () => {
    if (!businessId) return toast.error('No business selected')
    setLoading(true)
    try {
      const created = await backend<{ id: string }>(`/v1/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          priority: form.priority,
          department: 'marketing',
          businessId,
        }),
      })
      toast.success('Task created')
      setForm({ title: '', description: '', priority: 'medium' })
      const list = await backend<{ tasks: Task[] }>(
        `/v1/tasks?businessId=${businessId}&department=marketing&limit=20`
      )
      setTasks(list.tasks || [])
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  if (!businessId) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow sketch-border text-center">
          <p className="mb-4">No workspace found. Please complete signup.</p>
          <Link className="text-primary underline" href="/signup">Go to signup</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid-bg py-10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-mono font-bold">Marketing Space</h1>
              <p className="text-sm text-muted-foreground">Plan: {business?.plan || 'free'} · Credits: {business?.message_credits ?? 0}</p>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Create tasks for content, campaigns, analytics. Save time by using templates below.</p>
        </motion.div>

        {/* Create task */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 sketch-border rounded-lg p-6 mb-8">
          <h2 className="font-mono font-bold mb-4">Create a task</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <select
              className="px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <textarea
              className="sm:col-span-2 px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
              rows={3}
              placeholder="Describe the task"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
            {/* Templates */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                'Write a blog post on AI productivity',
                'Create a 7-day launch plan for Product Hunt',
                'Draft a 10-post Twitter thread about our MVP'
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ title: t, description: `Please: ${t}`, priority: 'medium' })}
                  className="px-3 py-1.5 text-xs rounded-md border bg-background hover:bg-muted transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
            <GlassButton asChild size="sm">
              <button onClick={create} disabled={!canCreate || loading} className="font-mono">
                {loading ? 'Creating…' : 'Create task'}
              </button>
            </GlassButton>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <SegmentedControl
            options={[
              { label: 'All', value: 'all' },
              { label: 'Queued', value: 'queued' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'completed' },
            ]}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as any)}
          />
          <SegmentedControl
            options={[
              { label: 'All', value: 'all' },
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
            ]}
            value={priorityFilter}
            onChange={(v) => setPriorityFilter(v as any)}
          />
        </div>

        {/* Tasks list */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
          {loadingList && (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          )}
          {!loadingList && filteredTasks.map((t) => (
            <TaskCard
              key={t.id}
              title={t.title}
              description={t.description}
              status={t.status}
              priority={t.priority}
              createdAt={t.created_at}
            />
          ))}
          {!loadingList && filteredTasks.length === 0 && (
            <div className="text-sm text-muted-foreground">No tasks match your filters. Try creating one above.</div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
