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
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
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
            {/* Logo in Glass Bubble */}
            <GlassButton asChild size="default" className="glass-button-wrap">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/images/fovvydotted.png"
                  alt="feasableSpaces"
                  width={48}
                  height={48}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-xl">
                  <span className="font-serif">feasable</span><span className="font-sans font-semibold">Spaces</span>
                </span>
              </Link>
            </GlassButton>

            {/* Desktop Menu - Each in Glass Bubble */}
            <div className="hidden md:flex items-center gap-3">
              <GlassButton asChild size="sm">
                <Link href="/departments">Departments</Link>
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
                  <span className="text-xs text-muted-foreground hidden lg:inline-block">{userEmail}</span>
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
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
            <Link href="/departments" onClick={() => setMobileMenu(false)}>
              Departments
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
                <div className="text-sm text-muted-foreground text-center">{userEmail}</div>
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
