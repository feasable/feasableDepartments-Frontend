'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { createClient } from '@/lib/supabase/client'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null)

  useEffect(() => {
    const handle = () => {
      const threshold = Math.max(20, Math.floor(window.innerHeight * 0.6))
      setScrolled(window.scrollY > threshold)
    }
    handle()
    window.addEventListener('scroll', handle)
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const computeName = (user: any) => {
      const full = user?.user_metadata?.full_name || user?.user_metadata?.name
      if (full && typeof full === 'string') return full
      const first = user?.user_metadata?.first_name
      const last = user?.user_metadata?.last_name
      const combined = [first, last].filter(Boolean).join(' ').trim()
      return combined || user?.email || null
    }

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      setUserEmail(user?.email ?? null)
      if (user) setUserDisplayName(computeName(user))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user
      setUserEmail(user?.email ?? null)
      if (user) setUserDisplayName(computeName(user))
      else setUserDisplayName(null)
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <motion.nav
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background/60 backdrop-blur-xl border-b border-border/30"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo Image */}
            <Link href="/" className="flex items-center group py-2">
              <Image
                src="/images/lunotransparent.png"
                alt="lunoSpaces"
                width={120}
                height={32}
                priority
                className="h-8 w-auto object-contain"
              />
            </Link>

            {/* Desktop Menu - Each in Glass Bubble */}
            <div className="hidden md:flex items-center gap-3">
              <GlassButton asChild size="sm">
                <Link href="/Spaces"><u>Spaces</u></Link>
              </GlassButton>
              <GlassButton asChild size="sm">
                <Link href="/pricing">Pricing</Link>
              </GlassButton>
              <GlassButton asChild size="sm">
                <Link href="/about">About</Link>
              </GlassButton>
              <GlassButton asChild size="sm">
                <Link href="/contact">Contact</Link>
              </GlassButton>
            </div>

            {/* CTA Buttons in Glass */}
            <div className="hidden md:flex items-center gap-3">
              {userEmail ? (
                <>
                  <span className="text-xs text-muted-foreground hidden lg:inline-block">{userDisplayName || userEmail}</span>
                  <GlassButton asChild size="sm">
                    <Link href="/dashboard">Dashboard</Link>
                  </GlassButton>
                  <GlassButton size="sm" onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }}>
                    Sign Out
                  </GlassButton>
                </>
              ) : (
                <>
                  <GlassButton asChild size="sm">
                    <Link href="/login">Sign In</Link>
                  </GlassButton>
                  <GlassButton asChild size="sm">
                    <Link href="/signup">Get Started</Link>
                  </GlassButton>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle with Glass */}
            <GlassButton
              size="icon"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </GlassButton>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileMenu ? { x: 0 } : { x: '100%' }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 right-0 w-80 h-full bg-background/95 backdrop-blur-xl z-40 md:hidden"
      >
        <div className="pt-24 px-6 space-y-4">
          <GlassButton asChild size="default" className="w-full">
            <Link href="/Spaces" onClick={() => setMobileMenu(false)}>
              Spaces
            </Link>
          </GlassButton>
          <GlassButton asChild size="default" className="w-full">
            <Link href="/pricing" onClick={() => setMobileMenu(false)}>
              Pricing
            </Link>
          </GlassButton>
          <GlassButton asChild size="default" className="w-full">
            <Link href="/about" onClick={() => setMobileMenu(false)}>
              About
            </Link>
          </GlassButton>
          <GlassButton asChild size="default" className="w-full">
            <Link href="/contact" onClick={() => setMobileMenu(false)}>
              Contact
            </Link>
          </GlassButton>
          <div className="pt-6 space-y-4 border-t border-border/30">
            {userEmail ? (
              <>
                <div className="text-sm text-muted-foreground text-center">{userDisplayName || userEmail}</div>
                <GlassButton asChild size="default" className="w-full">
                  <Link href="/dashboard" onClick={() => setMobileMenu(false)}>
                    Dashboard
                  </Link>
                </GlassButton>
                <GlassButton size="default" className="w-full" onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }}>
                  Sign Out
                </GlassButton>
              </>
            ) : (
              <>
                <GlassButton asChild size="default" className="w-full">
                  <Link href="/login" onClick={() => setMobileMenu(false)}>
                    Sign In
                  </Link>
                </GlassButton>
                <GlassButton asChild size="default" className="w-full">
                  <Link href="/signup" onClick={() => setMobileMenu(false)}>
                    Get Started
                  </Link>
                </GlassButton>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
