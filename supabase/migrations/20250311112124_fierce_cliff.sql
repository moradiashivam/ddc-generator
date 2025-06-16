/*
  # Fix Testimonials Delete Functionality

  1. Changes
    - Drop existing RLS policies
    - Create new policies with proper conditions
    - Ensure admin can perform all operations
    - Allow public to read testimonials

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Restrict admin operations to specific email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON testimonials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for admin"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'moradiashivam@gmail.com');

CREATE POLICY "Enable update for admin"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (auth.email() = 'moradiashivam@gmail.com')
  WITH CHECK (auth.email() = 'moradiashivam@gmail.com');

CREATE POLICY "Enable delete for admin"
  ON testimonials FOR DELETE
  TO authenticated
  USING (auth.email() = 'moradiashivam@gmail.com');