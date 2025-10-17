"use client"

import { createClient } from '@/lib/supabase/client'
import { GlassButton } from '@/components/ui/glass-button'

export function GoogleButton({ label = 'Continue with Google' }: { label?: string }) {
  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/Spaces/marketing`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  return (
    <GlassButton onClick={handleGoogle} className="w-full mb-4" contentClassName="flex items-center justify-center gap-2">
      <GoogleIcon className="h-4 w-4" />
      <span>{label}</span>
    </GlassButton>
  )
}

function GoogleIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.479 14.265v-3.279h11.049c.108.571.164 1.247.164 1.979 0 2.46-.672 5.502-2.84 7.669C18.744 22.829 16.051 24 12.483 24 5.869 24 .308 18.613.308 12S5.869 0 12.483 0c3.659 0 6.265 1.436 8.223 3.307L18.392 5.62c-1.404-1.317-3.307-2.341-5.913-2.341-4.83 0-8.607 3.892-8.607 8.721s3.777 8.721 8.606 8.721c3.132 0 4.916-1.258 6.059-2.401.927-.927 1.537-2.251 1.777-4.059l-7.835.996z" />
    </svg>
  )
}
