# End-to-end Flow Scenarios

This document enumerates key user journeys to validate across environments.

## 1. New user → email sign up → onboarding → dashboard
- Start at `/auth`.
- Enter new email → password → confirm password.
- Expect: account created, session established, redirect to `/dashboard`.
- Dashboard: no workspace → onboarding wizard opens.
- Complete company step → workspace created → banner hidden.
- Create first task → appears in Recent Activity with status `queued`.

## 2. Returning user → email sign in
- Start at `/auth`.
- Enter existing email/password.
- Expect: session established, ensure business, redirect to `/dashboard`.
- Banner appears only if profile/workspace incomplete.

## 3. OAuth sign in (Google/GitHub)
- Start at `/auth`.
- Click Google/GitHub.
- OAuth provider redirects to `/auth/callback`.
- `exchangeCodeForSession()` runs → redirect `/dashboard`.

## 4. Magic link
- `/auth` → send magic link.
- Click link in email → returns to `/auth/callback`.
- Expect dashboard after session exchange.

## 5. Invite acceptance
- Visit `/invite/:token` while signed in.
- Backend endpoint accepts invite → returns `businessId` and `role`.
- App stores `businessId` → reloads dashboard.
- If backend unavailable: show error with retry; no silent fail.

## 6. Multi-workspace toggle
- Signed in with access to 2+ businesses.
- Use workspace switcher in navbar/sidebar.
- Expect: `businessId` updates, dashboard reloads with that context.

## 7. Offline backend fallback
- Backend `/api/backend` unavailable.
- `ensureUserBusiness()` falls back to Supabase query for workspace.
- Dashboard remains functional; tasks list may be empty but no crash.

## 8. Session delay
- After redirect from auth provider, dashboard waits up to 4s for session.
- No redirect loop to `/auth` while session is in transit.

## 9. Error handling
- Wrong password → stays on password step, shows error.
- Sign up with existing email → switches to password step silently.
- Invite token invalid/expired → error display in invite page with CTA to contact owner.

## 10. Accessibility
- All interactive controls reachable via keyboard.
- Aria labels for social buttons and primary CTAs.

## 11. Analytics events
- `auth_*` events on clicks and successes.
- `onboarding_*` open/skip/complete.
- `dashboard_viewed`, `task_created`, `workspace_switched`.

