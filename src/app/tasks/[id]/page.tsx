'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId } from '@/lib/tenant'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { analytics } from '@/lib/analytics'

import { ArrowLeft, MessageSquare, Clock, CheckCircle2, AlertTriangle, Activity, FileText } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'queued'|'in_progress'|'completed'|'failed'|'cancelled'
  department: string | null
  result: any | null
  created_at: string
}

interface Run {
  id: string
  status: string
  current_step: string | null
  last_error: string | null
  eta_seconds: number | null
  cost_cents: number | null
  tokens_input: number | null
  tokens_output: number | null
  created_at: string
}

interface EventRow {
  id: string
  type: string
  message: string | null
  data: any
  created_at: string
}

interface CommentRow {
  id: string
  user_id: string
  body: string
  attachments: any[]
  created_at: string
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = String(params?.id || '')
  const [task, setTask] = useState<Task | null>(null)
  const [events, setEvents] = useState<EventRow[]>([])
  const [comments, setComments] = useState<CommentRow[]>([])
  const [run, setRun] = useState<Run | null>(null)
  const [loading, setLoading] = useState(true)

  const [newComment, setNewComment] = useState('')
  const [attachments, setAttachments] = useState('')

  useEffect(() => {
    const biz = getBusinessId()
    if (!taskId || !biz) {
      router.replace('/dashboard')
      return
    }
    analytics.track('task_detail_viewed', { id: taskId })
    void loadAll()

    const supabase = createClient()
    const channel = supabase
      .channel(`task-${taskId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_events', filter: `task_id=eq.${taskId}` }, () => loadEvents())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_comments', filter: `task_id=eq.${taskId}` }, () => loadComments())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `id=eq.${taskId}` }, () => loadTask())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_runs', filter: `task_id=eq.${taskId}` }, () => loadRun())
      .subscribe()
    return () => { void channel.unsubscribe() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  const loadAll = async () => {
    setLoading(true)
    await Promise.all([loadTask(), loadEvents(), loadComments(), loadRun()])
    setLoading(false)
  }

  const loadTask = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('tasks')
      .select('id,title,description,status,department,result,created_at')
      .eq('id', taskId)
      .maybeSingle()
    setTask((data as any) || null)
  }

  const loadEvents = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('task_events')
      .select('id,type,message,data,created_at')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    setEvents((data as any[]) || [])
  }

  const loadComments = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('task_comments')
      .select('id,user_id,body,attachments,created_at')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    setComments((data as any[]) || [])
  }

  const loadRun = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('agent_runs')
      .select('id,status,current_step,last_error,eta_seconds,cost_cents,tokens_input,tokens_output,created_at')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .limit(1)
    setRun((data && data[0] as any) || null)
  }

  const setStatus = async (next: Task['status']) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('tasks')
        .update({ status: next })
        .eq('id', taskId)
      if (error) throw error
      analytics.track('task_status_changed', { id: taskId, from: task?.status, to: next })
      // Add timeline event
      try {
        await supabase
          .from('task_events')
          .insert({ task_id: taskId, type: 'status_changed', message: `${task?.status} -> ${next}`, data: {} })
      } catch {}
    } catch {}
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const attach = attachments.trim()
      const arr = attach ? attach.split(',').map(s => s.trim()).filter(Boolean) : []
      const { error } = await supabase
        .from('task_comments')
        .insert({ task_id: taskId, user_id: user.id, body: newComment, attachments: arr })
      if (error) throw error
      analytics.track('task_comment_added', { id: taskId })
      setNewComment('')
      setAttachments('')
    } catch {}
  }

  const statusColor = (s: Task['status']) => {
    switch (s) {
      case 'queued': return 'bg-yellow-100 text-yellow-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'failed': return 'bg-red-100 text-red-700'
      case 'cancelled': return 'bg-gray-100 text-gray-700'
    }
  }

  const ResultView = useMemo(() => {
    if (!task?.result) return <div className="text-sm text-muted-foreground">No result yet</div>
    const r = task.result
    if (typeof r === 'string') return <pre className="text-sm whitespace-pre-wrap">{r}</pre>
    if (r.html) return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: r.html }} />
    if (r.text) return <pre className="text-sm whitespace-pre-wrap">{r.text}</pre>
    if (r.url) return <a href={r.url} target="_blank" className="underline">Open Result</a>
    return <pre className="text-xs overflow-auto bg-muted/40 p-3 rounded-lg">{JSON.stringify(r, null, 2)}</pre>
  }, [task?.result])

  if (loading) {
    return (
      <DashboardShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  if (!task) {
    return (
      <DashboardShell>
        <div className="p-8">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4"/>Back to Tasks</Link>
            <span className={`px-2 py-1 rounded-full text-xs ${statusColor(task.status)}`}>{task.status.replace('_',' ')}</span>
          </div>
          <div className="flex items-center gap-2">
            {task.status !== 'in_progress' && <button className="text-xs px-2 py-1 rounded-md border" onClick={() => setStatus('in_progress')}>Start</button>}
            {task.status !== 'completed' && <button className="text-xs px-2 py-1 rounded-md border" onClick={() => setStatus('completed')}>Mark done</button>}
            {task.status !== 'failed' && <button className="text-xs px-2 py-1 rounded-md border" onClick={() => setStatus('failed')}>Fail</button>}
            {task.status !== 'cancelled' && <button className="text-xs px-2 py-1 rounded-md border" onClick={() => setStatus('cancelled')}>Cancel</button>}
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 space-y-2">
          <h1 className="text-2xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5"/>{task.title}</h1>
          {task.description && <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/>Activity</h2>
              {events.length === 0 ? (
                <div className="text-sm text-muted-foreground">No activity yet</div>
              ) : (
                <ul className="space-y-3">
                  {events.map(e => (
                    <li key={e.id} className="flex items-start gap-3">
                      <Clock className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                        <div className="text-sm"><span className="font-mono text-xs uppercase text-muted-foreground">{e.type}</span>{e.message ? ` — ${e.message}` : ''}</div>
                        {e.data && Object.keys(e.data).length > 0 && (
                          <pre className="mt-2 text-xs bg-muted/40 p-2 rounded-lg overflow-auto">{JSON.stringify(e.data, null, 2)}</pre>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4"/>Comments</h2>
              {comments.length === 0 ? (
                <div className="text-sm text-muted-foreground">No comments yet</div>
              ) : (
                <ul className="space-y-4 mb-4">
                  {comments.map(c => (
                    <li key={c.id} className="border-b pb-3">
                      <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()} · {c.user_id.slice(0,8)}…</div>
                      <div className="text-sm whitespace-pre-wrap">{c.body}</div>
                      {c.attachments && c.attachments.length > 0 && (
                        <ul className="mt-2 text-xs list-disc list-inside">
                          {c.attachments.map((a, i) => (
                            <li key={i}><a className="underline" href={String(a)} target="_blank">{String(a)}</a></li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div className="space-y-2">
                <textarea className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={3} placeholder="Add a comment" value={newComment} onChange={e => setNewComment(e.target.value)} />
                <input className="w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Attachment URLs (comma-separated)" value={attachments} onChange={e => setAttachments(e.target.value)} />
                <div>
                  <button className="px-4 py-2 rounded-md border" onClick={addComment}>Post Comment</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Result</h2>
              {ResultView}
            </div>

            <div className="bg-card border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/>Agent Run</h2>
              {!run ? (
                <div className="text-sm text-muted-foreground">No runs yet</div>
              ) : (
                <div className="text-sm space-y-2">
                  <div>Status: <span className="font-medium capitalize">{run.status.replace('_',' ')}</span></div>
                  {run.current_step && <div>Step: {run.current_step}</div>}
                  {run.last_error && <div className="text-red-600">Last error: {run.last_error}</div>}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {run.eta_seconds != null && <div>ETA: {run.eta_seconds}s</div>}
                    {run.cost_cents != null && <div>Cost: ${(run.cost_cents/100).toFixed(2)}</div>}
                    {run.tokens_input != null && <div>Tokens in: {run.tokens_input}</div>}
                    {run.tokens_output != null && <div>Tokens out: {run.tokens_output}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground">Started: {new Date(run.created_at).toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
