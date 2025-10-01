# 🧪 COMPLETE TESTING GUIDE
## Sign Up → Onboarding → Dashboard Flow

---

## 🎯 OBJECTIVE
Verify that a user can:
1. ✅ Sign up with email
2. ✅ See bright onboarding modal  
3. ✅ Complete all onboarding steps
4. ✅ Have business created in Supabase
5. ✅ See dashboard with their data
6. ✅ Zero errors in console (except DevTools bugs)

---

## 📋 PRE-TEST CHECKLIST

### ✅ Step 1: Database Setup (CRITICAL!)
```sql
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- Copy contents of: COMPLETE-DATABASE-SETUP.sql
-- Paste and click "Run"
-- Look for success messages
```

**Verification:**
```sql
-- Run this to verify setup:
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'businesses'
ORDER BY ordinal_position;

-- Should show: id, owner_id, name, industry, company_size, website, description, created_at, updated_at
```

---

### ✅ Step 2: Disable Email Confirmation
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/settings
2. Scroll to "Email Auth"
3. Find "Confirm email" toggle
4. **TURN IT OFF** (must be disabled for testing)
5. Click "Save"

**Why?** Email confirmation requires checking inbox, which slows testing.

---

### ✅ Step 3: Update Netlify Environment Variables
1. Go to: https://app.netlify.com/sites/YOUR_SITE/settings/deploys
2. Click "Environment variables"
3. Find or add these variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.feasable.org
NEXT_PUBLIC_SUPABASE_URL=https://zoqqrvmfumzfnhdrgjyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**CRITICAL:** Use `https://` NOT `http://` for production!

4. Click "Save"
5. Trigger new deploy (changes require redeploy)

---

### ✅ Step 4: Deploy Code
```bash
# In your terminal
git add .
git commit -m "fix: complete signup to dashboard flow with logging"
git push origin main
```

Wait for Netlify deploy to finish (~2 minutes).

---

## 🧪 TEST EXECUTION

### Test 1: Fresh Sign Up Flow

#### 1.1 Navigate to Site
- Open: https://spaces.feasable.org
- **Open DevTools** (F12) → Go to Console tab
- Keep it open to see all our debugging logs

#### 1.2 Click "Get Started"
- Expected: Redirects to `/signup` page
- Page should load with image slider and form

#### 1.3 Fill Sign Up Form
- Email: `test+001@example.com` (use + to create unique emails)
- Password: `test123456`
- Confirm Password: `test123456`
- Click "Create Account"

#### 1.4 Watch Console Logs
You should see:
```
🔍 [Signup] Creating account...
✅ [Signup] Account created successfully
```

#### 1.5 Onboarding Modal Appears
**Visual Check:**
- ✅ Modal is BRIGHT WHITE (not dark gray)
- ✅ Has clear visible borders
- ✅ Shows "Welcome to FeasableSpaces! 🎉"
- ✅ Has "Get Started" button

**Screenshot this if it looks wrong!**

#### 1.6 Complete Step 1: Welcome
- Click "Get Started"

#### 1.7 Complete Step 2: Personal Info
- First Name: `John`
- Last Name: `Doe`
- Click "Continue"

#### 1.8 Complete Step 3: Company
- Company Name: `Test Company`
- Click "Continue"

#### 1.9 Complete Step 4: Details (Optional)
- Industry: `Technology` (optional)
- Company Size: `1-10` (optional)  
- Website: `www.test.com` (optional)
- Description: `Test description` (optional)
- Click "Complete Setup"

#### 1.10 Watch Console During Submit
You should see this sequence:
```
🔍 [Onboarding] Getting session...
✅ [Onboarding] User authenticated: <user-id>
🔍 [Onboarding] Updating user metadata...
✅ [Onboarding] User metadata updated
🔍 [Onboarding] Creating new business in Supabase...
✅ [Onboarding] Business created: <business-id>
🎉 [Onboarding] Complete! Showing success screen...
```

**If you see ❌ errors, STOP and screenshot the console!**

#### 1.11 Success Screen
- ✅ Shows "You're all set! 🚀"
- ✅ Has "Go to Dashboard" button
- Click the button (or wait for auto-redirect)

#### 1.12 Dashboard Loads
Watch console:
```
🔍 [Dashboard] Checking authentication...
✅ [Dashboard] User authenticated: <user-id>
🔍 [Dashboard] Business ID from localStorage: <business-id>
✅ [Dashboard] Using cached business ID
```

**Visual Check:**
- ✅ Dashboard page loads
- ✅ Shows "Welcome back, John! 👋"
- ✅ Stats cards visible (Total Tasks, Completed, In Progress, Queued)
- ✅ Shows "No tasks yet" empty state
- ✅ Navbar shows user email

**If stuck on "Loading your workspace..." → Check console for errors**

---

### Test 2: Verify Database

#### 2.1 Check Supabase Auth Table
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/editor
2. Click "Authentication" → "Users"
3. Find your test user (`test+001@example.com`)
4. Click on the user row
5. Check "User metadata" section:
   - ✅ `first_name`: "John"
   - ✅ `last_name`: "Doe"
   - ✅ `full_name`: "John Doe"

#### 2.2 Check Businesses Table
1. Go to "Table Editor"
2. Select `businesses` table
3. You should see 1 row:
   - ✅ `id`: Some UUID
   - ✅ `owner_id`: Matches your user ID
   - ✅ `name`: "Test Company"
   - ✅ `industry`: "Technology"
   - ✅ `company_size`: "1-10"
   - ✅ `website`: "www.test.com"
   - ✅ `description`: "Test description"
   - ✅ `created_at`: Recent timestamp

**Screenshot the row if anything is wrong!**

---

### Test 3: Session Persistence

#### 3.1 Refresh Dashboard
- Press F5 while on dashboard
- ✅ Should reload dashboard immediately
- ✅ No redirect to login
- ✅ Shows same user data

#### 3.2 Direct Navigation
- Close browser tab
- Open new tab
- Go to: https://spaces.feasable.org/dashboard
- ✅ Loads directly to dashboard
- ✅ No login prompt

---

### Test 4: Logout & Login

#### 4.1 Logout
- Click user menu in navbar
- Click "Logout"
- ✅ Redirects to homepage or login

#### 4.2 Login Again
- Go to: https://spaces.feasable.org/login
- Email: `test+001@example.com`
- Password: `test123456`
- Click "Sign In"

Watch console:
```
🔍 [Login] Signing in...
✅ [Login] Login successful
🔍 [Dashboard] Checking authentication...
✅ [Dashboard] User authenticated: <user-id>
🔍 [Dashboard] Business ID from localStorage: <business-id>
✅ [Dashboard] Using cached business ID
```

- ✅ Loads dashboard
- ✅ **No onboarding modal** (business already exists)
- ✅ Shows same data as before

---

### Test 5: New User (Second Account)

Repeat Test 1 with:
- Email: `test+002@example.com`
- First Name: `Jane`
- Last Name: `Smith`
- Company: `Second Company`

Verify:
- ✅ Onboarding appears
- ✅ Can complete setup
- ✅ Dashboard loads
- ✅ Supabase has 2 businesses (one per user)

---

## 🐛 DEBUGGING FAILED TESTS

### ❌ Issue: "Please log in to complete your profile"

**Console shows:**
```
❌ [Onboarding] No user in session
```

**Cause:** Email confirmation is enabled or session lost

**Fix:**
1. Go to Supabase → Auth → Settings
2. Disable "Confirm email"
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try signup again with NEW email

---

### ❌ Issue: "Failed to save profile"

**Console shows:**
```
❌ [Onboarding] Business creation failed: new row violates row-level security policy
```

**Cause:** RLS policies not set up

**Fix:**
1. Re-run `COMPLETE-DATABASE-SETUP.sql`
2. Verify policies exist:
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'businesses';
-- Should show 4 policies
```

---

### ❌ Issue: Dashboard stuck on "Loading..."

**Console shows:**
```
🔍 [Dashboard] Checking authentication...
🔍 [Dashboard] Business ID from localStorage: null
🔍 [AuthHelpers] ensureUserBusiness called
⏱️ [AuthHelpers] Backend timeout, using Supabase fallback...
❌ [AuthHelpers] Supabase query error: <error>
```

**Cause:** Can't query businesses table

**Fix:**
1. Check Supabase RLS policies
2. Verify business was created:
```sql
SELECT * FROM businesses WHERE owner_id = '<your-user-id>';
```
3. If no rows → onboarding didn't complete successfully

---

### ❌ Issue: Onboarding modal reopens after completion

**Console shows:**
```
📝 [AuthHelpers] No business found in Supabase
📝 [Dashboard] No workspace found, showing onboarding...
```

**Cause:** Business not in database

**Fix:**
1. Check Supabase businesses table
2. If empty → RLS blocked INSERT
3. Re-run database setup SQL
4. Try onboarding again

---

### ❌ Issue: Mixed Content errors

**Console shows:**
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'
```

**Cause:** Netlify env vars use `http://`

**Fix:**
1. Netlify Dashboard → Environment Variables
2. Change `http://localhost:8080` to `https://api.feasable.org`
3. Trigger new deploy

---

## ✅ SUCCESS CRITERIA

### All These Must Pass:

- [ ] Can sign up with email
- [ ] Onboarding modal is BRIGHT and visible
- [ ] Can fill all onboarding steps
- [ ] "Complete Setup" works without errors
- [ ] Success screen appears
- [ ] Dashboard loads showing user name
- [ ] User metadata in Supabase (first_name, last_name)
- [ ] Business row in Supabase (correct owner_id)
- [ ] Can refresh dashboard without issues
- [ ] Can logout and login again
- [ ] Second account works independently
- [ ] Console shows ✅ logs, no ❌ errors

---

## 📊 EXPECTED CONSOLE OUTPUT (SUCCESS)

### During Sign Up:
```
[No errors - clean signup]
```

### During Onboarding:
```
🔍 [Onboarding] Getting session...
✅ [Onboarding] User authenticated: abc-123
🔍 [Onboarding] Updating user metadata...
✅ [Onboarding] User metadata updated
🔍 [Onboarding] Creating new business in Supabase...
✅ [Onboarding] Business created: def-456
🎉 [Onboarding] Complete! Showing success screen...
```

### On Dashboard Load:
```
🔍 [Dashboard] Checking authentication...
✅ [Dashboard] User authenticated: abc-123
🔍 [Dashboard] Business ID from localStorage: def-456
✅ [Dashboard] Using cached business ID
[Tasks fetch may timeout - this is OK]
```

### On Returning User Login:
```
🔍 [Dashboard] Checking authentication...
✅ [Dashboard] User authenticated: abc-123
🔍 [Dashboard] Business ID from localStorage: def-456
✅ [Dashboard] Using cached business ID
```

---

## 🎬 VIDEO WALKTHROUGH SCRIPT

If recording for demonstration:

1. **Intro** (0:00-0:10)
   - "Testing complete signup flow on FeasableSpaces"
   
2. **Database Setup** (0:10-0:30)
   - Show Supabase SQL editor
   - Run COMPLETE-DATABASE-SETUP.sql
   - Show success messages

3. **Disable Email Confirm** (0:30-0:45)
   - Navigate to Auth settings
   - Toggle off "Confirm email"
   - Save

4. **Sign Up** (0:45-1:30)
   - Navigate to site
   - Open DevTools
   - Fill signup form
   - Show onboarding modal appears
   - Highlight bright styling

5. **Onboarding** (1:30-2:30)
   - Complete all steps
   - Show console logs (green checkmarks)
   - Submit final step
   - Show success screen

6. **Dashboard** (2:30-3:00)
   - Show dashboard loads
   - Point out welcome message
   - Show stats cards

7. **Database Verification** (3:00-3:30)
   - Switch to Supabase
   - Show user in auth.users
   - Show business in businesses table

8. **Session Persistence** (3:30-3:45)
   - Refresh page
   - Show still logged in

9. **Logout/Login** (3:45-4:00)
   - Logout
   - Login again
   - Show dashboard loads without onboarding

10. **Conclusion** (4:00-4:10)
    - "All tests passed! Flow works end-to-end."

---

## 📸 REQUIRED SCREENSHOTS

For bug reporting, capture:

1. **Onboarding Modal** - Full screen showing styling
2. **Console Output** - During onboarding submit
3. **Dashboard** - Showing welcome message
4. **Supabase Users** - User metadata
5. **Supabase Businesses** - Business row
6. **Any Errors** - Full error message in console

---

## ⚡ QUICK TEST (5 Minutes)

Minimal test for rapid iteration:

1. ✅ Run database setup SQL
2. ✅ Disable email confirmation  
3. ✅ Deploy code changes
4. ✅ Sign up with new email
5. ✅ Complete onboarding
6. ✅ Check dashboard loads
7. ✅ Verify business in Supabase

**If all pass → SHIP IT! 🚀**

---

**This testing guide ensures NOTHING is missed. Follow systematically for guaranteed success!**
