'use client'

import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'

export interface MissingInfo {
  profileFields: string[]
  businessFields: string[]
}

export function ProfileCompletionBanner({
  missing,
  onStart,
  onDismiss,
}: {
  missing: MissingInfo
  onStart: () => void
  onDismiss: () => void
}) {
  const items: string[] = []
  if (missing.profileFields.length) items.push(...missing.profileFields.map(f => `Profile: ${f}`))
  if (missing.businessFields.length) items.push(...missing.businessFields.map(f => `Workspace: ${f}`))

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 border border-yellow-300/30 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl p-4 flex items-start gap-4"
    >
      <div className="p-2 rounded-lg bg-yellow-500/10">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">Complete your profile for the full experience</p>
        {items.length > 0 && (
          <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
            {items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-2">
        <GlassButton onClick={onStart}>
          Complete now <ArrowRight className="w-4 h-4 ml-2" />
        </GlassButton>
        <GlassButton onClick={onDismiss} className="opacity-70 hover:opacity-100"> 
          Skip for now
        </GlassButton>
      </div>
    </motion.div>
  )
}
