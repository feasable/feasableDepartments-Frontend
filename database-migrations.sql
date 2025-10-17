-- =====================================================
-- lunoSpaces Database Schema Migration
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Ensure businesses table has all required columns
-- This will add columns if they don't exist, or do nothing if they do

-- Add name column if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='businesses' AND column_name='name') THEN
    ALTER TABLE businesses ADD COLUMN name TEXT;
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

-- 2. Create index on owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);

-- 3. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Add trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can create their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update their own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete their own businesses" ON businesses;

-- Allow users to view their own businesses
CREATE POLICY "Users can view their own businesses"
  ON businesses FOR SELECT
  USING (auth.uid() = owner_id);

-- Allow users to create businesses
CREATE POLICY "Users can create their own businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own businesses
CREATE POLICY "Users can update their own businesses"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow users to delete their own businesses
CREATE POLICY "Users can delete their own businesses"
  ON businesses FOR DELETE
  USING (auth.uid() = owner_id);

-- 7. Verify the schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'businesses'
ORDER BY ordinal_position;

-- =====================================================
-- Success! Your database is now ready.
-- User metadata (first_name, last_name, full_name) is stored 
-- automatically by Supabase in auth.users.raw_user_meta_data
-- =====================================================
