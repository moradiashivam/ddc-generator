// Local storage implementation replacing Supabase
import type { ClassificationLog } from '../types';

const CLASSIFICATION_LOGS_KEY = 'ddc_classification_logs';

export async function saveClassificationLog(log: Omit<ClassificationLog, 'id' | 'timestamp'>): Promise<void> {
  try {
    const logs = getClassificationLogs();
    const newLog: ClassificationLog = {
      id: crypto.randomUUID(),
      inputText: log.inputText,
      number: log.number,
      category: log.category,
      timestamp: Date.now()
    };
    
    logs.unshift(newLog);
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.length = 1000;
    }
    
    localStorage.setItem(CLASSIFICATION_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving classification:', error);
    throw error;
  }
}

export function getClassificationLogs(): ClassificationLog[] {
  try {
    const logs = localStorage.getItem(CLASSIFICATION_LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error fetching classifications:', error);
    return [];
  }
}