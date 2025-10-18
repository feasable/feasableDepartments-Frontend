export async function backend<T = any>(path: string, init?: RequestInit): Promise<T> {
  // Try to attach Supabase access token on client
  let headers: HeadersInit = { 'content-type': 'application/json', ...(init?.headers || {}) }
  if (typeof window !== 'undefined') {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (token && !(headers as any)['Authorization']) {
        headers = { ...headers, Authorization: `Bearer ${token}` }
      }
    } catch {}
  }
  const res = await fetch(`/api/backend${path}`, { ...init, headers })
  if (!res.ok) {
    if (typeof window !== 'undefined' && res.status === 401) {
      // Lazy import to avoid server-side bundling
      const { toast } = await import('sonner')
      toast.error('Please sign in to continue')
      setTimeout(() => {
        window.location.href = '/auth'
      }, 800)
      throw new Error('Unauthorized')
    }
    let msg = await res.text().catch(() => '')
    try {
      const j = JSON.parse(msg)
      msg = j?.error || msg
    } catch {}
    throw new Error(msg || `Backend error ${res.status}`)
  }
  return (await res.json()) as T
}
