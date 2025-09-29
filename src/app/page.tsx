'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Users, BarChart3, MessageSquare } from 'lucide-react'
import VerticalBarsFixed from '@/components/ui/vertical-bars-fixed'
import { Waves } from '@/components/ui/waves-background'
import FuturisticDemo from '@/components/home/FuturisticDemo'
import { GlassButton } from '@/components/ui/glass-button'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6])

  const departments = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Project Management',
      desc: 'Task breakdown, timeline management, and resource allocation',
      color: ''
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Marketing',
      desc: 'Content creation, campaign planning, and social media',
      color: ''
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Data Analytics',
      desc: 'Reports, insights, and data visualization',
      color: '',
      beta: true
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Finance',
      desc: 'Invoicing, expense tracking, and financial reports',
      color: '',
      soon: true
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      {/* Fixed Animated Background */}
      <VerticalBarsFixed 
        backgroundColor="#0b0f1a" 
        lineColor="#334155" 
        barColor="#93c5fd" 
        animationSpeed={0.0003}
      />
      
      {/* Subtle Overlay for better text contrast */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Waves background overlay for hero only */}
        <div className="absolute inset-0 -z-0 pointer-events-none opacity-30">
          <Waves className="h-full w-full" lineColor="#64748b" backgroundColor="transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Agentic Departments That <br className="hidden md:block" />
            <span className="font-serif italic">Work Like Humans</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Delegate tasks to specialized AI assistants via voice or text. <br className="hidden md:block" />
            They'll handle your business operations autonomously.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base border-2 border-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-300 font-medium"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base border border-foreground/30 rounded-full hover:border-foreground/60 hover:bg-foreground/5 transition-all duration-300"
            >
              Watch Demo
            </Link>
          </motion.div>
        </div>
        
        {/* Floating animation element */}
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Available Departments (monochrome geometric) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-2">Departments</h2>
            <p className="text-xl text-muted-foreground">Choose your AI team members</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-6 card-elevated cursor-pointer ${dept.soon ? 'opacity-60' : ''}`}
              >
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center text-foreground/80 border">
                      {dept.icon}
                    </div>
                    {dept.beta && (
                      <span className="px-2 py-0.5 text-xs border rounded-md">BETA</span>
                    )}
                    {dept.soon && (
                      <span className="px-2 py-0.5 text-xs border rounded-md">SOON</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{dept.title}</h3>
                  <p className="text-muted-foreground">{dept.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <div id="demo">
        <FuturisticDemo />
      </div>

      {/* Quick Actions Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose feasableSpaces</h2>
            <p className="text-xl text-muted-foreground">Everything you need to scale your business</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-md border flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Instant Setup</h3>
              <p className="text-sm text-muted-foreground">No complex configuration needed</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-md border flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Voice or Text</h3>
              <p className="text-sm text-muted-foreground">Communicate naturally with your AI team</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-md border flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">Your data is encrypted and secure</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl glass-card"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using AI departments
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-2xl hover:shadow-primary/25 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · 5 free messages
          </p>
        </motion.div>
      </section>
    </div>
  )
}
