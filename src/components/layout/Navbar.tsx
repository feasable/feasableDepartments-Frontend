'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'liquid-glass liquid-outline shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-3' : 'py-6'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/fovvydotted.png"
                alt="feasableSpaces"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xl hidden sm:inline-block">
                <span className="font-serif">feasable</span><span className="font-sans"><b>Spaces</b></span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/departments" className="hover:text-primary transition-colors">
                Departments
              </Link>
              <Link href="/pricing" className="hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {userEmail ? (
                <>
                  <span className="text-xs text-muted-foreground hidden lg:inline-block">{userEmail}</span>
                  <Link href="/dashboard" className="px-4 py-2 text-sm border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }} className="px-4 py-2 text-sm border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-sm border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-4 py-2 text-sm border border-foreground rounded-full hover:bg-foreground hover:text-background transition-colors">
                    Get Started
                  </Link>
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
        <div className="pt-24 px-6 space-y-6">
          <Link
            href="/departments"
            onClick={() => setMobileMenu(false)}
            className="block text-lg hover:text-primary transition-colors"
          >
            Departments
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenu(false)}
            className="block text-lg hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenu(false)}
            className="block text-lg hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenu(false)}
            className="block text-lg hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <div className="pt-6 space-y-4 border-t">
            {userEmail ? (
              <>
                <div className="text-sm text-muted-foreground">{userEmail}</div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center px-4 py-3 border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors"
                >
                  Dashboard
                </Link>
                <button onClick={async () => { await createClient().auth.signOut(); window.location.href = '/' }} className="w-full px-4 py-3 border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center px-4 py-3 border border-foreground/20 rounded-full hover:bg-foreground/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center px-4 py-3 border border-foreground rounded-full hover:bg-foreground hover:text-background transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
