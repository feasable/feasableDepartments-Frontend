export async function backend<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/backend${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    let msg = await res.text().catch(() => '')
    try {
      const j = JSON.parse(msg)
      msg = j?.error || msg
    } catch {}
    throw new Error(msg || `Backend error ${res.status}`)
  }
  return (await res.json()) as T
}
