'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Zap, Shield, Users, BarChart3, MessageSquare } from 'lucide-react'
import VerticalBarsFixed from '@/components/ui/vertical-bars-fixed'
import InteractiveDemo from '@/components/home/InteractiveDemo'

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
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Marketing',
      desc: 'Content creation, campaign planning, and social media',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Data Analytics',
      desc: 'Reports, insights, and data visualization',
      color: 'from-green-400 to-emerald-400',
      beta: true
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Finance',
      desc: 'Invoicing, expense tracking, and financial reports',
      color: 'from-orange-400 to-red-400',
      soon: true
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      {/* Fixed Animated Background */}
      <VerticalBarsFixed 
        backgroundColor="#030712" 
        lineColor="#1f2937" 
        barColor="#6366f1" 
        animationSpeed={0.0003}
      />
      
      {/* Subtle Overlay for better text contrast */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/60 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">AI-powered departments for modern teams</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            AI Departments That
            <span className="text-gradient"> Work Like Humans</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Delegate tasks to specialized AI assistants via voice or text.
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
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-2xl hover:shadow-primary/25 transition-all"
            >
              Start Free Trial
              <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              className="px-8 py-4 glass rounded-full font-medium hover:bg-white/20 dark:hover:bg-white/10 transition-all"
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

      {/* Available Departments */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Available Departments</h2>
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
                className={`group relative p-6 rounded-2xl glass-card hover:scale-105 transition-all cursor-pointer ${
                  dept.soon ? 'opacity-60' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${dept.color} text-white`}>
                      {dept.icon}
                    </div>
                    {dept.beta && (
                      <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-500 rounded-full">BETA</span>
                    )}
                    {dept.soon && (
                      <span className="px-2 py-1 text-xs bg-gray-500/10 text-gray-500 rounded-full">SOON</span>
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
      <InteractiveDemo />

      {/* Quick Actions Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose FeasableDepartments</h2>
            <p className="text-xl text-muted-foreground">Everything you need to scale your business</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white">
                <Zap className="w-8 h-8" />
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                <MessageSquare className="w-8 h-8" />
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white">
                <Shield className="w-8 h-8" />
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
