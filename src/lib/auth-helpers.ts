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
    
    // No businesses found - create one
    const email = user.email || 'user@example.com'
    const businessName = email.split('@')[0] + ' Space'
    
    const bootstrapResponse = await fetch('/api/backend/v1/businesses/bootstrap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: businessName,
        createDefaults: true
      })
    })
    
    if (!bootstrapResponse.ok) {
      throw new Error('Failed to create business')
    }
    
    const newBusiness = await bootstrapResponse.json()
    const businessId = newBusiness.business.id
    
    // Store in localStorage
    localStorage.setItem('businessId', businessId)
    return businessId
    
  } catch (error) {
    console.error('Error ensuring user business:', error)
    throw error
  }
}
