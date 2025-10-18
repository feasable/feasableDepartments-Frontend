'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { backend } from '@/lib/api'
import { getBusinessId } from '@/lib/tenant'
import { ensureUserBusiness } from '@/lib/auth-helpers'
import { toast } from 'sonner'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  department: string
  created_at: string
}

interface DashboardStats {
  total: number
  completed: number
  in_progress: number
  queued: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    in_progress: 0,
    queued: 0
  })

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    console.log('🔍 [Dashboard] Checking authentication...')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      console.log('❌ [Dashboard] No session yet, waiting for auth state...')
      let resolved = false
      const timeout = setTimeout(() => {
        if (!resolved) {
          console.log('⏱️ [Dashboard] Auth wait timed out, redirecting to /auth')
          router.push('/auth')
        }
      }, 1500)

      const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession?.user) {
          resolved = true
          clearTimeout(timeout)
          console.log('✅ [Dashboard] Session arrived via onAuthStateChange')
          setUser(newSession.user)
          proceed()
        }
      })

      const proceed = async () => {
        // Ensure business context once session exists
        let id = getBusinessId()
        console.log('🔍 [Dashboard] Business ID from localStorage:', id)
        if (!id) {
          try {
            id = await ensureUserBusiness()
            console.log('✅ [Dashboard] Business found:', id)
            setBusinessId(id)
            fetchTasks(id)
          } catch (error: any) {
            console.log('⚠️ [Dashboard] ensureUserBusiness error:', error.message)
            if (error.message === 'NO_WORKSPACE') {
              setShowOnboarding(true)
              setLoading(false)
            } else {
              router.push('/auth')
            }
          }
        } else {
          setBusinessId(id)
          fetchTasks(id)
        }
        sub.subscription.unsubscribe()
      }
      return
    }
    
    console.log('✅ [Dashboard] User authenticated:', session.user.id)
    setUser(session.user)
    
    // Ensure business context
    let id = getBusinessId()
    console.log('🔍 [Dashboard] Business ID from localStorage:', id)
    
    if (!id) {
      console.log('🔍 [Dashboard] No business ID in localStorage, calling ensureUserBusiness...')
      try {
        id = await ensureUserBusiness()
        console.log('✅ [Dashboard] Business found:', id)
        setBusinessId(id)
        fetchTasks(id)
      } catch (error: any) {
        if (error.message === 'NO_WORKSPACE') {
          console.log('📝 [Dashboard] No workspace found, showing onboarding...')
          setShowOnboarding(true)
          setLoading(false)
        } else if (error.message === 'UNAUTHENTICATED') {
          console.error('❌ [Dashboard] Unauthenticated, redirecting to /auth')
          router.push('/auth')
        } else {
          console.error('❌ [Dashboard] Unexpected error, redirecting to /auth')
          router.push('/auth')
        }
        return
      }
    } else {
      console.log('✅ [Dashboard] Using cached business ID')
      setBusinessId(id)
      fetchTasks(id)
    }
  }

  const fetchTasks = async (id: string) => {
    try {
      const data = await backend<{ tasks: Task[] }>(`/v1/tasks?businessId=${id}&limit=20`)
      setTasks(data.tasks || [])
      updateStats(data.tasks || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      // Don't show error toast if it's just empty tasks
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
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'in_progress': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      case 'queued': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.user_metadata?.first_name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your AI workspace today.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-blue-600">{stats.in_progress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 text-yellow-600">{stats.queued}</div>
              <div className="text-sm text-muted-foreground">Queued</div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Link
              href="/Spaces"
              className="group bg-card rounded-2xl p-6 border hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Explore Spaces</h3>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground">
                Browse and deploy specialized AI assistants
              </p>
            </Link>

            <Link
              href="/Spaces/marketing"
              className="group bg-card rounded-2xl p-6 border hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Task</h3>
                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground">
                Delegate a new task to your AI team
              </p>
            </Link>

            <Link
              href="/pricing"
              className="group bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upgrade Plan</h3>
                <Sparkles className="w-5 h-5 text-primary group-hover:scale-110 transition-all" />
              </div>
              <p className="text-sm text-muted-foreground">
                Unlock more AI capabilities
              </p>
            </Link>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl p-8 border shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <Link 
                href="/Spaces" 
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by exploring your AI Spaces and creating your first task
                </p>
                <Link
                  href="/Spaces"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  Explore Spaces <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground capitalize">
                        {task.department}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Onboarding Wizard */}
      {showOnboarding && user && (
        <OnboardingWizard
          isOpen={showOnboarding}
          onClose={() => {
            setShowOnboarding(false)
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
