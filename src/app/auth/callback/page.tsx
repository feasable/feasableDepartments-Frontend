'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      try {
        // Exchange the OAuth/email confirmation code in the URL for a session
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) {
          console.error('[AuthCallback] exchangeCodeForSession error:', error)
          router.replace('/auth?error=callback')
          return
        }
        // Success: send to dashboard
        router.replace('/dashboard')
      } catch (err) {
        console.error('[AuthCallback] unexpected error:', err)
        router.replace('/auth?error=callback')
      }
    }
    run()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Finishing sign-in…</p>
      </div>
    </div>
  )
}
