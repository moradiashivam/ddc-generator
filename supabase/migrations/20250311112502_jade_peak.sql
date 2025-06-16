/*
  # Create testimonials table policies

  1. Security
    - Enable RLS on testimonials table
    - Add policies for:
      - Public read access
      - Admin full access
      - Public submission
*/

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public to read testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access"
  ON testimonials
  TO authenticated
  USING (auth.email() = 'moradiashivam@gmail.com')
  WITH CHECK (auth.email() = 'moradiashivam@gmail.com');

-- Allow public to submit testimonials
CREATE POLICY "Allow public to submit testimonials"
  ON testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);