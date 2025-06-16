import { supabase } from './supabase';

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  text: string;
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}

export async function saveTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<Testimonial> {
  try {
    // Get the current maximum order value
    const { data: maxOrderResult } = await supabase
      .from('testimonials')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrderResult?.order ?? -1) + 1;

    // Insert new testimonial
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ ...testimonial, order: nextOrder }])
      .select('*');

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to save testimonial');

    return data[0];
  } catch (error) {
    console.error('Error saving testimonial:', error);
    throw error;
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  try {
    // First verify the testimonial exists
    const { data: existing, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id);

    if (fetchError) throw fetchError;
    if (!existing || existing.length === 0) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }

    // Remove readonly fields from updates
    const { id: _id, created_at: _ca, updated_at: _ua, ...validUpdates } = updates;

    // Perform update
    const { data, error } = await supabase
      .from('testimonials')
      .update(validUpdates)
      .eq('id', id)
      .select('*');

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to update testimonial');

    return data[0];
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

export async function reorderTestimonials(orderedIds: string[]): Promise<void> {
  try {
    const updates = orderedIds.map((id, index) => ({
      id,
      order: index
    }));

    const { error } = await supabase
      .from('testimonials')
      .upsert(updates, {
        onConflict: 'id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    throw error;
  }
}