'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { toast } from 'sonner'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [usePasswordless, setUsePasswordless] = useState(false)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      toast.success('Welcome back!')
      router.push('/departments/marketing')
    } catch (error: any) {
      toast.error(error?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) return toast.error('Please enter your email')
    
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/departments/marketing`,
        },
      })
      
      if (error) throw error
      
      setOtpSent(true)
      toast.success('Check your email for the login link!')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image
              src="/images/fovvydotted.png"
              alt="Feasable"
              width={40}
              height={40}
              className="dark:invert"
            />
            <span className="text-2xl font-bold">feasable</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            {otpSent
              ? 'We sent you a magic link!'
              : 'Sign in to manage your AI departments'}
          </p>

          {otpSent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Check your email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We sent a magic link to {email}
              </p>
              <button
                onClick={() => setOtpSent(false)}
                className="text-sm text-primary hover:underline"
              >
                Try another method
              </button>
            </motion.div>
          ) : (
            <>
              {/* OAuth */}
              <GoogleButton label="Sign in with Google" />
              
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="px-3 text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Toggle between password and passwordless */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setUsePasswordless(false)}
                  className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                    !usePasswordless
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setUsePasswordless(true)}
                  className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                    usePasswordless
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {usePasswordless ? (
                /* Magic Link Form */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:border-primary"
                      placeholder="you@company.com"
                    />
                  </div>
                  <button
                    onClick={handleMagicLink}
                    disabled={loading || !email}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </div>
              ) : (
                /* Password Form */
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:border-primary"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:border-primary"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              )}

              <p className="text-center mt-6 text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up free
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-white text-center px-8"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">
            Your AI Team Awaits
          </h2>
          <p className="text-xl opacity-90">
            Delegate tasks, automate workflows, and scale your business
          </p>
        </motion.div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 rounded-full bg-white/10"
              initial={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              animate={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
              style={{
                left: `${20 * i}%`,
                top: `${15 * i}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
