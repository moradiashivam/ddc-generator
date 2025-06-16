/*
  # Create testimonials table with proper constraints

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `designation` (text, required)
      - `text` (text, required)
      - `image` (text, required)
      - `order` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin write access
*/

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
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public to read testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Allow admin to manage testimonials" ON testimonials;
EXCEPTION
  WHEN undefined_object THEN 
    NULL;
END $$;

-- Create policies
CREATE POLICY "Allow public to read testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin to manage testimonials"
  ON testimonials
  USING (auth.email() = 'moradiashivam@gmail.com')
  WITH CHECK (auth.email() = 'moradiashivam@gmail.com');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;

-- Create trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();