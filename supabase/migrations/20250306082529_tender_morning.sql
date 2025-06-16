/*
  # Admin Panel Database Schema

  1. New Tables
    - `classifications`
      - `id` (uuid, primary key)
      - `input_text` (text)
      - `ddc_number` (text)
      - `category` (text) 
      - `confidence_score` (float)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `designation` (text)
      - `text` (text)
      - `image` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create classifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  ddc_number text NOT NULL,
  category text NOT NULL,
  confidence_score float DEFAULT 1.0,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  text text NOT NULL,
  image text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Classifications policies
  DROP POLICY IF EXISTS "Users can read own classifications" ON classifications;
  DROP POLICY IF EXISTS "Admin can read all classifications" ON classifications;
  DROP POLICY IF EXISTS "Users can insert own classifications" ON classifications;
  
  -- Testimonials policies
  DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Only admin can insert testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Only admin can update testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Only admin can delete testimonials" ON testimonials;
END $$;

-- Create classifications policies
CREATE POLICY "Users can read own classifications"
  ON classifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can read all classifications"
  ON classifications
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'moradiashivam@gmail.com'
  ));

CREATE POLICY "Users can insert own classifications"
  ON classifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create testimonials policies
CREATE POLICY "Anyone can read testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admin can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'moradiashivam@gmail.com'
  ));

CREATE POLICY "Only admin can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'moradiashivam@gmail.com'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'moradiashivam@gmail.com'
  ));

CREATE POLICY "Only admin can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'moradiashivam@gmail.com'
  ));

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();