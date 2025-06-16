/*
  # Fix Testimonials Table RLS and Auth Access

  1. Changes
    - Create admin_users view for secure email checks
    - Drop existing policies to avoid conflicts
    - Re-enable RLS
    - Create new policies with proper auth checks

  2. Security
    - Uses secure admin check via view
    - Maintains public read access
    - Restricts write operations to admin only
*/

-- Create a secure view for admin checks
CREATE OR REPLACE VIEW admin_users AS
SELECT id 
FROM auth.users 
WHERE email = 'moradiashivam@gmail.com';

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
  TO public
  USING (true);

-- Admin create policy
CREATE POLICY "Only admin can create testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Admin update policy
CREATE POLICY "Only admin can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Admin delete policy
CREATE POLICY "Only admin can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );