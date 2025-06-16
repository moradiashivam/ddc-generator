import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function subscribeToNewsletter(email: string): Promise<void> {
  const { error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('This email is already subscribed to our newsletter');
    }
    throw new Error('Failed to subscribe. Please try again later.');
  }
}