/*
  # Create Testimonials Table with RLS

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `designation` (text) 
      - `text` (text)
      - `image` (text)
      - `order` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS
    - Public read access
    - Admin-only write access using JWT claims
*/

-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  text text NOT NULL,
  image text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
DROP POLICY IF EXISTS "Anyone can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can create testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only admin can insert testimonials" ON testimonials;

-- Create new policies

-- Allow public read access
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
  WITH CHECK (auth.jwt() ->> 'email' = 'moradiashivam@gmail.com');

-- Allow admin to update testimonials
CREATE POLICY "Only admin can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'moradiashivam@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'moradiashivam@gmail.com');

-- Allow admin to delete testimonials
CREATE POLICY "Only admin can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'moradiashivam@gmail.com');