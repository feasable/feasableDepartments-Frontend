'use client'

import { motion } from 'framer-motion'
import { Building2, Users, Zap, Target, Award, Heart } from 'lucide-react'
import Link from 'next/link'

const values = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Innovation First',
    description: 'We push the boundaries of AI to create intelligent departments that truly understand business needs.'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Human-Centric AI',
    description: 'Our AI assistants are designed to augment human capabilities, not replace them.'
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Results Driven',
    description: 'We measure success by the real impact on your business growth and efficiency.'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Customer Success',
    description: 'Your success is our success. We provide continuous support and improvements.'
  }
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '1M+', label: 'Tasks Automated' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'AI Availability' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">About FeasableDepartments</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building the Future of
            <span className="text-gradient"> Work</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe every business deserves access to intelligent AI assistants. 
            Our mission is to democratize AI and make it feasible for companies of all sizes.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                FeasableDepartments was born from a simple observation: businesses spend 
                countless hours on repetitive tasks that could be automated intelligently.
              </p>
              <p>
                Founded by FeasableLabs, we set out to create AI departments that work 
                like human teams - understanding context, learning from feedback, and 
                delivering real results.
              </p>
              <p>
                Today, we're proud to help thousands of businesses scale their operations 
                with AI assistants that handle everything from marketing campaigns to 
                financial reports.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {value.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <Award className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Built by Experts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Our team includes AI researchers, enterprise architects, and business 
            strategists from leading tech companies and universities.
          </p>
          <div className="inline-flex gap-4 flex-wrap justify-center text-sm text-muted-foreground">
            <span>Ex-Google</span>
            <span>•</span>
            <span>Ex-Microsoft</span>
            <span>•</span>
            <span>Ex-Amazon</span>
            <span>•</span>
            <span>Stanford</span>
            <span>•</span>
            <span>MIT</span>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join the AI Revolution
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start automating your business processes with intelligent AI departments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full 
                  font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 glass rounded-full font-medium 
                  hover:bg-white/20 dark:hover:bg-white/10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
