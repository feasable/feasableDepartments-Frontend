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
      {/* Hero Section - Redesigned */}
      <section className="relative px-6 pt-24 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-6xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            AI <span className="font-serif italic">Spaces</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Each Space is a specialized AI assistant trained to handle specific business functions. 
            <br className="hidden md:block" />
            Deploy one or build your entire AI workforce—they work autonomously 24/7.
          </p>
        </motion.div>
      </section>

      {/* Spaces Grid - Redesigned */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group relative"
              >
                {/* Card */}
                <div className={`relative h-full p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden
                  ${dept.status !== 'active' ? 'opacity-70' : ''}
                `}>
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Status Badge */}
                    {dept.status !== 'active' && (
                      <div className="absolute -top-4 -right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${dept.status === 'beta' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/20'}
                        `}>
                          {dept.status === 'beta' ? 'BETA' : 'COMING SOON'}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {dept.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {dept.name} <span className="font-serif font-light text-lg">Space</span>
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {dept.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {dept.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {dept.status === 'active' ? (
                      <Link
                        href={dept.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <span>Launch Space</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {dept.status === 'beta' ? 'Request Access →' : 'Get Notified →'}
                      </button>
                    )}
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative px-6 pb-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Start Building Today</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Deploy Your <span className="font-serif italic">Spaces?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Start with our free plan and scale as you grow. Each Space works autonomously—no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg bg-foreground text-background rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg border-2 border-foreground/20 rounded-full font-semibold hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
