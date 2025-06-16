/*
  # Remove sample testimonials

  1. Changes
    - Delete all existing testimonials from the table
    - Reset the table to empty state

  2. Security
    - Maintains existing RLS policies
    - Does not affect table structure
*/

-- Remove all existing testimonials
DELETE FROM testimonials;