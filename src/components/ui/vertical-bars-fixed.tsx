'use client'

import VerticalBarsNoise from '@/components/ui/vertical-bars'

export default function VerticalBarsFixed(props: React.ComponentProps<typeof VerticalBarsNoise>) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <VerticalBarsNoise {...props} />
    </div>
  )
}
