'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Users, 
  BarChart3, 
  TrendingUp,
  FileText,
  Calendar,
  DollarSign,
  Shield,
  Loader2,
  Bot,
  User
} from 'lucide-react'
import { toast } from 'sonner'
import { ensureUserBusiness } from '@/lib/auth-helpers'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  department?: string
  timestamp: Date
}

interface Department {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  gradient: string
  description: string
  sampleTasks: string[]
  responses: string[]
}

const departments: Department[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Content creation, campaigns, and analytics',
    sampleTasks: [
      'Create a social media campaign for Q4',
      'Write blog posts about AI productivity',
      'Analyze competitor marketing strategies'
    ],
    responses: [
      "I'll create a comprehensive Q4 social media campaign focusing on holiday themes and year-end promotions. I'll include content calendars, post templates, and hashtag strategies across all platforms.",
      "I'll develop a series of blog posts about AI productivity, covering topics like automation benefits, implementation strategies, and ROI metrics. Each post will be SEO-optimized and include engaging visuals.",
      "I'll conduct a thorough competitive analysis examining their content strategy, ad spend patterns, and engagement metrics. You'll receive a detailed report with actionable insights."
    ]
  },
  {
    id: 'project',
    name: 'Project Management',
    icon: <Users className="w-5 h-5" />,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Task planning, timeline management, and coordination',
    sampleTasks: [
      'Create a project roadmap for the new feature',
      'Set up sprint planning for next month',
      'Track team productivity metrics'
    ],
    responses: [
      "I'll create a detailed project roadmap with milestones, dependencies, and resource allocation. The timeline will include risk assessments and contingency plans for each phase.",
      "I'll organize the sprint planning with user stories, story points, and capacity planning. Each sprint will have clear goals, acceptance criteria, and team assignments.",
      "I'll set up comprehensive productivity tracking with burndown charts, velocity metrics, and team performance indicators. You'll get weekly reports with trend analysis."
    ]
  },
  {
    id: 'analytics',
    name: 'Data Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Reports, insights, and data visualization',
    sampleTasks: [
      'Generate monthly performance report',
      'Analyze customer behavior patterns',
      'Create KPI dashboard'
    ],
    responses: [
      "I'll compile a comprehensive monthly performance report with key metrics, trend analysis, and actionable recommendations. The report will include interactive visualizations and executive summaries.",
      "I'll analyze customer behavior using cohort analysis, segmentation, and journey mapping. You'll receive insights on engagement patterns, churn risks, and opportunity areas.",
      "I'll design an interactive KPI dashboard with real-time data updates, customizable views, and drill-down capabilities. It will track all critical business metrics with alert thresholds."
    ]
  }
]

export default function InteractiveDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedDept, setSelectedDept] = useState(departments[0])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [suggestedTask, setSuggestedTask] = useState(0)
  const [creatingTask, setCreatingTask] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content?: string) => {
    const messageContent = content || inputValue
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const taskIndex = selectedDept.sampleTasks.findIndex(task => 
        task.toLowerCase().includes(messageContent.toLowerCase().slice(0, 20))
      )
      
      const responseIndex = taskIndex !== -1 ? taskIndex : Math.floor(Math.random() * selectedDept.responses.length)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: selectedDept.responses[responseIndex],
        department: selectedDept.name,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
      setSuggestedTask((prev) => (prev + 1) % selectedDept.sampleTasks.length)
    }, 2000)
  }

  const createTaskFromLast = async () => {
    try {
      const lastUser = [...messages].reverse().find(m => m.role === 'user')
      if (!lastUser) {
        toast.error('No user message to convert')
        return
      }
      setCreatingTask(true)
      const businessId = await ensureUserBusiness()
      const title = lastUser.content.slice(0, 80)
      const description = `From demo · ${selectedDept.name}: ${lastUser.content}`
      const res = await fetch('/api/backend/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          priority: 'medium',
          department: selectedDept.id === 'project' ? 'project_management' : selectedDept.id,
          businessId,
        })
      })
      if (!res.ok) {
        if (res.status === 401) throw new Error('Sign in to save tasks')
        const msg = (await res.json())?.error || 'Failed to create task'
        throw new Error(msg)
      }
      toast.success('Task saved to your Marketing space')
    } catch (e: any) {
      toast.error(e?.message || 'Could not save task')
    } finally {
      setCreatingTask(false)
    }
  }

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background/60 mb-6">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium tracking-tight">Try it now - No signup required</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Meet the Team!
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Chat with our AI departments and see how they can transform your workflow.
          This is just a demo - imagine the full power with your account.
        </p>
      </motion.div>

      {/* Demo Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
          {/* Department Selector */}
          <div className="border-b border-border/50 p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {departments.map((dept) => (
                <motion.button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDept(dept)
                    setMessages([])
                    setSuggestedTask(0)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors whitespace-nowrap ${
                    selectedDept.id === dept.id
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {dept.icon}
                  <span className="font-medium">{dept.name}</span>
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedDept.description}
            </p>
          </div>

          {/* Chat Interface */}
          <div className="relative h-[500px] flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedDept.name} Assistant Ready
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Ask me anything about {selectedDept.name.toLowerCase()}
                  </p>
                  
                  {/* Sample Tasks */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Try asking:</p>
                    {selectedDept.sampleTasks.map((task, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleSendMessage(task)}
                        className="block w-full text-left px-4 py-2 rounded-md border bg-background hover:bg-muted transition-colors text-sm"
                      >
                        "{task}"
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex gap-3 ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-md bg-secondary border flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        
                        <div className={`max-w-[70%] ${
                          message.role === 'user'
                            ? 'bg-foreground text-background'
                            : 'bg-secondary'
                        } rounded-md px-4 py-3`}>
                          {message.department && (
                            <div className="text-xs opacity-70 mb-1">
                              {message.department} Assistant
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="w-8 h-8 rounded-md bg-secondary border flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-md bg-secondary border flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-secondary rounded-md px-4 py-3">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-current rounded-full opacity-60"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                            className="w-2 h-2 bg-current rounded-full opacity-60"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-current rounded-full opacity-60"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask ${selectedDept.name} assistant...`}
                  className="flex-1 px-4 py-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isTyping || !inputValue.trim()}
                  className="p-3 rounded-md bg-foreground text-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </form>
              {messages.length > 0 && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    This is a demo. Real assistants provide deeper insights.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={createTaskFromLast}
                      disabled={creatingTask || !messages.some(m => m.role === 'user')}
                      className="text-xs px-3 py-1.5 rounded-md border bg-background hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {creatingTask ? 'Saving…' : 'Save last as task'}
                    </button>
                    <button
                      onClick={() => {
                        setMessages([])
                        setSuggestedTask(0)
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Below Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground mb-4">
            Ready for the full experience? Get unlimited messages and all departments.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Start Free
            </motion.a>
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass rounded-full font-medium hover:bg-white/20 dark:hover:bg-white/10 transition-all"
            >
              View Pricing
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
