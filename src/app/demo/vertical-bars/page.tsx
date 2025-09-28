'use client'

import VerticalBarsNoise from '@/components/ui/vertical-bars'

export default function VerticalBarsDemo() {
  return (
    <div className="relative min-h-screen">
      {/* Fixed background not affected by scroll */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <VerticalBarsNoise backgroundColor="#0b0f1a" lineColor="#4b5563" barColor="#cbd5e1" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-4">Vertical Bars Background</h1>
        <p className="text-muted-foreground mb-8">
          This background is rendered on a full-screen canvas and stays fixed while you scroll.
          You can change colors via props.
        </p>
        <div className="space-y-2 text-sm">
          <div>backgroundColor: #0b0f1a</div>
          <div>lineColor: #4b5563</div>
          <div>barColor: #cbd5e1</div>
        </div>
        <div className="h-[1200px]" />
      </div>
    </div>
  )
}
