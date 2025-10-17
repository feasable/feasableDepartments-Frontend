'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Sparkles, Zap, Shield, Users, BarChart3, MessageSquare, Cpu, ShieldCheck, Layers } from 'lucide-react'
import FuturisticDemo from '@/components/home/FuturisticDemo'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Dynamic imports to avoid SSR issues with Three.js
const DotScreenShader = dynamic(() => import('@/components/ui/dot-shader-background-simple').then(mod => ({ default: mod.DotScreenShader })), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-background via-background to-muted/20" />
})

// Removed Scene - causing SSR errors with Three.js
// Using CSS animations instead

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6])

  const Spaces = [
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
      {/* Hero Section with Dot Shader Background */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Animated Dot Shader Background */}
        <div className="absolute inset-0">
          <DotScreenShader />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-light tracking-tight mix-blend-exclusion text-white mb-6 leading-tight whitespace-normal"
          >
            Agentic Spaces That <br className="hidden md:block" />
            <span className="font-serif italic">Work Like Humans</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl font-light text-center text-white mix-blend-exclusion max-w-2xl mx-auto mb-12 leading-relaxed"
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium mix-blend-exclusion"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base border border-white/30 text-white rounded-full hover:border-white/60 hover:bg-white/10 transition-all duration-300 mix-blend-exclusion"
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
              Meet Your <span className="font-serif italic"><u>Spaces</u></span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Each Space is a specialized AI assistant trained to handle specific business functions autonomously
            </p>
          </motion.div>
          
          {/* Spaces Grid - Interactive Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Spaces.map((dept, i) => (
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
              href="/Spaces"
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

      {/* 3D Animated Features Section */}
      <section className="min-h-screen w-full bg-gradient-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8 relative">
        <div className="w-full max-w-6xl space-y-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="secondary" className="backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 px-4 py-2 rounded-full">
              ✨ Next Generation Tools
            </Badge>
            
            <div className="space-y-6 flex items-center justify-center flex-col">
              <h2 className="text-3xl md:text-6xl font-semibold tracking-tight max-w-3xl">
                Discover minimalism and power in one place
              </h2>
              <p className="text-lg text-neutral-300 max-w-2xl">
                Designed with aesthetics and performance in mind. Experience ultra-fast processing, advanced security, and intuitive design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/signup">
                  <Button className="text-sm px-8 py-3 rounded-xl bg-white text-black border border-white/10 shadow-none hover:bg-white/90 transition-none">
                    Get Started
                  </Button>
                </Link>
                <Link href="/about">
                  <Button className="text-sm px-8 py-3 rounded-xl bg-transparent text-white border border-white/20 shadow-none hover:bg-white/10 transition-none">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3">
              <Cpu size={18} className="text-white/80 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base font-medium">Performance</h3>
              <p className="text-xs md:text-sm text-neutral-400">Ultra-fast data processing in every situation.</p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3">
              <ShieldCheck size={18} className="text-white/80 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base font-medium">Security</h3>
              <p className="text-xs md:text-sm text-neutral-400">Advanced protection for complete peace of mind.</p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3">
              <Layers size={18} className="text-white/80 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base font-medium">Modularity</h3>
              <p className="text-xs md:text-sm text-neutral-400">Easy integration with existing architecture.</p>
            </div>
            
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3">
              <Zap size={18} className="text-white/80 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base font-medium">Responsiveness</h3>
              <p className="text-xs md:text-sm text-neutral-400">Instant response to every command.</p>
            </div>
          </div>
        </div>
        
        {/* CSS-only animated background - NO Three.js */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className="absolute inset-0 bg-gradient-to-br from-[#000] via-[#0a0a1a] to-[#1A2428]" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 121, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(138, 180, 248, 0.1) 0%, transparent 50%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }} />
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
              href="/Spaces"
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
