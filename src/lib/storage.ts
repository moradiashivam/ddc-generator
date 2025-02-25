import type { ClassificationLog } from '../types';

const CLASSIFICATION_LOG_KEY = 'ddc_classification_log';

export function saveClassificationLog(log: Omit<ClassificationLog, 'id' | 'timestamp'>): void {
  const logs = getClassificationLogs();
  const newLog: ClassificationLog = {
    ...log,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  
  logs.unshift(newLog);
  localStorage.setItem(CLASSIFICATION_LOG_KEY, JSON.stringify(logs));
}

export function getClassificationLogs(): ClassificationLog[] {
  const logs = localStorage.getItem(CLASSIFICATION_LOG_KEY);
  return logs ? JSON.parse(logs) : [];
}