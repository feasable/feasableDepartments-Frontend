# 🔄 Complete Auth Flow - Visual Diagram

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FeasableSpaces Auth System               │
├─────────────────────────────────────────────────────────────┤
│  Supabase Auth  →  User Metadata  →  Business Creation     │
│       ↓                  ↓                    ↓              │
│   Session         Name Storage         Workspace            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Flow 1: New User Signup (Email)

```
┌──────────┐
│  /signup │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Enter Email     │
│ Enter Password  │
│ Click "Create"  │
└────┬────────────┘
     │
     ▼
┌───────────────────────┐
│ Supabase Auth         │
│ - Create user account │
│ - Generate session    │
└────┬──────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Onboarding Wizard Appears  │
│                            │
│ Step 1: Welcome 👋         │
│ Step 2: Name (John Doe)    │
│ Step 3: Company (Acme Inc) │
│ Step 4: Details (optional) │
│ Step 5: Success! 🎉        │
└────┬───────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│ Save Data:                  │
│ 1. User metadata            │
│    - first_name: "John"     │
│    - last_name: "Doe"       │
│    - full_name: "John Doe"  │
│                             │
│ 2. Create business          │
│    - POST /businesses       │
│    - name: "Acme Inc"       │
│    - industry, size, etc.   │
│                             │
│ 3. localStorage             │
│    - businessId: "uuid"     │
└────┬────────────────────────┘
     │
     ▼
┌──────────────────┐
│   /dashboard     │
│                  │
│ Welcome, John! 👋│
│ Stats: 0/0/0/0   │
│ Quick Actions    │
│ Recent Activity  │
└──────────────────┘
```

---

## 🎯 Flow 2: New User Signup (Google OAuth)

```
┌──────────┐
│  /signup │
└────┬─────┘
     │
     ▼
┌──────────────────────┐
│ Click "Continue with │
│      Google"         │
└────┬─────────────────┘
     │
     ▼
┌───────────────────────┐
│ Google Auth Screen    │
│ - Select account      │
│ - Grant permissions   │
└────┬──────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Callback: /auth/callback   │
│ - Exchange code for session│
│ - Redirect to /dashboard   │
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────┐
│ Dashboard checks auth  │
│ - Has session? ✅      │
│ - Has business? ❌     │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Onboarding Wizard Appears  │
│ (Same 5 steps as email)    │
└────┬───────────────────────┘
     │
     ▼
┌──────────────────┐
│   /dashboard     │
│ Fully set up! ✅ │
└──────────────────┘
```

---

## 🎯 Flow 3: Returning User Login (Email)

```
┌─────────┐
│ /login  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Enter Email     │
│ Enter Password  │
│ Click "Sign In" │
└────┬────────────┘
     │
     ▼
┌──────────────────────┐
│ Supabase Auth        │
│ - Verify credentials │
│ - Create session     │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Redirect /dashboard  │
└────┬─────────────────┘
     │
     ▼
┌────────────────────────┐
│ Dashboard checks:      │
│ - Has session? ✅      │
│ - Has business? ✅     │
└────┬───────────────────┘
     │
     ▼
┌──────────────────┐
│   /dashboard     │
│                  │
│ Welcome back! 👋 │
│ Your actual data │
│ Task list shown  │
└──────────────────┘

NO ONBOARDING - Goes straight to dashboard
```

---

## 🎯 Flow 4: Already Logged In Protection

```
┌─────────────────────┐
│ User already has    │
│ active session      │
└────┬────────────────┘
     │
     ├──────────────┐
     ▼              ▼
┌─────────┐    ┌──────────┐
│ /login  │    │ /signup  │
└────┬────┘    └────┬─────┘
     │              │
     ▼              ▼
┌────────────────────────┐
│ useEffect checks:      │
│ - getSession()         │
│ - Has session? ✅      │
└────┬───────────────────┘
     │
     ▼
┌─────────────────────────┐
│ Immediate redirect to:  │
│      /dashboard         │
└─────────────────────────┘

Prevents confusion & errors
```

---

## 🎯 Flow 5: Protected Route Access

```
┌────────────────────────┐
│ User visits /dashboard │
│ or /departments/*      │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────┐
│ Check authentication   │
└────┬───────────────────┘
     │
     ├───────────┬────────────┐
     ▼           ▼            ▼
┌─────────┐ ┌──────────┐ ┌─────────────┐
│ No      │ │ Yes, but │ │ Yes, with   │
│ session │ │ no       │ │ business    │
│         │ │ business │ │             │
└────┬────┘ └────┬─────┘ └─────┬───────┘
     │           │              │
     ▼           ▼              ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐
│ /login  │ │Onboarding│ │Show dashboard│
└─────────┘ │ Wizard   │ └──────────────┘
            └──────────┘
```

---

## 🔍 Data Flow Details

### User Metadata (Stored in auth.users)
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "user_metadata": {
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe"
  },
  "created_at": "2025-10-01T00:00:00Z"
}
```

### Business Record (Stored in businesses table)
```json
{
  "id": "business-uuid",
  "owner_id": "user-uuid",
  "name": "Acme Inc",
  "industry": "Technology",
  "company_size": "11-50",
  "website": "https://acme.com",
  "description": "We build great products",
  "created_at": "2025-10-01T00:00:00Z",
  "updated_at": "2025-10-01T00:00:00Z"
}
```

### localStorage
```javascript
{
  "businessId": "business-uuid",
  "companyProfileCompleted": "true"
}
```

---

## 🛡️ Security Flow

```
┌──────────────────────┐
│ User makes request   │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Frontend checks:     │
│ - Has session?       │
│ - Valid token?       │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Backend API checks:  │
│ - Valid auth header? │
│ - User exists?       │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Database RLS checks: │
│ - auth.uid() match?  │
│ - Policy allows?     │
└────┬─────────────────┘
     │
     ▼
┌──────────────────────┐
│ Action allowed ✅    │
└──────────────────────┘
```

---

## 🎨 UI State Flow

### Onboarding Wizard States
```
┌──────────┐
│ Welcome  │ → Button: "Get Started"
└────┬─────┘
     ▼
┌──────────┐
│ Personal │ → Required: First & Last Name
└────┬─────┘   Buttons: "Back" | "Continue"
     ▼
┌──────────┐
│ Company  │ → Required: Company Name
└────┬─────┘   Optional: Industry, Size
     ▼         Buttons: "Back" | "Continue"
┌──────────┐
│ Details  │ → Optional: Website, Description
└────┬─────┘   Buttons: "Back" | "Complete Setup"
     ▼
┌──────────┐
│ Success  │ → Button: "Go to Dashboard"
└──────────┘
```

### Dashboard States
```
Loading State:
┌────────────────────┐
│ 🔄 Loading your   │
│    workspace...    │
└────────────────────┘

Empty State (No Tasks):
┌────────────────────┐
│ ✨ No tasks yet    │
│ Get started by...  │
│ [Explore Spaces]   │
└────────────────────┘

Active State:
┌────────────────────┐
│ Welcome, John! 👋  │
│ Stats: 10/5/3/2    │
│ Recent Activity    │
│ [Task list...]     │
└────────────────────┘
```

---

## 🔄 Session Management

```
┌─────────────────────────────────────┐
│        Session Lifecycle            │
├─────────────────────────────────────┤
│ 1. Login/Signup                     │
│    → Supabase creates session       │
│    → JWT token issued               │
│    → Stored in HTTP-only cookie     │
│                                     │
│ 2. Navigation                       │
│    → getSession() on each page      │
│    → Validates token                │
│    → Refreshes if needed            │
│                                     │
│ 3. Sign Out                         │
│    → supabase.auth.signOut()        │
│    → Clear session                  │
│    → Clear localStorage             │
│    → Redirect to homepage           │
└─────────────────────────────────────┘
```

---

## 📱 Mobile Flow Considerations

```
Desktop:
┌─────────────────┐
│ Mouse hover     │
│ Click events    │
│ Keyboard input  │
└─────────────────┘

Mobile:
┌─────────────────┐
│ Touch events    │
│ Passive scroll  │ ← FIXED!
│ Tap to interact │
└─────────────────┘

Wave Background:
- Desktop: Mouse tracking ✅
- Mobile: Touch tracking ✅
- Mobile: Scroll enabled ✅ (passive: true)
```

---

## 🎯 Critical Decision Points

### 1. After Auth Callback
```
Has session?
├─ Yes → Check business
│         ├─ Has business? → /dashboard (load data)
│         └─ No business?  → /dashboard (show onboarding)
└─ No  → /login
```

### 2. On Dashboard Load
```
Check auth?
├─ Not logged in → /login
├─ Logged in, no business → Show onboarding wizard
└─ Logged in, has business → Load dashboard data
```

### 3. On Login/Signup Page Load
```
Already logged in?
├─ Yes → /dashboard (avoid confusion)
└─ No  → Show login/signup form
```

---

## ✅ Success Indicators

At each step, verify:

1. **After Signup:** ✅ Onboarding wizard appears
2. **After Onboarding:** ✅ Dashboard loads with welcome message
3. **After Login:** ✅ Goes straight to dashboard
4. **On Protected Route:** ✅ Redirects if not authenticated
5. **On Login/Signup:** ✅ Redirects if already authenticated
6. **In Navbar:** ✅ Shows "FirstName L." format
7. **In Database:** ✅ User metadata and business saved
8. **On Mobile:** ✅ Everything scrolls and works

---

## 🚀 The Result

A seamless, professional authentication experience that:
- ✅ Never confuses users
- ✅ Handles all edge cases
- ✅ Collects complete data
- ✅ Looks beautiful
- ✅ Works on all devices
- ✅ Is secure by default

**Ship it with confidence! 🎊**
