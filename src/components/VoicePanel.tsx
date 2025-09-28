'use client'

import { useState, useEffect } from 'react'
import Vapi from '@vapi-ai/web'
import { toast } from 'sonner'

const ASSISTANTS = [
  {
    id: 'a40b760e-db1d-4926-a2ee-2da49a90b7dd',
    name: 'Sophia',
    role: 'Project Manager',
    department: 'project_management',
    icon: '📋'
  },
  {
    id: '15896b52-a57d-4e4d-92c9-6488fe254935',
    name: 'Max',
    role: 'Data Analyst',
    department: 'data_analytics',
    icon: '📊'
  },
  {
    id: 'd71f7d69-8631-424e-bf46-e75549ca2ca1',
    name: 'Isabel',
    role: 'Marketing Specialist',
    department: 'marketing',
    icon: '🎨'
  }
]

export default function VoicePanel() {
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [selectedAssistant, setSelectedAssistant] = useState(ASSISTANTS[0])
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!)
    setVapi(vapiInstance)

    vapiInstance.on('call-start', () => {
      setIsConnected(true)
      setIsListening(true)
      toast.success(`Connected to ${selectedAssistant.name}`)
    })

    vapiInstance.on('call-end', () => {
      setIsConnected(false)
      setIsListening(false)
      toast.info('Call ended')
    })

    vapiInstance.on('speech-start', () => {
      setIsListening(true)
    })

    vapiInstance.on('speech-end', () => {
      setIsListening(false)
    })

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error)
      toast.error('Voice connection error')
    })

    return () => {
      vapiInstance.stop()
    }
  }, [selectedAssistant])

  const handleStart = async () => {
    if (!vapi) return

    try {
      await vapi.start({
        assistantId: selectedAssistant.id,
        metadata: {
          userName: 'User', // TODO: Get from auth
          department: selectedAssistant.department
        }
      })
    } catch (error) {
      console.error('Failed to start call:', error)
      toast.error('Failed to connect to assistant')
    }
  }

  const handleStop = () => {
    if (vapi) {
      vapi.stop()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sketch-border">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2 font-mono">AI Assistants</h3>
        <p className="text-sm text-muted-foreground">
          Select an assistant and start talking
        </p>
      </div>

      {/* Assistant Selector */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {ASSISTANTS.map((assistant) => (
          <button
            key={assistant.id}
            onClick={() => setSelectedAssistant(assistant)}
            className={`p-3 rounded-md border-2 transition-all ${
              selectedAssistant.id === assistant.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-1">{assistant.icon}</div>
            <div className="font-mono text-xs font-bold">{assistant.name}</div>
            <div className="text-xs text-muted-foreground">{assistant.role}</div>
          </button>
        ))}
      </div>

      {/* Voice Control */}
      <div className="flex flex-col items-center space-y-4">
        {!isConnected ? (
          <button
            onClick={handleStart}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-mono font-bold"
          >
            Start Conversation
          </button>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-mono">
                {isListening ? 'Listening...' : 'Connected'}
              </span>
            </div>
            <button
              onClick={handleStop}
              className="w-full px-6 py-3 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-mono font-bold"
            >
              End Conversation
            </button>
          </>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assistant: {selectedAssistant.name}</span>
          <span className={`flex items-center ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="w-2 h-2 rounded-full bg-current mr-1" />
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}
