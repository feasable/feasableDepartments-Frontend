'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getBusinessId, setBusinessId } from '@/lib/tenant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { analytics } from '@/lib/analytics'

export default function SettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  // Profile state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  // Business state
  const [bizId, setBizId] = useState<string | null>(null)
  const [bizName, setBizName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingBusiness, setSavingBusiness] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast.error('Please sign in')
          window.location.href = '/auth'
          return
        }
        // Profile: prefer table, fallback to metadata
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name,last_name,full_name,avatar_url')
          .eq('id', user.id)
          .maybeSingle()
        const pf = profile as any
        setFirstName(pf?.first_name || user.user_metadata?.first_name || '')
        setLastName(pf?.last_name || user.user_metadata?.last_name || '')
        setFullName(pf?.full_name || user.user_metadata?.full_name || '')
        setAvatarUrl(pf?.avatar_url || user.user_metadata?.avatar_url || '')

        // Business ID
        let id = getBusinessId()
        if (!id) {
          // Try membership first
          const { data: mem } = await supabase
            .from('business_members')
            .select('business_id')
            .eq('user_id', user.id)
            .limit(1)
          if (mem && mem.length > 0) id = mem[0].business_id as string
          // Owner fallback
          if (!id) {
            const { data: own } = await supabase
              .from('businesses')
              .select('id')
              .eq('owner_id', user.id)
              .limit(1)
            if (own && own.length > 0) id = own[0].id as string
          }
          if (id) setBusinessId(id)
        }
        setBizId(id || null)

        if (id) {
          const { data: biz } = await supabase
            .from('businesses')
            .select('name,industry,company_size,website,description')
            .eq('id', id)
            .maybeSingle()
          const b = biz as any
          setBizName(b?.name || '')
          setIndustry(b?.industry || '')
          setCompanySize(b?.company_size || '')
          setWebsite(b?.website || '')
          setDescription(b?.description || '')
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveProfile = async () => {
    setSavingProfile(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      // Update auth metadata
      const { error: metaErr } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName, full_name: fullName, avatar_url: avatarUrl }
      })
      if (metaErr) throw metaErr

      // Upsert profiles table
      const { error: upErr } = await supabase
        .from('profiles')
        .upsert({ id: user.id, first_name: firstName, last_name: lastName, full_name: fullName, avatar_url: avatarUrl })
      if (upErr) throw upErr

      analytics.track('settings_saved', { scope: 'profile' })
      toast.success('Profile saved')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const saveBusiness = async () => {
    if (!bizId) return
    setSavingBusiness(true)
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ name: bizName, industry, company_size: companySize, website, description })
        .eq('id', bizId)
      if (error) throw error

      analytics.track('settings_saved', { scope: 'business' })
      toast.success('Workspace saved')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save workspace (owner permission may be required)')
    } finally {
      setSavingBusiness(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-10 py-6">
        <section className="bg-card rounded-2xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first">First name</Label>
              <Input id="first" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Last name</Label>
              <Input id="last" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full">Full name</Label>
              <Input id="full" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input id="avatar" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </section>

        <section className="bg-card rounded-2xl border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Workspace</h2>
            {bizId && <span className="text-xs text-muted-foreground">{bizId}</span>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Company name</Label>
              <Input id="name" value={bizName} onChange={e => setBizName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={industry} onChange={e => setIndustry(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Company size</Label>
              <Input id="size" value={companySize} onChange={e => setCompanySize(e.target.value)} placeholder="e.g., 1-10" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourcompany.com" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <textarea id="desc" className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={saveBusiness} disabled={savingBusiness}>
              {savingBusiness ? 'Saving...' : 'Save Workspace'}
            </Button>
          </div>
        </section>
      </div>
    </DashboardShell>
  )
}
