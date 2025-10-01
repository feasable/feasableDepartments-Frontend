import { createClient } from '@/lib/supabase/client'

export async function ensureUserBusiness(): Promise<string> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  try {
    // Check if user has any businesses via our backend
    const response = await fetch('/api/backend/v1/me', {
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      // If backend is unavailable, check Supabase directly
      if (response.status === 503) {
        console.log('Backend unavailable, checking Supabase directly...')
        const { data: businesses } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1)
        
        if (businesses && businesses.length > 0) {
          const businessId = businesses[0].id
          localStorage.setItem('businessId', businessId)
          return businessId
        }
        
        // No business found
        throw new Error('NO_WORKSPACE')
      }
      throw new Error('Failed to fetch user data')
    }
    
    const userData = await response.json()
    
    // If user has businesses, return the first one's ID
    if (userData.businesses && userData.businesses.length > 0) {
      const businessId = userData.businesses[0].id
      // Store in localStorage for convenience
      localStorage.setItem('businessId', businessId)
      return businessId
    }
    
    // No businesses found - need to collect company info
    // Instead of auto-creating, throw specific error
    throw new Error('NO_WORKSPACE')
    
  } catch (error: any) {
    console.error('Error ensuring user business:', error)
    
    // If timeout, try Supabase fallback
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.log('Backend timeout, using Supabase fallback...')
      try {
        const { data: businesses } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1)
        
        if (businesses && businesses.length > 0) {
          const businessId = businesses[0].id
          localStorage.setItem('businessId', businessId)
          return businessId
        }
        
        throw new Error('NO_WORKSPACE')
      } catch (fallbackError) {
        console.error('Supabase fallback failed:', fallbackError)
        throw new Error('NO_WORKSPACE')
      }
    }
    
    throw error
  }
}
