export interface DDCResult {
  number: string;
  category: string;
  description: string;
}

export interface HistoryItem extends DDCResult {
  id: string;
  text: string;
  timestamp: number;
}

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
}

export interface ClassificationLog {
  id: string;
  inputText: string;
  number: string;
  category: string;
  timestamp: number;
}