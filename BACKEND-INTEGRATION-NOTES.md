# 🔌 Backend Integration Points

This document tracks all places where the frontend will connect to the backend API once it's ready.

---

## 🚨 Current State

**Backend Status:** ❌ NOT DEPLOYED  
**Frontend Mode:** ✅ Works WITHOUT backend (Supabase fallback)  
**Production URL:** https://spaces.luno.org

---

## 📍 Integration Points

### 1. **Business Creation** (Onboarding)
**File:** `src/components/onboarding/OnboardingWizard.tsx`  
**Line:** 98-101

**Current Behavior:**
- Creates business directly in Supabase `businesses` table
- Works perfectly without backend

**When Backend is Ready:**
```typescript
// REPLACE THIS:
const { data: newBusiness, error: createError } = await supabase
  .from('businesses')
  .insert({
    name: formData.companyName,
    owner_id: user.id,
    industry: formData.industry || null,
    company_size: formData.companySize || null,
    website: formData.website || null,
    description: formData.description || null,
  })
  .select()
  .single()

// WITH THIS:
const response = await fetch('/api/backend/v1/businesses/bootstrap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.companyName,
    industry: formData.industry,
    company_size: formData.companySize,
    website: formData.website,
    description: formData.description,
    createDefaults: true
  })
})

if (!response.ok) {
  const error = await response.json()
  throw new Error(error.message || 'Failed to create workspace')
}

const newBusiness = await response.json()
localStorage.setItem('businessId', newBusiness.business.id)
```

**Backend API Expected:**
- **Endpoint:** `POST /v1/businesses/bootstrap`
- **Auth:** Bearer token (Supabase JWT)
- **Request Body:**
  ```json
  {
    "name": "string",
    "industry": "string | null",
    "company_size": "string | null",
    "website": "string | null",
    "description": "string | null",
    "createDefaults": true
  }
  ```
- **Response:**
  ```json
  {
    "business": {
      "id": "uuid",
      "name": "string",
      "owner_id": "uuid",
      ...
    }
  }
  ```

---

### 2. **User Business Lookup** (Dashboard Load)
**File:** `src/lib/auth-helpers.ts`  
**Line:** 14-16

**Current Behavior:**
- Tries backend with 5s timeout
- Falls back to Supabase query on timeout/503
- Works perfectly without backend

**When Backend is Ready:**
```typescript
// Current code already handles this correctly:
const response = await fetch('/api/backend/v1/me', {
  signal: AbortSignal.timeout(5000)
})

// Backend will return user data with businesses
if (response.ok) {
  const userData = await response.json()
  if (userData.businesses && userData.businesses.length > 0) {
    return userData.businesses[0].id
  }
}
```

**Backend API Expected:**
- **Endpoint:** `GET /v1/me`
- **Auth:** Bearer token (Supabase JWT)
- **Response:**
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "string",
      "first_name": "string",
      "last_name": "string"
    },
    "businesses": [
      {
        "id": "uuid",
        "name": "string",
        "role": "owner"
      }
    ]
  }
  ```

---

### 3. **Task Fetching** (Dashboard)
**File:** `src/app/dashboard/page.tsx`  
**Line:** 94

**Current Behavior:**
- Calls `/api/backend/v1/tasks?businessId=xxx`
- Times out after 5s
- Dashboard still loads (shows empty state)

**When Backend is Ready:**
```typescript
// Already implemented correctly:
const data = await backend<{ tasks: Task[] }>(`/v1/tasks?businessId=${id}&limit=20`)
setTasks(data.tasks || [])
```

**Backend API Expected:**
- **Endpoint:** `GET /v1/tasks?businessId={uuid}&limit={number}`
- **Auth:** Bearer token (Supabase JWT)
- **Response:**
  ```json
  {
    "tasks": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "status": "queued | in_progress | completed",
        "priority": "low | medium | high",
        "department": "string",
        "created_at": "ISO8601"
      }
    ]
  }
  ```

---

## 🔧 Backend Proxy Configuration

**File:** `src/app/api/backend/[...path]/route.ts`

This Next.js API route proxies all `/api/backend/*` requests to your backend:

```typescript
// Local Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

// Production
NEXT_PUBLIC_API_BASE_URL=https://api.luno.org
```

**Features:**
- ✅ Automatic JWT token attachment
- ✅ 5-second timeout (prevents hanging)
- ✅ Proper error handling (503 on failure)
- ✅ Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)

---

## 🌐 Environment Variables

### Local Development (`.env.local`)
```bash
# Backend API (local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_AGENT_API_BASE=http://localhost:8000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zoqqrvmfumzfnhdrgjyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Production (Netlify)
**Go to:** Netlify Dashboard → Site Settings → Environment Variables

Add these:
```bash
# Backend API (production) - ⚠️ MUST BE HTTPS
NEXT_PUBLIC_API_BASE_URL=https://api.luno.org

# Agent API (if different)
NEXT_PUBLIC_AGENT_API_BASE=https://agent.luno.org

# Supabase (same as local)
NEXT_PUBLIC_SUPABASE_URL=https://zoqqrvmfumzfnhdrgjyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**CRITICAL:** 
- ❌ DO NOT use `http://` URLs in production (causes Mixed Content errors)
- ✅ ALWAYS use `https://` for production backend URLs
- ❌ DO NOT use `localhost` URLs in Netlify env vars

---

## 🚀 Deployment Checklist

### Before Backend Deployment
- [x] Frontend works without backend
- [x] Supabase fallbacks implemented
- [x] Timeout handling in place
- [x] Error messages user-friendly

### When Backend is Ready
- [ ] Deploy backend to production (https://api.luno.org)
- [ ] Update Netlify env vars with production backend URL
- [ ] Test `/v1/me` endpoint returns user data
- [ ] Test `/v1/businesses/bootstrap` creates business
- [ ] Test `/v1/tasks` returns task list
- [ ] (Optional) Replace Supabase direct calls with backend calls in onboarding

### After Backend Integration
- [ ] Remove Supabase fallback code (if desired)
- [ ] Monitor backend response times
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

---

## 🧪 Testing Without Backend

### Onboarding Flow
1. Sign up with new account
2. Fill out onboarding wizard
3. Click "Complete Setup"
4. ✅ Business created in Supabase
5. ✅ Redirects to dashboard
6. ✅ No "Failed to fetch" errors

### Dashboard Flow
1. Login with existing account
2. Dashboard loads
3. ✅ Times out after 5s (expected)
4. ✅ Falls back to Supabase
5. ✅ Loads business from database
6. ✅ Shows empty task state

---

## 📝 Code Comments

All backend integration points are marked with:
```typescript
// ⚠️ BACKEND INTEGRATION POINT #N: Description
// TODO: When backend is ready, ...
```

Search for `BACKEND INTEGRATION POINT` in the codebase to find all locations.

---

## 🐛 Common Issues

### Issue: "Mixed Content" errors
**Cause:** Using `http://` URLs on HTTPS production site  
**Fix:** Update Netlify env vars to use `https://` backend URLs

### Issue: Dashboard stuck on "Loading your workspace..."
**Cause:** Backend timeout not working  
**Fix:** Check `src/app/api/backend/[...path]/route.ts` has `signal: AbortSignal.timeout(5000)`

### Issue: Onboarding "Failed to fetch" error
**Cause:** Trying to call non-existent backend API  
**Fix:** Ensure onboarding uses Supabase direct insert (already implemented)

---

## 📞 Need Help?

When integrating the backend:
1. Start with the `/v1/me` endpoint (simplest)
2. Then add `/v1/businesses/bootstrap`
3. Finally add `/v1/tasks`

Test each endpoint independently before integrating with frontend.

---

**Last Updated:** 2025-10-01  
**Status:** ✅ Frontend works standalone, ready for backend integration anytime
