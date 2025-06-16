/*
  # Add classifications table

  1. New Tables
    - `classifications`
      - `id` (uuid, primary key)
      - `input_text` (text)
      - `ddc_number` (text) 
      - `category` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `confidence_score` (float)

  2. Security
    - Enable RLS
    - Add policies for:
      - Users to read their own classifications
      - Users to insert their own classifications 
      - Admin to read all classifications
*/

-- Create classifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  ddc_number text NOT NULL,
  category text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  confidence_score float DEFAULT 1.0
);

-- Enable RLS
ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own classifications" ON classifications;
DROP POLICY IF EXISTS "Users can insert own classifications" ON classifications;
DROP POLICY IF EXISTS "Admin can read all classifications" ON classifications;

-- Create policies
CREATE POLICY "Users can read own classifications"
  ON classifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own classifications"
  ON classifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can read all classifications"
  ON classifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'moradiashivam@gmail.com'
    )
  );