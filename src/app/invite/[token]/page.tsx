'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { backend } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { setBusinessId } from '@/lib/tenant'
import { analytics } from '@/lib/analytics'

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>()
  const search = useSearchParams()
  const router = useRouter()
  const token = params?.token
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [message, setMessage] = useState<string>('Accepting your invitation...')

  useEffect(() => {
    if (!token) return
    ;(async () => {
      const supabase = createClient()
      try {
        analytics.track('invite_accept_start', { token_present: !!token })
        // Try backend first
        const data = await backend<{ businessId: string; role?: string }>(`/v1/invitations/accept?token=${encodeURIComponent(token)}`)
        setBusinessId(data.businessId)
        analytics.track('invite_accept_success', { via: 'backend', businessId: data.businessId, role: data.role })
        router.replace('/dashboard')
        return
      } catch (e: any) {
        // Fallback: try Supabase insert if URL has ?biz=<businessId>
        const biz = search.get('biz')
        if (!biz) {
          setStatus('error')
          setMessage('Could not accept invite. Please try again later or contact the workspace owner.')
          analytics.track('invite_accept_failed', { reason: 'no_backend_no_biz' })
          return
        }
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
            router.replace(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)
            return
          }
          const { error } = await supabase
            .from('business_members')
            .insert({ business_id: biz, user_id: user.id, role: 'member' })
          if (error) throw error
          setBusinessId(biz)
          analytics.track('invite_accept_success', { via: 'supabase_fallback', businessId: biz })
          router.replace('/dashboard')
        } catch (err) {
          setStatus('error')
          setMessage('Invite acceptance failed. Contact your workspace owner to resend the invite.')
          analytics.track('invite_accept_failed', { reason: 'supabase_error' })
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-destructive">{message}</p>
            <button className="underline" onClick={() => router.replace('/')}>Go Home</button>
          </>
        )}
      </div>
    </div>
  )
}
