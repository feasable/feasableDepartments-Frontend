'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Building2, Briefcase, Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OnboardingWizardProps {
  isOpen: boolean
  onClose: () => void
  businessId?: string
}

type Step = 'welcome' | 'personal' | 'company' | 'details' | 'success'

export function OnboardingWizard({ isOpen, onClose, businessId }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    description: ''
  })

  const steps: Step[] = ['welcome', 'personal', 'company', 'details', 'success']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    const stepOrder: Step[] = ['welcome', 'personal', 'company', 'details', 'success']
    const nextIndex = stepOrder.indexOf(currentStep) + 1
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex])
    }
  }

  const handleBack = () => {
    const stepOrder: Step[] = ['welcome', 'personal', 'company', 'details', 'success']
    const prevIndex = stepOrder.indexOf(currentStep) - 1
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex])
    }
  }

  const canProceedFromPersonal = formData.firstName.trim() && formData.lastName.trim()
  const canProceedFromCompany = formData.companyName.trim()

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.companyName) {
      toast.error('Please complete all required fields')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      console.log('🔍 [Onboarding] Getting session...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('❌ [Onboarding] Session error:', sessionError)
        throw new Error('Please log in to complete your profile')
      }
      
      if (!session?.user) {
        console.error('❌ [Onboarding] No user in session')
        throw new Error('Please log in to complete your profile')
      }
      
      const user = session.user
      console.log('✅ [Onboarding] User authenticated:', user.id)

      // Update user metadata
      console.log('🔍 [Onboarding] Updating user metadata...')
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`
        }
      })
      if (userError) {
        console.error('❌ [Onboarding] User metadata update failed:', userError)
        throw userError
      }
      console.log('✅ [Onboarding] User metadata updated')

      if (businessId) {
        // Update existing business
        console.log('🔍 [Onboarding] Updating existing business:', businessId)
        const { error } = await supabase
          .from('businesses')
          .update({
            name: formData.companyName,
            industry: formData.industry || null,
            company_size: formData.companySize || null,
            website: formData.website || null,
            description: formData.description || null,
          })
          .eq('id', businessId)

        if (error) {
          console.error('❌ [Onboarding] Business update failed:', error)
          throw error
        }
        console.log('✅ [Onboarding] Business updated')
      } else {
        // ⚠️ BACKEND INTEGRATION POINT #1: Business Creation
        // TODO: When backend is ready, replace this with API call to:
        // POST /api/backend/v1/businesses/bootstrap
        // For now, create directly in Supabase
        
        console.log('🔍 [Onboarding] Creating new business in Supabase...')
        const { data: newBusiness, error: createError } = await supabase
          .from('businesses')
          .insert({
            name: formData.companyName,
            owner_id: user.id,
            industry: formData.industry || null,
            company_size: formData.companySize || null,
            website: formData.website || null,
            description: formData.description || null,
          })
          .select()
          .single()

        if (createError) {
          console.error('❌ [Onboarding] Business creation failed:', createError)
          throw createError
        }
        console.log('✅ [Onboarding] Business created:', newBusiness.id)
        localStorage.setItem('businessId', newBusiness.id)
      }

      localStorage.setItem('companyProfileCompleted', 'true')
      console.log('🎉 [Onboarding] Complete! Showing success screen...')
      setCurrentStep('success')
    } catch (error: any) {
      console.error('Onboarding error:', error)
      toast.error(error.message || 'Failed to save profile')
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6 py-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Welcome to lunoSpaces! 🎉</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Let's get you set up in just a few steps ~ This will only take a minute.
            </p>
            <Button onClick={handleNext} size="lg" className="mt-8">
              Start <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )

      case 'personal':
        return (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">What's your name?</h2>
              <p className="text-muted-foreground mt-2">Let's make this personal</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-12"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!canProceedFromPersonal}
                className="flex-1"
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )

      case 'company':
        return (
          <motion.div
            key="company"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Tell us about your company</h2>
              <p className="text-muted-foreground mt-2">We'll create your AI workspace</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Acme Inc."
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="h-12"
                autoFocus
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <select
                  id="companySize"
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!canProceedFromCompany}
                className="flex-1"
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )

      case 'details':
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Almost there!</h2>
              <p className="text-muted-foreground mt-2">Add some optional details</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Tell us what your company does..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating Workspace...' : 'Complete Setup'} 
                {!loading && <Check className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4"
            >
              <Check className="w-10 h-10 text-green-500" />
            </motion.div>
            <h2 className="text-3xl font-bold">You're all set! 🚀</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your AI workspace is ready. Let's start building something amazing!
            </p>
            <Button onClick={onClose} size="lg" className="mt-8">
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && currentStep !== 'success') {
            // Don't allow closing during active onboarding
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-gray-200 dark:border-gray-600 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          {currentStep !== 'welcome' && currentStep !== 'success' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Step Indicator */}
          {currentStep !== 'welcome' && currentStep !== 'success' && (
            <div className="flex justify-center gap-2 pb-8">
              {['personal', 'company', 'details'].map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    currentStep === step ? 'bg-primary w-8' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
