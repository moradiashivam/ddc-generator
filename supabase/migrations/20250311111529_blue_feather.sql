/*
  # Create testimonials table and policies

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `designation` (text, required)
      - `text` (text, required)
      - `image` (text, required)
      - `order` (integer, for sorting)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on testimonials table
    - Add policies for:
      - Public read access
      - Admin-only write access
*/

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;

-- Drop existing table if exists
DROP TABLE IF EXISTS testimonials;

-- Create testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  text text NOT NULL,
  image text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Only admin can insert testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Anyone can read testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email'::text) = 'moradiashivam@gmail.com'::text);

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

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();