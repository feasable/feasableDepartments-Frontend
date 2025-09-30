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
    const response = await fetch('/api/backend/v1/me')
    if (!response.ok) {
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
    
  } catch (error) {
    console.error('Error ensuring user business:', error)
    throw error
  }
}
