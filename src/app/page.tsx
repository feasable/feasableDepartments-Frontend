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
              <span>Start Free</span>
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
      </section>

      {/* AI Spaces Showcase - Futuristic & Dynamic */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Meet Your <span className="font-serif italic">Spaces</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Each Space is a specialized AI assistant trained to handle specific business functions autonomously
            </p>
          </motion.div>
          
          {/* Spaces Grid - Interactive Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative ${dept.soon ? 'opacity-60' : ''}`}
              >
                {/* Card */}
                <div className="relative h-full p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon & Badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {dept.icon}
                      </div>
                      {dept.beta && (
                        <span className="px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full">BETA</span>
                      )}
                      {dept.soon && (
                        <span className="px-3 py-1 text-xs font-semibold bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/20 rounded-full">SOON</span>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {dept.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {dept.desc}
                    </p>
                    
                    {/* Explore Link */}
                    {!dept.soon && (
                      <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Explore Space</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg border-2 border-foreground/20 rounded-full font-semibold hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300"
            >
              View All Spaces
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <div id="demo">
        <FuturisticDemo />
      </div>

      {/* Why Work with feasableSpaces Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background with Image Slider */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        </div>
        
        <div className="relative z-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why Work with <span className="font-serif italic">feasableSpaces</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform your business with AI-powered departments that work 24/7
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast Setup</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get started in under 2 minutes. No technical knowledge required. Your AI workforce is ready to work immediately.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Natural Communication</h3>
              <p className="text-muted-foreground leading-relaxed">
                Talk to your AI team via voice or text, just like human colleagues. No complex commands or interfaces.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-level encryption, SOC 2 compliant, and GDPR ready. Your data stays private and secure, always.
              </p>
            </motion.div>
          </div>

          {/* Additional Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Scales With Your Team</h4>
                <p className="text-sm text-muted-foreground">From solo founders to enterprise teams, feasableSpaces grows with you</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Real-Time Analytics</h4>
                <p className="text-sm text-muted-foreground">Track performance, measure ROI, and optimize your AI workforce in real-time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          {/* Main Content */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Build Your <br className="hidden md:block" />
              <span className="font-serif italic">AI Workforce?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Join innovative teams using AI Spaces to automate workflows, boost productivity, and scale faster
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg bg-foreground text-background rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/departments"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg border-2 border-foreground/20 rounded-full font-semibold hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300"
            >
              Explore Spaces
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>5 free messages to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
