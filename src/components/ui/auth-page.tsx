'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './button'
import { Input } from './input'
import { cn } from '@/lib/utils'
import {
  AtSign,
  ChevronLeft,
  Github,
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Apple
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureUserBusiness } from '@/lib/auth-helpers'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AuthPageProps {
  mode?: 'login' | 'signup'
  onModeChange?: (mode: 'login' | 'signup') => void
}

export function AuthPage({ mode = 'login', onModeChange }: AuthPageProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(mode)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const router = useRouter()

  const isSignup = currentMode === 'signup'

  const handleModeToggle = (newMode: 'login' | 'signup') => {
    setCurrentMode(newMode)
    onModeChange?.(newMode)
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    })
  }

  const handleGoogleAuth = async () => {
    const supabase = createClient()
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : '/auth/callback'
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
  }

  const handleEmailAuth = async () => {
    if (isSignup && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
            emailRedirectTo: `${window.location.origin}/Spaces/marketing`,
          },
        })
        if (signUpError) throw signUpError
        toast.success('Check your email to confirm your account!')
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (signInError) throw signInError
        
        // Success - ensure user has a business, then redirect
        await ensureUserBusiness()
        router.push('/Spaces/marketing')
      } else {
        // Login flow
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (loginError) throw loginError
        
        // Success - ensure user has a business, then redirect
        await ensureUserBusiness()
        router.push('/Spaces/marketing')
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/Spaces/marketing`,
        },
      })
      if (error) throw error
      toast.success('Check your email for the magic link!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Panel - Animated Background */}
      <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-primary/10 dark:from-gray-900 dark:via-gray-800 dark:to-primary/10 relative hidden h-full flex-col border-r p-10 lg:flex overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 flex items-center gap-2"
        >
          <Building2 className="size-8 text-primary" />
          <p className="text-2xl">
            <span className="font-light">luno</span><span className="font-bold">Spaces</span>
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="z-10 mt-auto"
        >
          <blockquote className="space-y-4">
            <p className="text-xl">
              &ldquo;lunoSpaces transformed our workflow completely. 
              Our AI workspaces handle everything seamlessly.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Sarah Chen, CEO TechStart
            </footer>
          </blockquote>
        </motion.div>

        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        {/* Background decorations */}
        <div
          aria-hidden
          className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,theme(colors.foreground/0.06)_0,hsla(0,0%,55%,.02)_50%,theme(colors.foreground/0.01)_80%)] absolute top-0 right-0 h-80 w-80 -translate-y-40 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,theme(colors.foreground/0.04)_0,theme(colors.foreground/0.01)_80%,transparent_100%)] absolute top-0 right-0 h-80 w-60 translate-x-4 -translate-y-1/2 rounded-full" />
        </div>

        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <a href="/">
            <ChevronLeft className="size-4 me-2" />
            Home
          </a>
        </Button>

        <div className="mx-auto space-y-6 sm:w-sm max-w-md w-full">
          {/* Mobile Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 lg:hidden justify-center"
          >
            <Building2 className="size-8 text-primary" />
            <p className="text-2xl">
              <span className="font-light">luno</span><span className="font-bold">Spaces</span>
            </p>
          </motion.div>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-2 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mx-auto mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {isSignup ? 'Join the workspace revolution' : 'Welcome back'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">
              {isSignup ? 'Create Your Workspace' : 'Sign In to Your Workspace'}
            </h1>
            <p className="text-muted-foreground">
              {isSignup 
                ? 'Start building your AI workspace today' 
                : 'Continue managing your AI Spaces'
              }
            </p>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex rounded-lg bg-muted p-1"
          >
            <button
              onClick={() => handleModeToggle('login')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                !isSignup ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => handleModeToggle('signup')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                isSignup ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
            >
              Sign Up
            </button>
          </motion.div>

          {/* OAuth Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <Button 
              type="button" 
              size="lg" 
              variant="outline" 
              className="w-full hover:scale-105 transition-transform"
              onClick={handleGoogleAuth}
            >
              <GoogleIcon className="size-4 me-2" />
              Continue with Google
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" size="lg" variant="outline" className="hover:scale-105 transition-transform">
                <Apple className="size-4 me-2" />
                Apple
              </Button>
              <Button type="button" size="lg" variant="outline" className="hover:scale-105 transition-transform">
                <Github className="size-4 me-2" />
                GitHub
              </Button>
            </div>
          </motion.div>

          <AuthSeparator />

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form 
              key={isSignup ? 'signup' : 'login'}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleEmailAuth()
              }}
            >
              <p className="text-muted-foreground text-start text-sm">
                {isSignup 
                  ? 'Enter your details to create your account'
                  : 'Enter your email address to sign in'
                }
              </p>

              {/* Name fields for signup */}
              {isSignup && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="relative">
                    <Input
                      placeholder="First name"
                      className="peer ps-9"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                      <User className="size-4" />
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Last name"
                      className="peer ps-9"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                      <User className="size-4" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email field */}
              <div className="relative">
                <Input
                  placeholder="you@company.com"
                  className="peer ps-9"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                  <AtSign className="size-4" />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <Input
                  placeholder="Password"
                  className="peer ps-9 pe-9"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                  <Lock className="size-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Confirm password for signup */}
              {isSignup && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <Input
                    placeholder="Confirm password"
                    className="peer ps-9"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                    <Lock className="size-4" />
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full hover:scale-105 transition-transform"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
                </Button>

                {!isSignup && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleMagicLink}
                    disabled={loading}
                  >
                    Send Magic Link
                  </Button>
                )}
                {!isSignup && (
                  <p className="text-xs text-center text-muted-foreground">
                    <a href="/reset-password" className="hover:text-foreground underline underline-offset-4">
                      Forgot password?
                    </a>
                  </p>
                )}
              </div>
            </motion.form>
          </AnimatePresence>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-center text-sm"
          >
            By continuing, you agree to our{' '}
            <a href="/terms" className="hover:text-primary underline underline-offset-4">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="hover:text-primary underline underline-offset-4">
              Privacy Policy
            </a>
            .
          </motion.p>
        </div>
      </div>
    </main>
  )
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    d: `M-${150 - i * 2 * position} -${80 + i * 3}C-${150 - i * 2 * position} -${80 + i * 3} -${120 - i * 2 * position} ${120 - i * 3} ${80 - i * 2 * position} ${160 - i * 3}C${280 - i * 2 * position} ${200 - i * 3} ${320 - i * 2 * position} ${320 - i * 3} ${320 - i * 2 * position} ${320 - i * 3}`,
    width: 0.5 + i * 0.02,
  }))

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-muted-foreground/20"
        viewBox="0 0 400 320"
        fill="none"
      >
        <title>Animated Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{
              pathLength: [0.2, 1, 0.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
)

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-3 text-xs">OR</span>
      <div className="bg-border h-px w-full" />
    </div>
  )
}
