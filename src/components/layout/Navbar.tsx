'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

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
                <span className="font-light">feasable</span><span className="font-bold">Spaces</span>
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
              <GlassButton asChild size="sm">
                <Link href="/login" className="text-sm">Sign In</Link>
              </GlassButton>
              <GlassButton asChild size="sm">
                <Link href="/signup" className="text-sm">Get Started</Link>
              </GlassButton>
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
            <GlassButton asChild className="block">
              <Link
                href="/login"
                onClick={() => setMobileMenu(false)}
                className="block text-center"
              >
                Sign In
              </Link>
            </GlassButton>
            <GlassButton asChild className="block">
              <Link
                href="/signup"
                onClick={() => setMobileMenu(false)}
                className="block text-center"
              >
                Get Started
              </Link>
            </GlassButton>
          </div>
        </div>
      </motion.div>
    </>
  )
}
