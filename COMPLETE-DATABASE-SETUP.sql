-- =====================================================
-- COMPLETE FEASABLESPACES DATABASE SETUP
-- Run this ONCE in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE BUSINESSES TABLE (if doesn't exist)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    industry TEXT,
    company_size TEXT,
    website TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- STEP 2: ADD MISSING COLUMNS (if table already exists)
-- =====================================================

-- Add name column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='name') THEN
    ALTER TABLE businesses ADD COLUMN name TEXT NOT NULL DEFAULT 'My Business';
  END IF;
END $$;

-- Add owner_id column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='owner_id') THEN
    ALTER TABLE businesses ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add industry column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='industry') THEN
    ALTER TABLE businesses ADD COLUMN industry TEXT;
  END IF;
END $$;

-- Add company_size column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='company_size') THEN
    ALTER TABLE businesses ADD COLUMN company_size TEXT;
  END IF;
END $$;

-- Add website column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='website') THEN
    ALTER TABLE businesses ADD COLUMN website TEXT;
  END IF;
END $$;

-- Add description column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='description') THEN
    ALTER TABLE businesses ADD COLUMN description TEXT;
  END IF;
END $$;

-- Add created_at column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='created_at') THEN
    ALTER TABLE businesses ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Add updated_at column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='updated_at') THEN
    ALTER TABLE businesses ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- =====================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at DESC);

-- =====================================================
-- STEP 4: CREATE AUTO-UPDATE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 6: CREATE RLS POLICIES (Replace existing)
-- =====================================================

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can create their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;
DROP POLICY IF EXISTS "Enable read access for own businesses" ON businesses;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON businesses;
DROP POLICY IF EXISTS "Enable update for own businesses" ON businesses;

-- CREATE FRESH POLICIES

-- 1. SELECT: Users can view their own businesses
CREATE POLICY "Users can view their own businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- 2. INSERT: Users can create businesses where they are the owner
CREATE POLICY "Users can create their own businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- 3. UPDATE: Users can update their own businesses
CREATE POLICY "Users can update their own businesses"
  ON businesses FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4. DELETE: Users can delete their own businesses
CREATE POLICY "Users can delete their own businesses"
  ON businesses FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- =====================================================
-- STEP 7: VERIFY SETUP
-- =====================================================

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'businesses'
ORDER BY ordinal_position;

-- Check RLS is enabled
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'businesses';

-- Check policies exist
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'businesses';

-- =====================================================
-- STEP 8: TEST THE SETUP
-- =====================================================

-- This should work (will be your actual user ID when signed in):
-- INSERT INTO businesses (name, owner_id) 
-- VALUES ('Test Company', auth.uid());

-- =====================================================
-- SUCCESS CHECKLIST
-- =====================================================
-- ✅ businesses table created/updated
-- ✅ All required columns exist
-- ✅ Indexes created for performance
-- ✅ Auto-update trigger working
-- ✅ RLS enabled
-- ✅ All 4 policies active (SELECT, INSERT, UPDATE, DELETE)
-- ✅ Ready for onboarding flow!
-- =====================================================

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================
-- 1. User metadata (first_name, last_name, full_name) is stored
--    in auth.users.raw_user_meta_data - no separate table needed
-- 
-- 2. This script is IDEMPOTENT - safe to run multiple times
--
-- 3. If you get "permission denied" errors, make sure you're
--    running this as the postgres user in Supabase SQL Editor
--
-- 4. After running, test by:
--    - Signing up with a new account
--    - Completing onboarding
--    - Checking this query returns your business:
--      SELECT * FROM businesses WHERE owner_id = auth.uid();
-- =====================================================
