/*
  # Add sample testimonials

  1. Data
    - Insert sample testimonials with proper ordering
    - Use high-quality stock photos from Unsplash
    - Include diverse professional backgrounds

  2. Content
    - Realistic testimonials for DDC classification tool
    - Professional designations related to library science
    - Varied testimonial lengths and styles
*/

-- Insert sample testimonials
INSERT INTO testimonials (name, designation, text, image, "order") VALUES
(
  'Dr. Sarah Mitchell',
  'Head Librarian, University of California',
  'The DDC Number Generator has revolutionized our cataloging process. What used to take hours now takes minutes, and the accuracy is remarkable. This tool has become indispensable for our library operations.',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
  0
),
(
  'Michael Chen',
  'Information Systems Librarian, Stanford University',
  'As someone who processes hundreds of new acquisitions monthly, this AI-powered classification tool has been a game-changer. The confidence scores help me quickly identify which classifications need review.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  1
),
(
  'Prof. Emily Rodriguez',
  'Library Science Department, Columbia University',
  'I use this tool both for research and teaching. My students love how intuitive it is, and it helps them understand DDC principles better. The accuracy consistently exceeds 95%.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  2
),
(
  'James Thompson',
  'Digital Collections Manager, Harvard Library',
  'The bulk classification feature saved us weeks of work during our digital archive migration. Being able to process thousands of items efficiently while maintaining quality is incredible.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  3
),
(
  'Dr. Priya Patel',
  'Research Librarian, MIT Libraries',
  'The API integration capabilities make this tool perfect for our automated workflows. The documentation is excellent and the support team is very responsive.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
  4
),
(
  'Robert Kim',
  'Cataloging Specialist, New York Public Library',
  'After 15 years in cataloging, I can confidently say this is the most accurate automated DDC tool I have ever used. It understands context and nuance remarkably well.',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  5
);