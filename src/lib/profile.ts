import { createClient } from '@/lib/supabase/client'
import { getBusinessId } from '@/lib/tenant'

export type Completeness = {
  profileComplete: boolean
  businessComplete: boolean
  hasWorkspace: boolean
  missing: {
    profileFields: string[]
    businessFields: string[]
  }
}

export async function checkCompleteness(): Promise<Completeness> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      profileComplete: false,
      businessComplete: false,
      hasWorkspace: false,
      missing: { profileFields: ['auth'], businessFields: [] }
    }
  }

  // Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name,last_name,full_name')
    .eq('id', user.id)
    .maybeSingle()

  const profileMissing: string[] = []
  const first = (profile as any)?.first_name || user.user_metadata?.first_name
  const last = (profile as any)?.last_name || user.user_metadata?.last_name
  const full = (profile as any)?.full_name || user.user_metadata?.full_name
  if (!first) profileMissing.push('first_name')
  if (!last) profileMissing.push('last_name')
  if (!full && (first && last)) {
    // not required, but helpful
  }
  const profileComplete = profileMissing.length === 0

  // Business
  let businessId = getBusinessId()
  if (!businessId) {
    const { data: owned } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
    if (owned && owned.length > 0) businessId = owned[0].id
  }

  let businessMissing: string[] = []
  let businessComplete = false
  let hasWorkspace = !!businessId

  if (businessId) {
    const { data: biz } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', businessId)
      .maybeSingle()
    const name = (biz as any)?.name
    if (!name) businessMissing.push('business_name')
    businessComplete = businessMissing.length === 0
  }

  return {
    profileComplete,
    businessComplete,
    hasWorkspace,
    missing: { profileFields: profileMissing, businessFields: businessMissing }
  }
}
