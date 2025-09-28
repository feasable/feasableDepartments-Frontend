export function getBusinessId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('businessId')
  } catch {
    return null
  }
}

export function setBusinessId(id: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('businessId', id)
  } catch {}
}
