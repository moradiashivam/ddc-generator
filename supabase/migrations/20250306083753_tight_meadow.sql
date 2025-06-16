/*
  # Fix Testimonials Table RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-enable RLS
    - Create new policies for:
      - Public read access
      - Admin-only write operations

  2. Security
    - Maintains public read access
    - Restricts write operations to admin only
    - Uses email-based admin check
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can create testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access policy
CREATE POLICY "Anyone can view testimonials"
  ON testimonials
  FOR SELECT
  USING (true);

-- Admin create policy
CREATE POLICY "Only admin can create testimonials"
  ON testimonials
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'moradiashivam@gmail.com'
    )
  );

-- Admin update policy
CREATE POLICY "Only admin can update testimonials"
  ON testimonials
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'moradiashivam@gmail.com'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'moradiashivam@gmail.com'
    )
  );

-- Admin delete policy
CREATE POLICY "Only admin can delete testimonials"
  ON testimonials
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id 
      FROM auth.users 
      WHERE email = 'moradiashivam@gmail.com'
    )
  );