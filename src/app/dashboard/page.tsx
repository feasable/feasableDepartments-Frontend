'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import VoicePanel from '@/components/VoicePanel'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  department: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    in_progress: 0,
    queued: 0
  })

  useEffect(() => {
    checkAuth()
    fetchTasks()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }
    
    setUser(session.user)
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tasks`, {
        headers: {
          'Authorization': `Bearer ${(await createClient().auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
        updateStats(data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStats = (taskList: Task[]) => {
    setStats({
      total: taskList.length,
      completed: taskList.filter(t => t.status === 'completed').length,
      in_progress: taskList.filter(t => t.status === 'in_progress').length,
      queued: taskList.filter(t => t.status === 'queued').length
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'queued': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴'
      case 'high': return '🟠'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b-2 border-border bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold font-mono">
                feasableDepartments
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-mono">Dashboard</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/departments" className="text-sm font-mono hover:text-primary">
                Departments
              </Link>
              <Link href="/tasks" className="text-sm font-mono hover:text-primary">
                Tasks
              </Link>
              <Link href="/settings" className="text-sm font-mono hover:text-primary">
                Settings
              </Link>
              <div className="flex items-center space-x-2 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <button
                  onClick={async () => {
                    await createClient().auth.signOut()
                    router.push('/')
                  }}
                  className="text-sm font-mono hover:text-primary"
                >
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-mono mb-2">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI departments today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg sketch-border">
            <div className="text-2xl font-bold font-mono">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg sketch-border">
            <div className="text-2xl font-bold font-mono text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg sketch-border">
            <div className="text-2xl font-bold font-mono text-blue-600">{stats.in_progress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg sketch-border">
            <div className="text-2xl font-bold font-mono text-yellow-600">{stats.queued}</div>
            <div className="text-sm text-muted-foreground">Queued</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sketch-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-mono">Recent Tasks</h2>
                <Link href="/tasks/new" className="text-sm font-mono text-primary hover:underline">
                  + New Task
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-muted-foreground mb-4">No tasks yet</p>
                  <Link
                    href="/tasks/new"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-mono"
                  >
                    Create First Task
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span>{getPriorityIcon(task.priority)}</span>
                          <h3 className="font-mono font-bold">{task.title}</h3>
                        </div>
                        <span className={`px-2 py-1 text-xs font-mono rounded ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{task.department}</span>
                        <span>{new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  
                  {tasks.length > 5 && (
                    <Link
                      href="/tasks"
                      className="block text-center py-2 text-sm font-mono text-primary hover:underline"
                    >
                      View all {tasks.length} tasks →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sketch-border">
              <h2 className="text-xl font-bold font-mono mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/tasks/new"
                  className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors text-center"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="font-mono text-sm">Create Task</div>
                </Link>
                <Link
                  href="/departments"
                  className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-mono text-sm">View Departments</div>
                </Link>
                <Link
                  href="/analytics"
                  className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors text-center"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-mono text-sm">Analytics</div>
                </Link>
                <Link
                  href="/settings"
                  className="p-4 border-2 border-border rounded-lg hover:border-primary transition-colors text-center"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-mono text-sm">Settings</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Voice Panel */}
            <VoicePanel />

            {/* Activity Feed */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sketch-border">
              <h3 className="font-mono font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <div>
                    <p className="font-mono">Task completed</p>
                    <p className="text-xs text-muted-foreground">Marketing campaign draft - 2h ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">🔄</span>
                  <div>
                    <p className="font-mono">Workflow started</p>
                    <p className="text-xs text-muted-foreground">Data analysis report - 5h ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-500">📋</span>
                  <div>
                    <p className="font-mono">Task created</p>
                    <p className="text-xs text-muted-foreground">Q1 planning document - 1d ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
