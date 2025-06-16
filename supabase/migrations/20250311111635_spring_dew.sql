/*
  # Update testimonials RLS policies

  1. Changes
    - Update RLS policies to allow public submissions
    - Keep admin-only update/delete policies
    - Keep public read access

  2. Security
    - Anyone can submit testimonials
    - Only admin can update/delete testimonials
    - Everyone can read testimonials
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;

-- Create updated policies
CREATE POLICY "Anyone can read testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can submit testimonials"
  ON testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admin can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text)
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text);

CREATE POLICY "Only admin can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text);