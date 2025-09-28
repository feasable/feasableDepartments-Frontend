'use client'

import { useEffect, useMemo, useState } from 'react'
import { backend } from '@/lib/api'
import { getBusinessId } from '@/lib/tenant'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  created_at: string
}

export default function MarketingDepartmentPage() {
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [business, setBusiness] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' })

  useEffect(() => {
    const id = getBusinessId()
    setBusinessId(id)
  }, [])

  useEffect(() => {
    if (!businessId) return
    const run = async () => {
      try {
        const biz = await backend(`/v1/businesses/${businessId}`)
        setBusiness(biz)
        const list = await backend<{ tasks: Task[] }>(
          `/v1/tasks?businessId=${businessId}&department=marketing&limit=20`
        )
        setTasks(list.tasks || [])
      } catch (e: any) {
        toast.error(e?.message || 'Failed to load department')
      }
    }
    run()
  }, [businessId])

  const canCreate = useMemo(() => form.title.trim().length >= 3 && form.description.trim().length >= 5, [form])

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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-mono font-bold">Marketing Department</h1>
            <p className="text-sm text-muted-foreground">Plan: {business?.plan || 'free'} · Credits: {business?.message_credits ?? 0}</p>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">← Home</Link>
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
          <div className="mt-4 flex justify-end">
            <button
              onClick={create}
              disabled={!canCreate || loading}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-mono disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create task'}
            </button>
          </div>
        </motion.div>

        {/* Tasks list */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
          {tasks.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-900 sketch-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-mono font-bold">{t.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded border border-border font-mono">{t.status}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
              <div className="text-xs text-muted-foreground">Priority: {t.priority}</div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-sm text-muted-foreground">No tasks yet. Create one above to get started.</div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
