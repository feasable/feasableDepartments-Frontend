import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

async function proxy(req: NextRequest, params: { path?: string[] }) {
  if (!API_BASE) {
    return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 })
  }

  const segments = (params.path || []).join('/')
  const url = new URL(req.url)
  const target = `${API_BASE}/${segments}${url.search}`

  // Create a Supabase server client to read current session and attach JWT
  const cookieStore = cookies()
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // @ts-ignore - next/headers cookies supports set in route handlers
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        // @ts-ignore
        cookieStore.set({ name, value: '', ...options, expires: new Date(0) })
      },
    },
  })

  const { data } = await supabase.auth.getSession()
  const jwt = data.session?.access_token

  const headers = new Headers()
  // Pass through content-type if present
  const contentType = req.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  if (jwt) headers.set('authorization', `Bearer ${jwt}`)

  // Forward body except for GET/HEAD
  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: 'follow',
    // CRITICAL FIX: Add timeout to prevent infinite hanging
    signal: AbortSignal.timeout(5000), // 5 second timeout
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const body = await req.arrayBuffer()
    init.body = body
  }

  try {
    const upstream = await fetch(target, init)
    const resHeaders = new Headers(upstream.headers)
    // Avoid passing hop-by-hop headers
    resHeaders.delete('transfer-encoding')

    return new NextResponse(upstream.body, { status: upstream.status, headers: resHeaders })
  } catch (error: any) {
    console.error('Backend proxy error:', error.message)
    // Return proper error instead of hanging
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backend service unavailable', message: 'Request timed out' },
        { status: 503 }
      )
    }
    return NextResponse.json(
      { error: 'Backend service unavailable', message: error.message },
      { status: 503 }
    )
  }
}

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params)
}
export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params)
}
export async function PUT(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params)
}
export async function PATCH(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params)
}
export async function DELETE(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params)
}
export async function OPTIONS(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params)
}
