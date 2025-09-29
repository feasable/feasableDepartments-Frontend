'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Shield,
  Cog,
  ArrowRight,
  Sparkles,
  Send,
  Zap
} from 'lucide-react'

interface Department {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  features: string[]
  status: 'active' | 'beta' | 'coming_soon'
  href: string
  gradient: string
  demoPrompt: string
  demoResponse: string
}

const departments: Department[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'AI-powered content creation, campaign management, and social media automation',
    features: [
      'Content generation',
      'Campaign planning',
      'Social media posts',
      'SEO optimization'
    ],
    status: 'active',
    href: '/departments/marketing',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'project-management',
    name: 'Project Management',
    icon: <Users className="w-6 h-6" />,
    description: 'Task breakdown, timeline management, and resource allocation with AI assistance',
    features: [
      'Sprint planning',
      'Resource allocation',
      'Timeline tracking',
      'Team coordination'
    ],
    status: 'active',
    href: '/departments/project-management',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Intelligent reports, insights, and data visualization powered by AI',
    features: [
      'Performance reports',
      'Predictive analytics',
      'Custom dashboards',
      'Trend analysis'
    ],
    status: 'beta',
    href: '/departments/analytics',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Automated invoicing, expense tracking, and financial reporting',
    features: [
      'Invoice generation',
      'Expense tracking',
      'Financial forecasts',
      'Budget planning'
    ],
    status: 'coming_soon',
    href: '#',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: <Cog className="w-6 h-6" />,
    description: 'Process optimization and workflow automation with AI efficiency',
    features: [
      'Process mapping',
      'Workflow automation',
      'Efficiency metrics',
      'Resource optimization'
    ],
    status: 'coming_soon',
    href: '#',
    gradient: 'from-gray-500 to-slate-500'
  },
  {
    id: 'compliance',
    name: 'Risk & Compliance',
    icon: <Shield className="w-6 h-6" />,
    description: 'Risk assessment and regulatory compliance with AI monitoring',
    features: [
      'Risk analysis',
      'Compliance tracking',
      'Audit reports',
      'Policy management'
    ],
    status: 'coming_soon',
    href: '#',
    gradient: 'from-indigo-500 to-purple-500'
  }
]

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background/60 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium tracking-tight">Choose your AI workforce</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI Departments
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each department is powered by specialized AI assistants trained to handle 
            specific business functions. Start with one or deploy your entire AI workforce.
          </p>
        </motion.div>
      </section>

      {/* Departments Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className={`h-full p-6 rounded-xl border bg-card transition-all duration-200
                  ${dept.status === 'active' ? 'hover:shadow-md cursor-pointer' : 'opacity-80'}
                `}>
                  {/* Status Badge */}
                  {dept.status !== 'active' && (
                    <div className="absolute -top-3 right-4">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border
                        ${dept.status === 'beta' ? '' : ''}
                     `}>
                        {dept.status === 'beta' ? 'BETA' : 'COMING SOON'}
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-md bg-secondary border flex items-center justify-center text-foreground/80 mb-4">
                    {dept.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {dept.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {dept.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-sm bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {dept.status === 'active' ? (
                    <Link
                      href={dept.href}
                      className="inline-flex items-center gap-2 text-primary font-medium 
                        group-hover:gap-3 transition-all"
                    >
                      Explore {dept.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {dept.status === 'beta' ? 'Limited access' : 'Notify me'}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to build your AI workforce?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with our free plan and scale as you grow. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full 
                  font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3 glass rounded-full font-medium 
                  hover:bg-white/20 dark:hover:bg-white/10 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
