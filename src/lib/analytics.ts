type EventPayload = Record<string, any> | undefined

const debug = typeof window !== 'undefined' && (localStorage.getItem('analytics:debug') === '1')

function send(event: string, payload?: EventPayload) {
  try {
    if (debug) console.log(`[analytics] ${event}`, payload || {})
    // Placeholder for PostHog/Segment/etc.
    // e.g., window.posthog?.capture(event, payload)
  } catch {}
}

export const analytics = {
  track: (event: string, payload?: EventPayload) => send(event, payload),
}
