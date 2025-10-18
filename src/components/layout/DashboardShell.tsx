'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WorkspaceSwitcher } from '@/components/layout/WorkspaceSwitcher'
import { SpaceSwitcher } from '@/components/layout/SpaceSwitcher'
import { cn } from '@/lib/utils'
import { LayoutDashboard, ListTodo, PlusCircle, Settings, Sparkles } from 'lucide-react'
import { ReactNode } from 'react'

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col gap-4 p-4 sticky top-0 h-screen backdrop-blur-xl bg-background/40">
        <div className="px-2 pt-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-primary/10"><Sparkles className="w-4 h-4 text-primary" /></span>
            <span>lunoSpaces</span>
          </Link>
        </div>
        <div className="px-2">
          <WorkspaceSwitcher />
          <div className="mt-3">
            <SpaceSwitcher />
          </div>
        </div>
        <nav className="mt-2 space-y-1 px-2">
          <Link href="/dashboard" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60', isActive('/dashboard') && 'bg-muted')}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/tasks" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60', isActive('/tasks') && 'bg-muted')}>
            <ListTodo className="w-4 h-4" />
            <span>Tasks</span>
          </Link>
          <Link href="/tasks/new" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60', isActive('/tasks/new') && 'bg-muted')}>
            <PlusCircle className="w-4 h-4" />
            <span>New Task</span>
          </Link>
          <Link href="/Spaces" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60', isActive('/Spaces') && 'bg-muted')}>
            <Sparkles className="w-4 h-4" />
            <span>Spaces</span>
          </Link>
          <Link href="/settings" className={cn('flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60', isActive('/settings') && 'bg-muted')}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="mt-auto px-2 pb-4 text-xs text-muted-foreground">
          <span>v0.1.0</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-24 md:pt-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
