import { createClient } from '@/lib/supabase/client'

export async function ensureUserBusiness(): Promise<string> {
  console.log('🔍 [AuthHelpers] ensureUserBusiness called')
  const supabase = createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('❌ [AuthHelpers] User not authenticated:', userError)
    throw new Error('UNAUTHENTICATED')
  }
  
  console.log('✅ [AuthHelpers] User ID:', user.id)

  try {
    console.log('🔍 [AuthHelpers] Trying backend API...')
    const response = await fetch('/api/backend/v1/me', {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })

    if (response.ok) {
      const userData = await response.json()
      console.log('✅ [AuthHelpers] Backend response received')

      // If user has businesses, return the first one's ID
      if (userData.businesses && userData.businesses.length > 0) {
        const businessId = userData.businesses[0].id
        console.log('✅ [AuthHelpers] Business from backend:', businessId)
        // Store in localStorage for convenience
        localStorage.setItem('businessId', businessId)
        return businessId
      }
      // No businesses found via backend
      console.log('📝 [AuthHelpers] No businesses in backend response')
      throw new Error('NO_WORKSPACE')
    }

    // Non-OK backend response: fall back to Supabase directly
    console.warn(`⚠️ [AuthHelpers] Backend not OK (${response.status}), falling back to Supabase...`)
    const { data: businesses, error: queryError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)

    if (queryError) {
      console.error('❌ [AuthHelpers] Supabase query error:', queryError)
      throw new Error('NO_WORKSPACE')
    }

    if (businesses && businesses.length > 0) {
      const businessId = businesses[0].id
      console.log('✅ [AuthHelpers] Business found in Supabase:', businessId)
      localStorage.setItem('businessId', businessId)
      return businessId
    }

    console.log('📝 [AuthHelpers] No business found in Supabase')
    throw new Error('NO_WORKSPACE')
    
  } catch (error: any) {
    console.log('⚠️ [AuthHelpers] Error caught:', error.message)
    
    // If timeout, try Supabase fallback
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.log('⏱️ [AuthHelpers] Backend timeout, using Supabase fallback...')
      try {
        const { data: businesses, error: queryError } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1)
        
        if (queryError) {
          console.error('❌ [AuthHelpers] Supabase fallback query error:', queryError)
          throw new Error('NO_WORKSPACE')
        }
        
        if (businesses && businesses.length > 0) {
          const businessId = businesses[0].id
          console.log('✅ [AuthHelpers] Business found via fallback:', businessId)
          localStorage.setItem('businessId', businessId)
          return businessId
        }
        
        console.log('📝 [AuthHelpers] No business in fallback query')
        throw new Error('NO_WORKSPACE')
      } catch (fallbackError) {
        console.error('❌ [AuthHelpers] Supabase fallback failed:', fallbackError)
        throw new Error('NO_WORKSPACE')
      }
    }
    
    throw error
  }
}
