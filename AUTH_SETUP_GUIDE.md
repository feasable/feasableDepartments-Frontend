# Complete Auth Flow Setup Guide

## ✅ What's Been Built

Your authentication system now includes a **comprehensive 8-step onboarding flow** that collects business intelligence to personalize the user experience.

### Complete User Journeys

#### 🆕 New User Flow (Email Signup)
1. **Email Entry** - User enters email
2. **System Check** - 1-second check if user exists (loading animation)
3. **Personal Info** - First name, Last name
4. **Company Info** - Company name, Company size (1, 2-10, 11-50, etc.)
5. **Role Selection** - Job title (Founder/CEO, Manager, Engineer, etc.)
6. **Department Needs** - Multi-select Spaces they need (Sales, Marketing, HR, etc.)
7. **Primary Goal** - What they want to achieve
8. **Password Creation** - Create password (min 6 chars)
9. **Password Confirmation** - Confirm password
10. **Success** - Confetti animation → Redirect to dashboard

#### 🔙 Existing User Flow
1. **Email Entry** - User enters email
2. **System Check** - Detects existing user
3. **Welcome Back** - Shows "Welcome back!" message
4. **Password** - Enter password
5. **Sign In** - Redirect to dashboard

#### 🔐 OAuth Flow (Google/GitHub)
1. **Click OAuth Button** - Google or GitHub
2. **OAuth Provider** - Authenticate with provider
3. **Callback** - Return to app
4. **Dashboard** - Redirect (can add onboarding check later)

---

## 🗄️ Database Setup

### Step 1: Run SQL in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire contents of `database/schema.sql`
5. Click **Run**

This will create:
- `user_profiles` table with all onboarding fields
- Row Level Security (RLS) policies
- Automatic profile creation trigger
- Updated_at trigger

### Step 2: Verify Table Creation

Run this query to verify:
```sql
SELECT * FROM user_profiles LIMIT 1;
```

---

## 🧪 Testing the Complete Flow

### Test Scenario 1: New User Signup

1. Go to `http://localhost:3001/auth`
2. Enter a **new email** (one that doesn't exist in your system)
3. Click "Continue"
4. **Watch the flow:**
   - Loading animation (1 second)
   - "Welcome!" appears
   - Progress bar shows "Step 2 of 8"
5. Fill out each step:
   - Name: John Doe
   - Company: Acme Inc, Size: 11-50
   - Role: Founder/CEO
   - Spaces: Sales, Marketing (multi-select)
   - Goal: Save time on repetitive tasks
   - Password: test123 (or stronger)
   - Confirm: test123
6. **Expected result:**
   - Confetti animation 🎉
   - Redirect to dashboard after 1.5 seconds
   - User profile saved in `user_profiles` table

### Test Scenario 2: Existing User Login

1. Go to `http://localhost:3001/auth`
2. Enter the **same email** you just signed up with
3. Click "Continue"
4. **Watch the flow:**
   - Loading animation (1 second)
   - "Welcome back!" appears
   - Shows password field immediately
5. Enter your password
6. Click "Sign in"
7. **Expected result:**
   - Redirected to dashboard
   - No onboarding steps shown

### Test Scenario 3: OAuth (Google)

1. Go to `http://localhost:3001/auth`
2. Click "Continue with Google"
3. Authenticate with Google
4. **Expected result:**
   - Redirected to dashboard
   - User created in Supabase auth
   - Basic profile created (we can add onboarding check later)

### Test Scenario 4: Validation & Errors

Test these edge cases:
- Enter invalid email format (should disable Continue button)
- Try to continue without filling required fields (buttons disabled)
- Enter mismatched passwords (shows error message)
- Click "Back" buttons (should go to previous step, data preserved)
- Close browser and return (data NOT preserved - by design)

---

## 📊 Data Collected & How to Use It

The system now collects rich data about each user:

### Personal Info
- `first_name`, `last_name` - For personalization ("Hi John!")
- `email` - Primary identifier

### Business Context
- `company_name` - Company they work for
- `company_size` - Scale of operations (1 → 1000+)
- `role` - Their position/responsibility

### Product Intelligence
- `Spaces` (array) - Which AI Spaces they need
  - Use this to pre-configure their dashboard
  - Show relevant onboarding tips
  - Suggest workflows
- `primary_goal` - Why they signed up
  - Tailor messaging
  - Show relevant case studies
  - Measure if they achieved it

### Example: Personalizing Dashboard

```typescript
// In your dashboard page
const profile = await getUserProfile(user.id)

if (profile.primary_goal === 'Save time on repetitive tasks') {
  // Show automation quick-start guide
}

if (profile.Spaces.includes('Sales')) {
  // Show sales AI department card prominently
}

if (profile.company_size === '1') {
  // Show solo founder tips
} else if (profile.company_size === '201-1000') {
  // Show enterprise features
}
```

---

## 🔧 Configuration

### OAuth Setup (if not done)

#### Google OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add authorized redirect URLs:
   - `http://localhost:3001/auth/callback`
   - `https://your-domain.com/auth/callback`

#### GitHub OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable GitHub
3. Add authorized redirect URLs (same as above)

---

## 🎨 UI/UX Features

### Progress Indicator
- Shows "Step X of 8" during onboarding
- Animated progress bar at the top
- Helps users understand how long the process is

### Smooth Animations
- Framer Motion for step transitions
- Fade in/out between screens
- Confetti on success

### Validation
- Real-time email validation
- Disabled buttons until data is complete
- Error messages for password mismatch

### Responsive Design
- Works on mobile, tablet, desktop
- Touch-friendly buttons
- Readable text sizes

---

## 📁 File Structure

```
src/
├── app/
│   └── auth/
│       └── page.tsx          # Complete auth flow (8 steps)
├── types/
│   └── user.ts               # TypeScript types
├── lib/
│   └── user-profile.ts       # Helper functions
└── database/
    └── schema.sql            # Database schema
```

---

## 🚀 Next Steps

### Immediate
1. ✅ Run the SQL schema in Supabase
2. ✅ Test the complete flow
3. ✅ Verify data is saved in `user_profiles` table

### Enhancement Ideas
1. **Email Verification** - Add email confirmation step
2. **OAuth Onboarding** - Check if OAuth users completed onboarding
3. **Phone Number** - Add optional phone field
4. **Industry Selection** - Add company industry dropdown
5. **Profile Editing** - Let users update their profile later
6. **Skip Option** - Add "Skip for now" on optional steps
7. **Analytics** - Track where users drop off

### Dashboard Integration
1. Use profile data to personalize dashboard
2. Show relevant Spaces based on selection
3. Display personalized onboarding tips
4. Track if they achieved their primary goal

---

## 🐛 Troubleshooting

### "Cannot find module '@/types/user'"
- Make sure `src/types/user.ts` exists
- Restart your dev server

### "Table 'user_profiles' does not exist"
- Run the SQL schema in Supabase SQL Editor
- Verify table was created

### OAuth redirect not working
- Check redirect URLs in Supabase dashboard
- Make sure they match your app's URL

### Password validation failing
- Supabase requires minimum 6 characters by default
- Change in Supabase Settings → Authentication if needed

### Data not saving after signup
- Check browser console for errors
- Verify RLS policies in Supabase
- Check if user was created in `auth.users` table

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify all files were created correctly
4. Make sure the SQL schema was run successfully

---

**Built with:** Next.js 14, Supabase, TypeScript, Framer Motion, Tailwind CSS
