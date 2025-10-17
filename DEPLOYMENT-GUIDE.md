# 🚀 Deployment Guide & Testing Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Schema Migration
**CRITICAL:** Run this SQL in your Supabase SQL Editor before deploying:

```sql
-- See database-migrations.sql file for complete schema
```

The migration adds:
- `name`, `industry`, `company_size`, `website`, `description` columns to businesses table
- Row Level Security (RLS) policies
- Proper indexes for performance
- Updated_at triggers

### 2. Environment Variables
Verify these are set in your deployment platform (Netlify):

```
NEXT_PUBLIC_SUPABASE_URL=https://zoqqrvmfumzfnhdrgjyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=your-backend-api-url
```

### 3. Google OAuth Configuration
Ensure these redirect URLs are added in Google Console:
- `https://zoqqrvmfumzfnhdrgjyk.supabase.co/auth/v1/callback`
- `https://spaces.luno.org/auth/callback`
- `http://localhost:3000/auth/callback` (for local testing)

---

## 🧪 Complete Testing Flow

### Test 1: New User Signup (Email)
1. Go to `/signup`
2. If already logged in → should redirect to `/dashboard`
3. Enter email and password
4. Click "Create Account"
5. **Expected:** Onboarding wizard appears with 5 steps:
   - Welcome screen
   - Personal info (first name, last name)
   - Company info (company name, industry, size)
   - Optional details (website, description)
   - Success screen
6. Complete all steps
7. Click "Go to Dashboard"
8. **Expected:** Dashboard loads with:
   - Welcome message showing first name
   - Stats cards (all zeros for new users)
   - Quick actions section
   - Empty state for tasks

### Test 2: New User Signup (Google OAuth)
1. Sign out if logged in
2. Go to `/signup`
3. Click "Continue with Google"
4. Complete Google auth
5. **Expected:** Redirect to `/dashboard`
6. **Expected:** Onboarding wizard appears
7. Complete wizard
8. **Expected:** Dashboard loads successfully

### Test 3: Existing User Login (Email)
1. Sign out
2. Go to `/login`
3. If already logged in → should redirect to `/dashboard`
4. Enter credentials
5. Click "Sign In"
6. **Expected:** Redirect to `/dashboard`
7. **Expected:** NO onboarding wizard (already has workspace)
8. **Expected:** Dashboard shows actual data

### Test 4: Existing User Login (Google OAuth)
1. Sign out
2. Go to `/login`
3. Click "Continue with Google"
4. Complete auth
5. **Expected:** Redirect to `/dashboard`
6. **Expected:** Dashboard loads immediately (no onboarding)

### Test 5: Already Logged In Protection
1. While logged in, try to visit `/login`
2. **Expected:** Immediate redirect to `/dashboard`
3. Try to visit `/signup`
4. **Expected:** Immediate redirect to `/dashboard`

### Test 6: Mobile Scrolling
1. Open site on mobile device or DevTools mobile view
2. Go to homepage `/`
3. Try to scroll up and down
4. **Expected:** Scrolling works smoothly
5. **Expected:** Wave background responds to touch without blocking scroll

### Test 7: Navbar User Display
1. Log in with email account that has completed onboarding
2. Check navbar
3. **Expected:** Shows "FirstName L." format (e.g., "Parastus N.")
4. **Not** showing full email
5. Mobile menu should also show name

### Test 8: Dashboard Features
1. Log in to dashboard
2. **Expected Features:**
   - Clean, modern UI with gradient background
   - 4 stats cards with icons (Total, Completed, In Progress, Queued)
   - 3 quick action cards (Explore Spaces, Create Task, Upgrade Plan)
   - Recent Activity section
   - If no tasks: helpful empty state with CTA
   - If has tasks: list of recent tasks with status badges

### Test 9: Department Page Auth
1. While logged out, try to visit `/Spaces/marketing`
2. **Expected:** Redirect to `/login`
3. Log in
4. **Expected:** If no workspace → redirect to `/dashboard` which shows onboarding
5. **Expected:** If has workspace → marketing page loads

### Test 10: Sign Out Flow
1. Click "Sign Out" in navbar
2. **Expected:** Redirect to homepage
3. Try to visit `/dashboard`
4. **Expected:** Redirect to `/login`

---

## 🐛 Known Issues & Solutions

### Issue: "Not authenticated" error during onboarding
**Solution:** Fixed. Modal now uses `getSession()` instead of `getUser()`

### Issue: Login redirect loop
**Solution:** Fixed. Login now redirects to `/dashboard` instead of marketing page

### Issue: Mobile can't scroll on homepage
**Solution:** Fixed. Removed `e.preventDefault()` from touchmove event, set `passive: true`

### Issue: Navbar shows email instead of name
**Solution:** Fixed. Extracts first_name and last_name from user_metadata

---

## 📊 Database Verification

After running migrations, verify in Supabase:

```sql
-- Check businesses table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'businesses'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'businesses';

-- Check policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'businesses';
```

Expected columns in businesses table:
- `id` (uuid, primary key)
- `owner_id` (uuid, foreign key to auth.users)
- `name` (text)
- `industry` (text, nullable)
- `company_size` (text, nullable)
- `website` (text, nullable)
- `description` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

---

## 🚢 Deployment Steps

### Step 1: Run Database Migration
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `database-migrations.sql`
3. Click "Run"
4. Verify success message
5. Run verification queries above

### Step 2: Deploy Frontend
```bash
# Commit all changes
git add .
git commit -m "feat: complete auth flow, onboarding wizard, dashboard redesign"

# Push to main branch (triggers Netlify deployment)
git push origin main
```

### Step 3: Verify Deployment
1. Wait for Netlify build to complete
2. Visit https://spaces.luno.org
3. Test mobile scrolling
4. Test auth flows (signup, login, Google OAuth)
5. Test onboarding wizard
6. Test dashboard

### Step 4: Monitor for Errors
1. Check Netlify deploy logs
2. Check browser console for errors
3. Check Supabase logs for database errors
4. Check network tab for API failures

---

## 🎯 Success Criteria

✅ Mobile homepage scrolling works  
✅ New email signup → onboarding wizard → dashboard  
✅ New Google signup → onboarding wizard → dashboard  
✅ Existing user login → dashboard (no onboarding)  
✅ Logged-in users can't access /login or /signup  
✅ Navbar shows "FirstName L." format  
✅ Dashboard has clean, modern UI  
✅ No "Not authenticated" errors  
✅ No redirect loops  
✅ User metadata saved correctly  
✅ Business created with proper fields  
✅ RLS policies working  

---

## 🆘 Troubleshooting

### If onboarding doesn't appear:
1. Check browser console for errors
2. Verify user is authenticated: `await supabase.auth.getSession()`
3. Check if business exists in database
4. Clear localStorage and try again

### If business creation fails:
1. Check Supabase logs
2. Verify RLS policies
3. Verify owner_id matches auth.uid()
4. Check backend API is responding

### If navbar shows email:
1. User needs to complete onboarding (saves name to metadata)
2. Check user_metadata in Supabase Auth → Users
3. Sign out and back in to refresh session

### If mobile scroll doesn't work:
1. Clear browser cache
2. Verify waves-background.tsx has `passive: true` and no `e.preventDefault()`
3. Check for other elements with pointer-events blocking

---

## 📝 Files Changed

### New Files:
- `src/components/onboarding/OnboardingWizard.tsx` - Multi-step wizard
- `database-migrations.sql` - Database schema
- `DEPLOYMENT-GUIDE.md` - This file

### Modified Files:
- `src/components/ui/waves-background.tsx` - Fixed mobile scroll
- `src/app/login/page.tsx` - Redirect logged-in users, go to dashboard
- `src/app/signup/page.tsx` - Redirect logged-in users, show wizard
- `src/app/dashboard/page.tsx` - Complete redesign
- `src/components/layout/Navbar.tsx` - Show "FirstName L." format
- `src/lib/auth-helpers.ts` - Throw NO_WORKSPACE error
- `src/app/auth/callback/route.ts` - Redirect to dashboard
- `src/app/Spaces/marketing/page.tsx` - Handle NO_WORKSPACE

---

## 🎉 You're Ready to Deploy!

Follow the steps above and verify each test case. The auth flow is now solid and user-friendly!
