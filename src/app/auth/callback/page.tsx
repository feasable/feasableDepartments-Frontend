'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { analytics } from '@/lib/analytics'

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
          analytics.track('auth_callback_error', { message: error.message })
          router.replace('/auth?error=callback')
          return
        }
        // Success: send to dashboard
        const url = new URL(window.location.href)
        const redirect = url.searchParams.get('redirect')
        analytics.track('auth_callback_success', { redirect: redirect || '/dashboard' })
        router.replace(redirect || '/dashboard')
      } catch (err) {
        console.error('[AuthCallback] unexpected error:', err)
        analytics.track('auth_callback_error', { message: (err as any)?.message })
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
