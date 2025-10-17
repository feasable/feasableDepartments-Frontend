import { createClient } from '@/lib/supabase/client'
import type { UserProfile, OnboardingData } from '@/types/user'

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
  
  if (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

export async function completeOnboarding(
  userId: string,
  data: OnboardingData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_profiles')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      company_name: data.companyName,
      company_size: data.companySize,
      role: data.role,
      Spaces: data.Spaces,
      primary_goal: data.primaryGoal,
      phone: data.phone || null,
      onboarding_completed: true
    })
    .eq('id', userId)
  
  if (error) {
    console.error('Error completing onboarding:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

export async function checkOnboardingStatus(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.onboarding_completed || false
}
