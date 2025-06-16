/*
  # Fix Testimonials RLS Policies

  1. Changes
    - Update RLS policies to properly handle admin access
    - Simplify policy conditions using JWT claims
    - Ensure public read access works correctly

  2. Security
    - Maintain RLS enabled
    - Allow public read access
    - Restrict write operations to admin only
    - Use JWT email claim for admin checks
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Anyone can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can create testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can insert testimonials" ON testimonials;

-- Ensure RLS is enabled
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create new policies with simplified conditions

-- Allow anyone to read testimonials (including non-authenticated users)
CREATE POLICY "Anyone can read testimonials"
ON testimonials
FOR SELECT
TO public
USING (true);

-- Allow admin to insert testimonials
CREATE POLICY "Only admin can insert testimonials"
ON testimonials
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text);

-- Allow admin to update testimonials
CREATE POLICY "Only admin can update testimonials"
ON testimonials
FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text);

-- Allow admin to delete testimonials
CREATE POLICY "Only admin can delete testimonials"
ON testimonials
FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text);