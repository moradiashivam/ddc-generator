import { supabase } from './supabase';
import type { ClassificationLog } from '../types';

export async function saveClassificationLog(log: Omit<ClassificationLog, 'id' | 'timestamp'>): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      throw new Error('Authentication required to save classification');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    const insertData = {
      input_text: log.inputText,
      ddc_number: log.number,
      category: log.category,
      user_id: user.id,
    };

    const { error } = await supabase
      .from('classifications')
      .insert([insertData]);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to save classification: ${error.message}`);
    }
  } catch (error) {
    console.error('Error saving classification:', error);
    throw error;
  }
}

export async function getClassificationLogs(): Promise<ClassificationLog[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('classifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching classifications:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      inputText: item.input_text,
      number: item.ddc_number,
      category: item.category,
      timestamp: new Date(item.created_at).getTime()
    }));
  } catch (error) {
    console.error('Error fetching classifications:', error);
    return [];
  }
}