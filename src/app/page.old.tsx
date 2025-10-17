'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import VoicePanel from '@/components/VoicePanel'
import DepartmentCard from '@/components/DepartmentCard'
import { createClient } from '@/lib/supabase/client'

const Spaces = [
  {
    id: 'project_management',
    title: 'Project Management',
    description: 'Task breakdown, timeline management, and resource allocation',
    icon: '📋',
    href: '/Spaces/project-management',
    status: 'active' as const
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Content creation, campaign planning, and social media',
    icon: '🎨',
    href: '/Spaces/marketing',
    status: 'active' as const
  },
  {
    id: 'data_analytics',
    title: 'Data Analytics',
    description: 'Reports, insights, and data visualization',
    icon: '📊',
    href: '/Spaces/data-analytics',
    status: 'beta' as const
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Invoicing, expense tracking, and financial reports',
    icon: '💰',
    href: '/Spaces/finance',
    status: 'coming_soon' as const
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Process optimization and workflow automation',
    icon: '⚙️',
    href: '/Spaces/operations',
    status: 'coming_soon' as const
  },
  {
    id: 'risk',
    title: 'Risk & Compliance',
    description: 'Risk assessment and regulatory compliance',
    icon: '🛡️',
    href: '/Spaces/risk',
    status: 'coming_soon' as const
  }
]

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [taskCounts, setTaskCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // Check auth status
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="border-b-2 border-border bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold font-mono">lunoSpaces</h1>
              <span className="text-xs text-muted-foreground">by lunoLabs</span>
            </div>
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-mono hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/tasks" className="text-sm font-mono hover:text-primary">
                    Tasks
                  </Link>
                  <Link href="/settings" className="text-sm font-mono hover:text-primary">
                    Settings
                  </Link>
                  <button className="px-4 py-2 text-sm font-mono border-2 border-border rounded hover:border-primary">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-mono hover:text-primary">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-mono bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold font-mono mb-4">
            AI Spaces That Work Like Humans
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Delegate tasks to specialized AI assistants via voice or text. 
            They'll handle your business operations autonomously.
          </p>
          {!user && (
            <div className="flex items-center justify-center space-x-4">
              <Link
                href="/signup"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-mono font-bold hover:bg-primary/90"
              >
                Start Free
              </Link>
              <Link
                href="/demo"
                className="px-6 py-3 border-2 border-border rounded-md font-mono font-bold hover:border-primary"
              >
                Watch Demo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Spaces Grid */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold font-mono mb-6">Available Spaces</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Spaces.map((dept) => (
                  <DepartmentCard
                    key={dept.id}
                    {...dept}
                    tasks={taskCounts[dept.id] || 0}
                  />
                ))}
              </div>
            </div>

            {/* Voice Panel */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold font-mono mb-6">Quick Actions</h3>
              <VoicePanel />
              
              {/* Stats */}
              <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg sketch-border">
                <h4 className="font-mono font-bold mb-4">Your Stats</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasks Created</span>
                    <span className="font-mono font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasks Completed</span>
                    <span className="font-mono font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice Interactions</span>
                    <span className="font-mono font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Saved</span>
                    <span className="font-mono font-bold">0h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t-2 border-border">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold font-mono text-center mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎙️</div>
              <h4 className="font-mono font-bold mb-2">1. Speak or Type</h4>
              <p className="text-sm text-muted-foreground">
                Tell your AI assistant what you need, just like talking to a colleague
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="font-mono font-bold mb-2">2. AI Processes</h4>
              <p className="text-sm text-muted-foreground">
                Specialized Spaces handle tasks with domain expertise
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h4 className="font-mono font-bold mb-2">3. Get Results</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications when tasks are complete
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t-2 border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p className="font-mono">© 2024 lunoLabs. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary">Terms</Link>
            <Link href="/docs" className="hover:text-primary">Documentation</Link>
            <Link href="mailto:support@luno.org" className="hover:text-primary">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
