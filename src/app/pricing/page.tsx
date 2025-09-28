'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, Building2, Rocket } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import VerticalBarsNoise from '@/components/ui/vertical-bars'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying out AI departments',
    features: [
      '5 messages per month',
      '1 department access',
      'Basic task management',
      'Email support',
      'Community access'
    ],
    cta: 'Get Started',
    href: '/signup',
    popular: false
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For growing teams and businesses',
    features: [
      'Unlimited messages',
      'All departments',
      'Priority processing',
      'Advanced analytics',
      'API access',
      'Priority support',
      'Custom integrations'
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored for your organization',
    features: [
      'Everything in Professional',
      'Custom departments',
      'Dedicated infrastructure',
      'SLA guarantees',
      'White-label options',
      'On-premise deployment',
      'Dedicated success manager',
      'Custom AI training'
    ],
    cta: 'Contact Sales',
    href: 'mailto:enterprise@feasable.org',
    popular: false
  }
]

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Fixed animated background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <VerticalBarsNoise backgroundColor="#0b0f1a" lineColor="#1f2937" barColor="#94a3b8" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      </div>
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Simple, transparent pricing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Choose Your
            <span className="text-gradient"> AI Team Size</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Scale your AI departments as you grow. Start free, upgrade anytime.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'glass-card gradient-border scale-105'
                    : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-6 rounded-full font-medium transition-all ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
                      : 'glass hover:bg-white/20 dark:hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-20 px-6 border-t">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We offer tailored plans for organizations with specific department
              needs, compliance requirements, or scale demands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:sales@feasable.org"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Contact Sales
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3 glass rounded-full font-medium hover:bg-white/20 dark:hover:bg-white/10 transition-all"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'How do message credits work?',
                a: 'Each interaction with an AI department uses one message credit. Credits reset monthly on your billing date.'
              },
              {
                q: 'Can I switch plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What happens when I run out of credits?',
                a: 'You can purchase additional credits or upgrade to a higher plan. Enterprise plans include unlimited messages.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 30-day money-back guarantee for all paid plans. No questions asked.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
