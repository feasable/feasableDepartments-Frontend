'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GlassButton } from '@/components/ui/glass-button'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export function UserMenu({ displayName, email }: { displayName: string | null; email: string | null }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const name = displayName || email || 'Account'

  return (
    <div className="relative" ref={ref}>
      <GlassButton onClick={() => setOpen(!open)} size="sm">
        {name}
      </GlassButton>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border bg-background/80 backdrop-blur-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 text-sm">
            <div className="font-semibold truncate">{name}</div>
            {email && <div className="text-muted-foreground truncate">{email}</div>}
          </div>
          <div className="border-t" />
          <div className="p-2 space-y-1">
            <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-muted/60">Dashboard</Link>
            <Link href="/settings" className="block px-3 py-2 rounded-lg hover:bg-muted/60">Settings</Link>
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/60"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/60"
              onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
