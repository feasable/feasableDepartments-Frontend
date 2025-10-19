#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const confirm = process.env.CONFIRM_DANGEROUS_RESET || process.env.CONFIRM

if (!url || !serviceKey) {
  console.error('Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY are required')
  process.exit(1)
}
if (confirm !== 'yes') {
  console.error('Refusing to run. Set CONFIRM_DANGEROUS_RESET=yes to proceed.')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function purgeUsers() {
  console.log('Purging auth users...')
  let page = 1
  let total = 0
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    const users = data?.users || []
    if (users.length === 0) break
    for (const u of users) {
      const { error: delErr } = await supabase.auth.admin.deleteUser(u.id)
      if (delErr) {
        console.error('  ✗ deleteUser', u.id, delErr.message)
      } else {
        total += 1
        if (total % 25 === 0) console.log(`  ✓ deleted ${total} users...`)
      }
    }
    page += 1
  }
  console.log(`Done. Deleted ${total} users.`)
}

async function deleteAllRows(table) {
  // With service role, RLS is bypassed. Delete all rows.
  // Using neq on a column avoids accidental full-table delete safeguards.
  // We pick an always-false condition for safety on non-uuid ids when needed.
  const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error && error.message?.toLowerCase().includes('column "id" does not exist')) {
    // Fallback: try deleting without condition
    const { error: err2 } = await supabase.from(table).delete()
    if (err2) throw new Error(`[${table}] delete failed: ${err2.message}`)
  } else if (error) {
    throw new Error(`[${table}] delete failed: ${error.message}`)
  }
}

async function fullReset() {
  console.log('Full reset: deleting rows from application tables...')
  // Children first, then parents.
  const order = [
    'task_events',
    'task_comments',
    'agent_runs',
    'integration_accounts',
    'business_members',
    'invitations',
    'tasks',
    'task_templates',
    'flows',
    'agents',
    'user_workspace_preferences',
    'notification_settings',
    'audit_logs',
    'profiles',
    'businesses'
  ]
  for (const t of order) {
    try {
      await deleteAllRows(t)
      console.log(`  ✓ cleared ${t}`)
    } catch (e) {
      console.error(`  ✗ failed clearing ${t}:`, e.message)
    }
  }
  await purgeUsers()
}

const mode = process.argv[2] || 'purge-users'
;(async () => {
  try {
    if (mode === 'purge-users') {
      await purgeUsers()
    } else if (mode === 'full-reset') {
      await fullReset()
    } else {
      console.error('Unknown mode. Use one of: purge-users | full-reset')
      process.exit(1)
    }
  } catch (e) {
    console.error('Reset error:', e.message)
    process.exit(1)
  }
})();
