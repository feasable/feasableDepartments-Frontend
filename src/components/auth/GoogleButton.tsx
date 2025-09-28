"use client"

import { createClient } from '@/lib/supabase/client'

export function GoogleButton({ label = 'Continue with Google' }: { label?: string }) {
  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/signup`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="w-full mb-4 px-4 py-3 border-2 border-border rounded-md hover:bg-accent font-mono"
    >
      {label}
    </button>
  )
}
