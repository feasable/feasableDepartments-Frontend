'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ProgressDots } from '@/components/onboarding/ProgressDots'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type StepKey = 'fullName' | 'email' | 'password' | 'confirmPassword' | 'terms' | 'review'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [step, setStep] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  const steps: { key: StepKey; label: string }[] = useMemo(
    () => [
      { key: 'fullName', label: 'Your name' },
      { key: 'email', label: 'Email' },
      { key: 'password', label: 'Password' },
      { key: 'confirmPassword', label: 'Confirm password' },
      { key: 'terms', label: 'Terms' },
      { key: 'review', label: 'Review & create' },
    ],
    []
  )

  const total = steps.length

  const updateField = (field: keyof typeof formData, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const canNext = useMemo(() => {
    switch (steps[step].key) {
      case 'fullName':
        return formData.fullName.trim().length >= 2
      case 'email':
        return /.+@.+\..+/.test(formData.email)
      case 'password':
        return formData.password.length >= 8
      case 'confirmPassword':
        return formData.confirmPassword === formData.password && formData.confirmPassword.length >= 8
      case 'terms':
        return formData.agreeToTerms
      case 'review':
        return true
    }
  }, [formData, step, steps])

  const next = useCallback(() => {
    if (!canNext) return
    setStep((s) => Math.min(s + 1, total - 1))
  }, [canNext, total])

  const back = () => setStep((s) => Math.max(0, s - 1))

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) {
        toast.error(error.message)
      } else if (data?.user) {
        toast.success('Account created! Check your email to verify.')
        router.push('/login')
      }
    } catch (e) {
      toast.error('An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 sm:p-8 sketch-border">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-mono mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground">Answer a few quick questions</p>
          </div>

          {/* Animated Steps */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              {steps[step].key === 'fullName' && (
                <motion.div
                  key="fullName"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-sm font-medium mb-2">What should we call you?</label>
                  <input
                    autoFocus
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                    className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
                    placeholder="Jane Smith"
                  />
                </motion.div>
              )}

              {steps[step].key === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-sm font-medium mb-2">Your email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                    className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
                    placeholder="you@example.com"
                  />
                </motion.div>
              )}

              {steps[step].key === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-sm font-medium mb-2">Create a password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                    className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
                </motion.div>
              )}

              {steps[step].key === 'confirmPassword' && (
                <motion.div
                  key="confirmPassword"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-sm font-medium mb-2">Confirm password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && next()}
                    className="w-full px-4 py-3 border-2 border-border rounded-md focus:border-primary focus:outline-none font-mono"
                    placeholder="••••••••"
                    minLength={8}
                  />
                </motion.div>
              )}

              {steps[step].key === 'terms' && (
                <motion.div
                  key="terms"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateField('agreeToTerms', e.target.checked)}
                      className="mr-2 align-middle"
                    />
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </label>
                </motion.div>
              )}

              {steps[step].key === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-mono">{formData.fullName || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-mono">{formData.email || '—'}</span></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || loading}
              className="px-4 py-2 rounded-md border-2 border-border hover:bg-accent font-mono disabled:opacity-50"
            >
              Back
            </button>

            {steps[step].key !== 'review' ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext || loading}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-mono disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-mono disabled:opacity-50"
              >
                {loading ? 'Creating…' : 'Create Account'}
              </button>
            )}
          </div>

          <ProgressDots current={step} total={total} />

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
