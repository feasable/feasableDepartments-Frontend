'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

interface Department {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  sample: string
}

const departments: Department[] = [
  {
    id: 'marketing',
    name: 'Marketing Specialist: Mira',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Content, campaigns & analytics',
    sample: 'Create a social media campaign for Q4'
  },
  {
    id: 'project',
    name: 'Project Manager: Freja',
    icon: <Users className="w-5 h-5" />,
    description: 'Planning & coordination',
    sample: 'Create a project roadmap for new feature'
  },
  {
    id: 'analytics',
    name: 'Data Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Reports & insights',
    sample: 'Analyze Q3 performance metrics'
  }
]

export default function FuturisticDemo() {
  const [selectedDept, setSelectedDept] = useState(departments[0])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [response, setResponse] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    
    setIsTyping(true)
    setResponse('')
    
    const responses: Record<string, string> = {
      marketing: `Hi! I'm Mira, your Marketing Specialist. I'll create a comprehensive Q4 campaign including:\n\n✓ Content calendar with daily posts\n✓ Platform-specific strategies (Instagram, LinkedIn, Twitter)\n✓ Hashtag research and trending topics\n✓ Visual asset recommendations\n✓ Performance tracking metrics\n\nI'll have the complete campaign brief ready in your workspace within 2 hours. Would you like me to also prepare competitor analysis?`,
      project: `Hello! I'm Freja, your Project Manager. For your new feature roadmap, I'll deliver:\n\n✓ Detailed timeline with milestones\n✓ Resource allocation plan\n✓ Risk assessment matrix\n✓ Sprint breakdown (2-week cycles)\n✓ Stakeholder communication plan\n\nI'll coordinate with your team and have the roadmap ready by end of day. Should I also set up the project tracking board?`,
      analytics: `I'll analyze your Q3 performance with:\n\n✓ KPI dashboard with trends\n✓ Revenue analysis by segment\n✓ Customer behavior insights\n✓ Predictive modeling for Q4\n✓ Actionable recommendations\n\nReport will be ready in 30 minutes. Sign up to get the full analysis!`
    }
    
    setTimeout(() => {
      setResponse(responses[selectedDept.id] || responses.analytics)
      setIsTyping(false)
    }, 2000)
  }

  const useSample = () => {
    setInput(selectedDept.sample)
  }

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet the <span className="font-serif italic">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chat with our AI departments and see how they can transform your workflow
          </p>
        </motion.div>

        {/* Department Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className={`group relative px-6 py-3 rounded-full transition-all duration-300 ${
                selectedDept.id === dept.id
                  ? 'bg-foreground text-background'
                  : 'border border-foreground/20 hover:border-foreground/40'
              }`}
            >
              <div className="flex items-center gap-2">
                {dept.icon}
                <span className="font-medium">{dept.name}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Assistant Info */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border">
              {selectedDept.icon}
              <div className="text-left">
                <div className="font-semibold">{selectedDept.name} Assistant</div>
                <div className="text-sm text-muted-foreground">{selectedDept.description}</div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="relative">
            <div className="relative rounded-2xl border-2 border-foreground/20 bg-card overflow-hidden focus-within:border-foreground/40 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={`Ask ${selectedDept.name} assistant anything...`}
                className="w-full px-6 py-4 bg-transparent resize-none focus:outline-none min-h-[120px]"
                rows={3}
              />
              <div className="flex items-center justify-between px-6 py-3 border-t border-foreground/10">
                <button
                  onClick={useSample}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Try: {selectedDept.sample}
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Response */}
          <AnimatePresence>
            {(isTyping || response) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-6 rounded-2xl bg-card border"
              >
                {isTyping ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>{selectedDept.name} is thinking...</span>
                  </div>
                ) : (
                  <p className="leading-relaxed">{response}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ready for the full experience? Get unlimited messages and all departments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-foreground rounded-full hover:bg-foreground hover:text-background transition-all font-medium"
              >
                Start Free Trial
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 border border-foreground/30 rounded-full hover:border-foreground/60 hover:bg-foreground/5 transition-all"
              >
                View Pricing
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
